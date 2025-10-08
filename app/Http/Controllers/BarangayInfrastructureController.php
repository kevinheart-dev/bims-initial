<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayInfrastructure;
use App\Http\Requests\StoreBarangayInfrastructureRequest;
use App\Http\Requests\UpdateBarangayInfrastructureRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Str;

class BarangayInfrastructureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;

        // Base query
        $query = BarangayInfrastructure::query()
            ->where('barangay_id', $brgy_id)
            ->orderBy('created_at', 'desc');

        // Optional filters
        if (request()->filled('infra_type') && request('infra_type') !== 'All') {
            $query->where('infrastructure_type', request('infra_type'));
        }

        if (request()->filled('infra_category') && request('infra_category') !== 'All') {
            $query->where('infrastructure_category', request('infra_category'));
        }

        if (request()->filled('created_at')) {
            $query->whereDate('created_at', request('created_at'));
        }

        if (request()->filled('updated_at')) {
            $query->whereDate('updated_at', request('updated_at'));
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('infrastructure_type', 'like', '%' . request('name') . '%')
                    ->orWhere('infrastructure_category', 'like', '%' . request('name') . '%');
            });
        }
        // Paginate and keep query string
        $infrastructure = $query->paginate(10)->withQueryString();
        $types = BarangayInfrastructure::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('infrastructure_type');

        $categories = BarangayInfrastructure::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('infrastructure_category');

        return response()->json([
            'infrastructure' => $infrastructure,
            'types' => $types,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBarangayInfrastructureRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();
        try {
            if (!empty($data['infrastructures']) && is_array($data['infrastructures'])) {
                foreach ($data['infrastructures'] as $infra) {
                    $imagePath = $infra['infrastructure_image'] ?? null;

                    // If it's a file upload, store it
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'infrastructure/' . $barangaySlug . '/' . Str::slug($infra['infrastructure_type']) . '-' . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    BarangayInfrastructure::create([
                        'barangay_id'             => $brgy_id,
                        'infrastructure_image'    => $imagePath, // either stored file or existing string
                        'infrastructure_category' => $infra['infrastructure_category'],
                        'infrastructure_type'     => $infra['infrastructure_type'],
                        'quantity'                => $infra['quantity'] ?? 0,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Infrastructure(s) saved successfully.',
                    'activeTab' => 'infrastructure'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Infrastructure(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayInfrastructureRequest $request, BarangayInfrastructure $barangayInfrastructure)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['infrastructures']) && is_array($data['infrastructures'])) {
                foreach ($data['infrastructures'] as $infra) {
                    if (empty($data['infrastructure_id'])) {
                        return back()->with(
                            'error',
                            'Infrastructure(s) could not be updated: No id provided'
                        );
                    }

                    $existingInfra = BarangayInfrastructure::where('barangay_id', $brgy_id)
                        ->where('id', $data['infrastructure_id'])
                        ->first();

                    if ($existingInfra) {
                        $imagePath = $infra['infrastructure_image'] ?? $existingInfra->infrastructure_image;

                        if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                            // Delete old image if it exists
                            if ($existingInfra->infrastructure_image && Storage::disk('public')->exists($existingInfra->infrastructure_image)) {
                                // Delete the file
                                Storage::disk('public')->delete($existingInfra->infrastructure_image);

                                // Delete the folder if empty
                                $folder = dirname($existingInfra->infrastructure_image);
                                if (Storage::disk('public')->exists($folder) && empty(Storage::disk('public')->files($folder))) {
                                    Storage::disk('public')->deleteDirectory($folder);
                                }
                            }

                            // Store new file
                            $folder = "infrastructure/{$barangaySlug}/" . Str::slug($infra['infrastructure_type']) . '-' . Str::random(10);
                            $imagePath = $imagePath->store($folder, 'public');
                        }

                        $existingInfra->update([
                            'infrastructure_image'    => $imagePath,
                            'infrastructure_category' => $infra['infrastructure_category'] ?? $existingInfra->infrastructure_category,
                            'infrastructure_type'     => $infra['infrastructure_type'] ?? $existingInfra->infrastructure_type,
                            'quantity'                => $infra['quantity'] ?? $existingInfra->quantity,
                        ]);
                    }
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Infrastructure(s) updated successfully.',
                    'activeTab' => 'infrastructure'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Infrastructure(s) could not be updated: ' . $e->getMessage()
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayInfrastructure $barangayInfrastructure)
    {
        try {
            if ($barangayInfrastructure->infrastructure_image && Storage::disk('public')->exists($barangayInfrastructure->infrastructure_image)) {
                // Delete the file
                Storage::disk('public')->delete($barangayInfrastructure->infrastructure_image);

                // Delete the folder if empty
                $folder = dirname($barangayInfrastructure->infrastructure_image);
                if (empty(Storage::disk('public')->files($folder))) {
                    Storage::disk('public')->deleteDirectory($folder);
                }
            }

            $barangayInfrastructure->delete();

        return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Infrastructure deleted successfully!',
                    'activeTab' => 'infrastructure'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Infrastructure could not be deleted: ' . $e->getMessage());
        }
    }

    public function infrastructureDetails($id){
        $infra = BarangayInfrastructure::findOrFail($id);
        return response()->json([
            'infra' => $infra,
        ]);
    }
}

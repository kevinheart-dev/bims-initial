<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayRoad;
use App\Http\Requests\StoreBarangayRoadRequest;
use App\Http\Requests\UpdateBarangayRoadRequest;
use DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Str;

class BarangayRoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Base query
        $query = BarangayRoad::query()
            ->where('barangay_id', $brgy_id)
            ->orderBy('created_at', 'desc');

        // Optional filters
        if (request()->filled('road_type') && request('road_type') !== 'All') {
            $query->where('road_type', request('road_type'));
        }

        if (request()->filled('maintained_by') && request('maintained_by') !== 'All') {
            $query->where('maintained_by', request('maintained_by'));
        }

        if (request()->filled('status') && request('status') !== 'All') {
            $query->where('status', request('status'));
        }

        if (request()->filled('condition') && request('condition') !== 'All') {
            $query->where('condition', request('condition'));
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('length', 'like', '%' . request('name') . '%');
            });
        }

        // Paginate and keep query string
        $roads = $query->paginate(10)->withQueryString();

        // Distinct dropdown filters
        $types = BarangayRoad::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('road_type');

        $maintains = BarangayRoad::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('maintained_by');

        // Return Inertia page instead of JSON
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayRoad/RoadIndex', [
            'roads' => $roads,
            'types' => $types,
            'maintains' => $maintains,
            'queryParams' => request()->query() ?: null,
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
    public function store(StoreBarangayRoadRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['roads']) && is_array($data['roads'])) {
                foreach ($data['roads'] as $road) {
                    $imagePath = $road['road_image'] ?? null;

                    // Handle file upload
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'road/' . $barangaySlug . '/' . Str::slug($road['road_type']) . '-' . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    BarangayRoad::create([
                        'barangay_id'   => $brgy_id,
                        'road_type'     => $road['road_type'],
                        'road_image'    => $imagePath,
                        'length'        => $road['length'],
                        'condition'     => $road['condition'],
                        'status'        => $road['status'],
                        'maintained_by' => $road['maintained_by'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_road.index')
                ->with('success' ,'Road(s) saved successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Road(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRoadRequest $request, BarangayRoad $barangayRoad)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['roads']) && is_array($data['roads'])) {
                foreach ($data['roads'] as $road) {
                    $imagePath = $barangayRoad->road_image; // default to old one

                    // Case 1: New file uploaded
                    if (!empty($road['road_image']) && $road['road_image'] instanceof \Illuminate\Http\UploadedFile) {
                        // Delete old image if it exists
                        if ($barangayRoad->road_image && Storage::disk('public')->exists($barangayRoad->road_image)) {
                            Storage::disk('public')->delete($barangayRoad->road_image);

                            // Delete the folder if empty
                            $folder = dirname($barangayRoad->road_image);
                            if (empty(Storage::disk('public')->files($folder))) {
                                Storage::disk('public')->deleteDirectory($folder);
                            }
                        }

                        // Store new file
                        $folder = 'road/' . $barangaySlug . '/' . Str::slug($road['road_type']) . '-' . Str::random(10);
                        $imagePath = $road['road_image']->store($folder, 'public');
                    }
                    // Case 2: No new file, but keep old one via existing_image
                    elseif (!empty($road['existing_image'])) {
                        $imagePath = $road['existing_image'];
                    }

                    $barangayRoad->update([
                        'road_type'     => $road['road_type'] ?? $barangayRoad->road_type,
                        'road_image'    => $imagePath,
                        'length'        => $road['length'] ?? $barangayRoad->length,
                        'condition'     => $road['condition'] ?? $barangayRoad->condition,
                        'status'        => $road['status'] ?? $barangayRoad->status,
                        'maintained_by' => $road['maintained_by'] ?? $barangayRoad->maintained_by,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_road.index')
                ->with('success' ,'Road(s) updated successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Road could not be updated: ' . $e->getMessage()
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayRoad $barangayRoad)
    {
        DB::beginTransaction();

        try {
            // Delete the road image from storage if it exists
            if ($barangayRoad->road_image && Storage::disk('public')->exists($barangayRoad->road_image)) {
                Storage::disk('public')->delete($barangayRoad->road_image);

                // Delete the folder if empty
                $folder = dirname($barangayRoad->road_image);
                if (empty(Storage::disk('public')->files($folder))) {
                    Storage::disk('public')->deleteDirectory($folder);
                }
            }

            // Delete the road record
            $barangayRoad->delete();

            DB::commit();

            return redirect()
                ->route('barangay_road.index')
                ->with('success' ,'Road(s) deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                'Road could not be deleted: ' . $e->getMessage()
            );
        }
    }
    public function roadDetails($id){
        $road = BarangayRoad::findOrFail($id);
        return response()->json([
            'road' => $road,
        ]);
    }
}

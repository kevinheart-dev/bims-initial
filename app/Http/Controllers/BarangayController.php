<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Http\Requests\StoreBarangayRequest;
use App\Http\Requests\UpdateBarangayRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BarangayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Barangay::query();

        // Filter by name (partial match)
        if ($request->filled('name')) {
            $query->where('barangay_name', 'like', '%' . $request->name . '%');
        }

        // Filter by type
        if ($request->filled('brgy_type') && $request->brgy_type !== 'All') {
            $query->where('barangay_type', $request->brgy_type);
        }

        // You can add more filters here as needed

        // Paginate results
        $barangays = $query->orderBy('barangay_name')->paginate(10)->withQueryString(); // or ->paginate(10);

        return Inertia::render('SuperAdmin/Barangay/Index', [
            'queryParams' => $request->query(),
            'barangays' => $barangays,
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
    public function store(StoreBarangayRequest $request)
    {
        $data = $request->validated();
        //dd($data);
        try {
            // Handle Barangay Logo Upload
            $image = $data['logo_path'] ?? null;
            if ($image) {
                $folder = 'barangay/' . Str::slug($data['barangay_name']) . Str::random(10);
                $data['logo_path'] = $image->store($folder, 'public');
            }

            // Create Barangay
            Barangay::create([
                'barangay_name'   => $data['barangay_name'],
                'contact_number'  => $data['contact_number'] ?? null,
                'city'            => 'City of Ilagan',
                'province'        => 'Isabela',
                'zip_code'        => '3300',
                'area_sq_km'      => $data['area_sq_km'] ?? null,
                'email'           => $data['email'] ?? null,
                'logo_path'       => $data['logo_path'] ?? null,
                'founded_year'    => $data['founded_year'] ?? null,
                'barangay_code'   => $data['barangay_code'] ?? null,
                'barangay_type'   => $data['barangay_type'],
            ]);

            return redirect()
                ->route('barangay.index') // adjust route name if different
                ->with('success', 'Barangay created successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Barangay could not be created: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Barangay $barangay)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barangay $barangay)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRequest $request, Barangay $barangay)
    {
        $data = $request->validated();
        try {
            // Handle Barangay Logo Upload
            $image = $data['logo_path'] ?? null;
            if ($image) {
                $folder = 'barangay/' . Str::slug($data['barangay_name']) . Str::random(10);
                $data['logo_path'] = $image->store($folder, 'public');

                // Optionally delete old logo if exists
                if ($barangay->logo_path && Storage::disk('public')->exists($barangay->logo_path)) {
                    Storage::disk('public')->delete($barangay->logo_path);
                }
            } else {
                // Keep existing logo if no new upload
                unset($data['logo_path']);
            }

            // Update Barangay
            $barangay->update([
                'barangay_name'   => $data['barangay_name'],
                'contact_number'  => $data['contact_number'] ?? null,
                'city'            => 'City of Ilagan', // fixed
                'province'        => 'Isabela',       // fixed
                'zip_code'        => '3300',          // fixed
                'area_sq_km'      => $data['area_sq_km'] ?? null,
                'email'           => $data['email'] ?? null,
                'logo_path'       => $data['logo_path'] ?? $barangay->logo_path,
                'founded_year'    => $data['founded_year'] ?? null,
                'barangay_code'   => $data['barangay_code'] ?? null,
                'barangay_type'   => $data['barangay_type'],
            ]);

            return redirect()
                ->route('barangay.index') // adjust if needed
                ->with('success', 'Barangay updated successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Barangay could not be updated: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barangay $barangay)
    {
        try {
            if ($barangay->logo_path && \Storage::disk('public')->exists($barangay->logo_path)) {
                \Storage::disk('public')->delete($barangay->logo_path);
            }
            $barangay->delete();

            return redirect()
                ->route('barangay.index')
                ->with('success', 'Barangay deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete Barangay: ' . $e->getMessage());
        }
    }

    public function barangayDetails($id)
    {
        try {
            $barangay = Barangay::findOrFail($id, [
                'id',
                'barangay_name',
                'barangay_type',
                'barangay_code',
                'city',
                'province',
                'zip_code',
                'contact_number',
                'email',
                'logo_path',
                'founded_year',
                'area_sq_km',
            ]);

            return response()->json($barangay);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Barangay not found or could not be retrieved.',
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}

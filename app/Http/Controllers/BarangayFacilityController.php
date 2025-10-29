<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayFacility;
use App\Http\Requests\StoreBarangayFacilityRequest;
use App\Http\Requests\UpdateBarangayFacilityRequest;
use DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Str;

class BarangayFacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Base query
        $query = BarangayFacility::query()
            ->where('barangay_id', $brgy_id)
            ->orderBy('created_at', 'desc');

        // Optional filters
        if (request()->filled('faci_name') && request('faci_name') !== 'All') {
            $query->where('name', request('faci_name'));
        }

        if (request()->filled('faci_type') && request('faci_type') !== 'All') {
            $query->where('facility_type', request('faci_type'));
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . request('name') . '%')
                ->orWhere('facility_type', 'like', '%' . request('name') . '%');
            });
        }

        // Paginate and preserve query string
        $facilities = $query->paginate(10)->withQueryString();

        // Distinct dropdown filters (with both id and name for React keys)
        $names = BarangayFacility::where('barangay_id', $brgy_id)->distinct()->pluck('name');
        $types = BarangayFacility::where('barangay_id', $brgy_id)->distinct()->pluck('facility_type');

        // Return Inertia page instead of JSON
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayFacility/FacilityIndex', [
            'facilities' => $facilities,
            'names' => $names,
            'types' => $types,
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

    public function store(StoreBarangayFacilityRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['facilities']) && is_array($data['facilities'])) {
                foreach ($data['facilities'] as $facility) {
                    $imagePath = $facility['facility_image'] ?? null;

                    // If it's a file upload, store it
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'facility/' . $barangaySlug . '/' . Str::slug($facility['facility_type']) . '-' . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    BarangayFacility::create([
                        'barangay_id'    => $brgy_id,
                        'facility_image' => $imagePath, // stored file or existing string
                        'name'           => $facility['name'],
                        'facility_type'  => $facility['facility_type'],
                        'quantity'       => $facility['quantity'] ?? 1,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_facility.index')
                ->with( 'success', 'Facility(ies) saved successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Facility(ies) could not be saved: ' . $e->getMessage()
            );
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(BarangayFacility $barangayFacility)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayFacility $barangayFacility)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateBarangayFacilityRequest $request, BarangayFacility $barangayFacility)
    {

        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['facilities']) && is_array($data['facilities'])) {
                foreach ($data['facilities'] as $facility) {
                    if (empty($data['facility_id'])) {
                        return back()->with(
                            'error',
                            'Facility(ies) could not be updated: No id provided'
                        );
                    }

                    $existingFacility = BarangayFacility::where('barangay_id', $brgy_id)
                        ->where('id', $data['facility_id'])
                        ->first();

                    if ($existingFacility) {
                        $imagePath = $existingFacility->facility_image; // default to old one

                        // Case 1: New file uploaded
                        if (!empty($facility['facility_image']) && $facility['facility_image'] instanceof \Illuminate\Http\UploadedFile) {
                            // Delete old image if it exists
                            if ($existingFacility->facility_image && Storage::disk('public')->exists($existingFacility->facility_image)) {
                                Storage::disk('public')->delete($existingFacility->facility_image);

                                // Delete the folder if empty
                                $folder = dirname($existingFacility->facility_image);
                                if (Storage::disk('public')->exists($folder) && empty(Storage::disk('public')->files($folder))) {
                                    Storage::disk('public')->deleteDirectory($folder);
                                }
                            }

                            // Store new file
                            $folder = "facility/{$barangaySlug}/" . Str::slug($facility['facility_type']) . '-' . Str::random(10);
                            $imagePath = $facility['facility_image']->store($folder, 'public');
                        }
                        // Case 2: No new file, but keep old one via existing_image
                        elseif (!empty($facility['existing_image'])) {
                            $imagePath = $facility['existing_image'];
                        }

                        $existingFacility->update([
                            'facility_image' => $imagePath,
                            'name'           => $facility['name'] ?? $existingFacility->name,
                            'facility_type'  => $facility['facility_type'] ?? $existingFacility->facility_type,
                            'quantity'       => $facility['quantity'] ?? $existingFacility->quantity,
                        ]);
                    }
                }
            }

            return redirect()
                ->route('barangay_facility.index')
                ->with('success','Facility(ies) updated successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Facility(ies) could not be updated: ' . $e->getMessage()
            );
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayFacility $barangayFacility)
    {
        DB::beginTransaction();

        try {
            // Delete the facility image from storage if it exists
            if ($barangayFacility->facility_image && Storage::disk('public')->exists($barangayFacility->facility_image)) {
                Storage::disk('public')->delete($barangayFacility->facility_image);

                // Delete the folder if empty
                $folder = dirname($barangayFacility->facility_image);
                if (empty(Storage::disk('public')->files($folder))) {
                    Storage::disk('public')->deleteDirectory($folder);
                }
            }

            // Delete the facility record
            $barangayFacility->delete();

            DB::commit();

            return redirect()
                ->route('barangay_facility.index')
                ->with('success'   , 'Facility deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                'Facility could not be deleted: ' . $e->getMessage()
            );
        }
    }

    public function facilityDetails($id){
        $facility = BarangayFacility::findOrFail($id);
        return response()->json([
            'facility' => $facility,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\BarangayFacility;
use App\Http\Requests\StoreBarangayFacilityRequest;
use App\Http\Requests\UpdateBarangayFacilityRequest;
use DB;

class BarangayFacilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = BarangayFacility::query()->where('barangay_id', $brgy_id);

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

        $facilities = $query->paginate(10)->withQueryString();

        $names = BarangayFacility::where('barangay_id', $brgy_id)->distinct()->pluck('name');
        $types = BarangayFacility::where('barangay_id', $brgy_id)->distinct()->pluck('facility_type');

        return response()->json([
            'facilities' => $facilities,
            'names' => $names,
            'types' => $types
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
        $data = $request->validated();

        try {
            if (!empty($data['facilities']) && is_array($data['facilities'])) {
                foreach ($data['facilities'] as $facility) {
                    BarangayFacility::create([
                        'barangay_id'   => $brgy_id,
                        'name'          => $facility['name'],
                        'facility_type' => $facility['facility_type'],
                        'quantity'      => $facility['quantity'] ?? 1,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success'   => 'Facility(ies) saved successfully.',
                    'activeTab' => 'facilities'
                ]);
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
        $data = $request->validated();

        try {
            if (!empty($data['facilities']) && is_array($data['facilities'])) {
                foreach ($data['facilities'] as $facility) {
                    $barangayFacility->update([
                        'name'          => $facility['name'],
                        'facility_type' => $facility['facility_type'],
                        'quantity'      => $facility['quantity'] ?? 1,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success'   => 'Facility updated successfully.',
                    'activeTab' => 'facilities'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Facility could not be updated: ' . $e->getMessage()
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
            $barangayFacility->delete();
            DB::commit();

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success'   => 'Facility deleted successfully!',
                    'activeTab' => 'facilities'
                ]);
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

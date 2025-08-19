<?php

namespace App\Http\Controllers;

use App\Models\BarangayFacility;
use App\Http\Requests\StoreBarangayFacilityRequest;
use App\Http\Requests\UpdateBarangayFacilityRequest;

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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayFacility $barangayFacility)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Http\Requests\StoreBarangayOfficialRequest;
use App\Http\Requests\UpdateBarangayOfficialRequest;
use Inertia\Inertia;

class BarangayOfficialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $officials = BarangayOfficial::with([
            'resident.barangay',
            'resident.street.purok',
            'resident.educationalHistories',
            'resident.occupations',
            'resident.medicalInformation',
            'resident.seniorcitizen',
            'resident.socialwelfareprofile',
            'resident.disabilities',
            'designation',
        ])
            ->whereHas('resident', function ($query) use ($brgy_id) {
                $query->where('barangay_id', $brgy_id);
            })
            ->get();

        return Inertia::render("BarangayOfficer/BarangayInfo/BarangayOfficials", [
            'officials' => $officials
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
    public function store(StoreBarangayOfficialRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayOfficialRequest $request, BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial)
    {
        //
    }
}

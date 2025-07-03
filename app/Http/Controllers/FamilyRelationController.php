<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\FamilyRelation;
use App\Http\Requests\StoreFamilyRelationRequest;
use App\Http\Requests\UpdateFamilyRelationRequest;
use App\Models\Resident;
use Inertia\Inertia;

class FamilyRelationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgyId = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        $families = Resident::where('barangay_id', $brgyId)
        ->where('is_family_head', true)
        ->select([
            'id',
            'firstname',
            'lastname',
            'middlename',
            'family_id',
            'is_family_head',
            'is_household_head',
            'household_id'
        ])
        ->with([
            'family:id,family_name,income_bracket,family_type',
            'family.members:id,family_id,barangay_id', // required for count
            'household:id,house_number,purok_id',
            'household.purok:id,purok_number',
        ])
        ->get();
        $families->each(function ($resident) use ($brgyId) {
            $resident->family_member_count = $resident->family?->members
                ->where('barangay_id', $brgyId)
                ->count() ?? 0;
        });

        return Inertia::render("BarangayOfficer/Family/Index", [
            'families' => $families,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        return Inertia::render("BarangayOfficer/Family/AddFamily");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFamilyRelationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFamilyRelationRequest $request, FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FamilyRelation $familyRelation)
    {
        //
    }
}

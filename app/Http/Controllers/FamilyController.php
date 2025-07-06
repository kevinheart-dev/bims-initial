<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Family;
use App\Http\Requests\StoreFamilyRequest;
use App\Http\Requests\UpdateFamilyRequest;
use App\Models\Purok;
use App\Models\Resident;
use Inertia\Inertia;

class FamilyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgyId = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        $query = Resident::where('barangay_id', $brgyId)
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
        ]);

        if (request('name')) {
            $query->where(function ($q) {
                $q->whereHas('family', function ($sub) {
                    $sub->where('family_name', 'like', '%' . request('name') . '%');
                })->orWhereHas('household', function ($sub) {
                    $sub->where('house_number', 'like', '%' . request('name') . '%');
                });
            });
        }

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        if (request()->filled('famtype') && request('famtype') !== 'All') {
            $query->whereHas('family', function ($q) {
                $q->where('family_type', request('famtype'));
            });
        }
        if (request()->filled('income_bracket') && request('income_bracket') !== 'All') {
            $query->whereHas('family', function ($q) {
                $q->where('income_bracket', request('income_bracket'));
            });
        }
        if (request()->filled('household_head') && request('household_head') !== 'All') {
            $query->where('is_household_head', request('household_head'));
        }

        $families = $query->get();

        $families->each(function ($resident) use ($brgyId) {
            $resident->family_member_count = $resident->family?->members
                ->where('barangay_id', $brgyId)
                ->count() ?? 0;
        });
        $puroks = Purok::where('barangay_id', $brgyId)->orderBy('purok_number', 'asc')->pluck('purok_number');
        return Inertia::render("BarangayOfficer/Family/Index", [
            'families' => $families,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd('ers');
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        return Inertia::render("BarangayOfficer/Family/AddFamily");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFamilyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Family $family)
    {
        //
    }

    public function showFamily(Family $family)
    {
        $members = $family->members()
        ->select([
            'id',
            'firstname',
            'middlename',
            'lastname',
            'suffix',
            'birthdate',
            'gender',
            'employment_status',
            'is_family_head',
            'is_household_head',
            'is_pwd',
            'registered_voter',
            'family_id',
            'household_id',
        ])
        ->with([
            'householdResidents' => function ($query) {
                $query->select('id', 'resident_id', 'household_id', 'relationship_to_head', 'household_position');
            }
        ])
        ->get();
        $family_details = $family;
        $household_details = $family->household;
        return Inertia::render("BarangayOfficer/Family/ShowFamily", [
            'members' => $members,
            'family_details' => $family_details,
            'household_details' => $household_details
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Family $family)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFamilyRequest $request, Family $family)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Family $family)
    {
        //
    }
}

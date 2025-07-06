<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Http\Requests\StoreHouseholdRequest;
use App\Http\Requests\UpdateHouseholdRequest;
use App\Models\Purok;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $households = Household::query()
            ->select([
                'id',
                'barangay_id',
                'purok_id',
                'street_id',
                'house_number',
                'ownership_type',
                'ownership_details',
                'housing_condition',
                'year_established',
                'house_structure',
                'number_of_rooms',
                'number_of_floors',
            ])
            ->where("barangay_id", $brgy_id)
            ->with([
                'street:id,street_name',
                'purok:id,purok_number',
                'residents' => function ($query) {
                    $query->where('is_household_head', true)
                        ->select('id', 'household_id', 'firstname', 'lastname', 'middlename', 'suffix');
                }
            ])
            ->get();
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        return Inertia::render("BarangayOfficer/Household/Index", [
            "households" => $households,
            'puroks' => $puroks,
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
    public function store(StoreHouseholdRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Household $household)
    {
        dd($household);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Household $household)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHouseholdRequest $request, Household $household)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Household $household)
    {
        //
    }
}

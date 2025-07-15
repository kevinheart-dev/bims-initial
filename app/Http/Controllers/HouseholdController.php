<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Http\Requests\StoreHouseholdRequest;
use App\Http\Requests\UpdateHouseholdRequest;
use App\Models\Purok;
use App\Models\Resident;
use App\Models\Street;
use App\Models\Vehicle;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->resident->barangay_id;
        $query = Household::query()
            ->select([
                'id',
                'barangay_id',
                'purok_id',
                'street_id',
                'house_number',
                'ownership_type',
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
            ]);
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        if (request()->filled('street') && request('street') !== 'All') {
            $query->whereHas('street', function ($q) {
                $q->where('street_name', request('street'));
            });
        }
        if (request()->filled('own_type') && request('own_type') !== 'All') {
            $query->where('ownership_type', request('own_type'));
        }
        if (request()->filled('condition') && request('condition') !== 'All') {
            $query->where('housing_condition', request('condition'));
        }
        if (request()->filled('structure') && request('structure') !== 'All') {
            $query->where('house_structure', request('structure'));
        }

        $households = $query->get();
        $streets = Street::whereHas('purok', function ($query) use ($brgy_id) {
            $query->where('barangay_id', $brgy_id);
        })->pluck('street_name');

        return Inertia::render("BarangayOfficer/Household/Index", [
            "households" => $households,
            'puroks' => $puroks,
            'streets' => $streets,
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
        // Load all residents of this household (unfiltered, for summary display)
        $household_details = $household->load('residents.householdResidents');

        // Start resident query for filtering
        $query = Resident::query()
            ->where('household_id', $household->id)
            ->with('householdResidents');

        // Filter: Search by name
        if (request()->filled('name')) {
            $query->where(function ($q) {
                $q->where('firstname', 'like', '%' . request('name') . '%')
                    ->orWhere('lastname', 'like', '%' . request('name') . '%')
                    ->orWhere('middlename', 'like', '%' . request('name') . '%')
                    ->orWhere('suffix', 'like', '%' . request('name') . '%')
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, suffix) LIKE ?", ['%' . request('name') . '%']);
            });
        }

        // Filter: Gender
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->where('gender', request('gender'));
        }

        // Filter: Age group
        if (request()->filled('age_group') && request('age_group') !== 'All') {
            $today = now();

            switch (request('age_group')) {
                case 'child':
                    $max = $today->copy()->subYears(0);
                    $min = $today->copy()->subYears(13);
                    break;
                case 'teen':
                    $max = $today->copy()->subYears(13);
                    $min = $today->copy()->subYears(18);
                    break;
                case 'young_adult':
                    $max = $today->copy()->subYears(18);
                    $min = $today->copy()->subYears(26);
                    break;
                case 'adult':
                    $max = $today->copy()->subYears(26);
                    $min = $today->copy()->subYears(60);
                    break;
                case 'senior':
                    $max = $today->copy()->subYears(60);
                    $min = null;
                    break;
            }

            if (isset($min)) {
                $query->whereBetween('birthdate', [$min, $max]);
            } else {
                $query->where('birthdate', '<=', $max);
            }
        }

        // Filter: Employment status
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }

        // Filter: Voter status
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

        // Filter: PWD
        if (request()->filled('is_pwd') && request('is_pwd') !== 'All') {
            $query->where('is_pwd', request('is_pwd'));
        }

        // Filter: Relationship to head (via pivot)
        if (request()->filled('relation') && request('relation') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('relationship_to_head', request('relation'));
            });
        }

        // Filter: Household position (via pivot)
        if (request()->filled('household_position') && request('household_position') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('household_position', request('household_position'));
            });
        }

        // Get filtered members
        $household_members = $query->get();

        return Inertia::render("BarangayOfficer/Household/Show", [
            "household_details" => $household_details,
            'household_members' => $household_members,
            'queryParams' => request()->query() ?: null,
        ]);
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

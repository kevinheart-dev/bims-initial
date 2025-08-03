<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Household;
use App\Http\Requests\StoreHouseholdRequest;
use App\Http\Requests\UpdateHouseholdRequest;
use App\Models\HouseholdHeadHistory;
use App\Models\HouseholdResident;
use App\Models\OccupationType;
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
                'households.id',
                'households.barangay_id',
                'households.purok_id',
                'households.street_id',
                'households.house_number',
                'households.ownership_type',
                'households.housing_condition',
                'households.year_established',
                'households.house_structure',
                'households.number_of_rooms',
                'households.number_of_floors',
            ])
            ->where('households.barangay_id', $brgy_id);

        // head-of-household name search
        if ($name = request('name')) {
            $name = trim($name);
            $parts = collect(explode(' ', $name))
                ->filter(fn($p) => $p !== '')
                ->values();

            $query->whereHas('householdResidents', function ($hr) use ($parts, $name) {
                $hr->where('relationship_to_head', 'self')
                    ->whereHas('resident', function ($r) use ($parts, $name) {
                        $r->where(function ($w) use ($parts, $name) {
                            foreach ($parts as $part) {
                                $w->orWhere('firstname', 'like', "%{$part}%")
                                ->orWhere('lastname', 'like', "%{$part}%")
                                ->orWhere('middlename', 'like', "%{$part}%")
                                ->orWhere('suffix', 'like', "%{$part}%");
                            }

                            // full name variants
                            $w->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
                        });
                    });
            });
        }

        $query->with([
                'street:id,street_name',
                'purok:id,purok_number',
                'householdResidents' => function ($q) {
                    $q->where('relationship_to_head', 'self')
                    ->with([
                        'resident:id,firstname,lastname,middlename,suffix',
                    ]);
                },
            ])
            ->withCount('residents');
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('purok', function ($q) {
                $q->where('purok_number', request('purok'));
            });
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

        // $households = $query->get();
        $households = $query->paginate(10)->withQueryString();
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
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);
        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'gender', 'birthdate', 'residency_type', 'residency_date')->get();

        return Inertia::render("BarangayOfficer/Household/Create", [
            'puroks' => $puroks,
            'streets' => $streets,
            'barangays' => $barangays,
            'residents' => $residents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHouseholdRequest $request)
    {
        $barangayId = Auth()->user()->resident->barangay_id;
        $data = $request->validated();
        $householdData = [
            'barangay_id' =>  $barangayId ?? null,
            'purok_id' => $data['purok_id'] ?? null,
            'street_id' => $data['street_id'] ?? null,
            'house_number' => $data['housenumber'] ?? null,
            'ownership_type' => $data['ownership_type'] ?? null,
            'housing_condition' => $data['housing_condition'] ?? null,
            'year_established' => $data['year_established'] ?? null,
            'house_structure' => $data['house_structure'] ?? null,
            'bath_and_wash_area' => $data['bath_and_wash_area'] ?? null,
            'number_of_rooms' => $data['number_of_rooms'] ?? null,
            'number_of_floors' => $data['number_of_floors'] ?? null,
            'latitude' => $data['latitude'] ?? 0,
            'longitude' => $data['longitude'] ?? 0,
        ];
        try {
            $household = Household::create($householdData);
            if ($household) {
                //toilets
                foreach ($data['toilets'] ?? [] as $toilet) {
                    $household->toilets()->create([
                        'toilet_type' => $toilet["toilet_type"] ?? null,
                    ]);
                }
                // electricity
                foreach ($data['electricity_types'] ?? [] as $electric) {
                    $household->electricityTypes()->create([
                        'electricity_type' => $electric["electricity_type"] ?? null,
                    ]);
                }
                // water sources
                foreach ($data['water_source_types'] ?? [] as $water) {
                    $household->waterSourceTypes()->create([
                        'water_source_type' => $water["water_source_type"] ?? null,
                    ]);
                }
                // wastes
                foreach ($data['waste_management_types'] ?? [] as $waste) {
                    $household->wasteManagementTypes()->create([
                        'waste_management_type' => $waste["waste_management_type"] ?? null,
                    ]);
                }
                // pets
                foreach ($data['pets'] ?? [] as $pet) {
                    $household->pets()->create([
                        'pet_type' => $pet["pet_type"] ?? null,
                        'is_vaccinated' => $pet["is_vaccinated"] ?? null,
                    ]);
                }
                // livestocks
                foreach ($data['livestocks'] ?? [] as $livestock) {
                    $household->livestocks()->create([
                        'livestock_type' => $livestock["livestock_type"] ?? null,
                        'quantity' => $livestock["quantity"] ?? null,
                        'purpose' => $livestock["purpose"] ?? null,
                    ]);
                }
                // internet
                if ($data['type_of_internet']) {
                    $household->internetAccessibility()->create([
                        'type_of_internet' => $data["type_of_internet"] ?? null,
                    ]);
                }

                $household->householdResidents()->create([
                    'resident_id' => $data['resident_id'],
                    'relationship_to_head' => 'self',
                    'household_position' => 'nuclear',
                ]);
                $household->householdHeadHistories()->create([
                    'resident_id' => $data['resident_id'],
                    'start_year' => $data['year_established'] ?? date('Y'),
                    'end_year' => null,
                ]);
                $resident = Resident::find($data['resident_id']);
                if ($resident && $resident->is_household_head == 0) {
                    $resident->update([
                        'is_household_head' => 1
                    ]);
                }
            }
            return redirect()->route('household.index')->with('success', 'Household created successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Household could not be created: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Household $household)
    {
        $household_details = $household->load('householdResidents.resident', 'toilets', 'electricityTypes', 'waterSourceTypes', 'wasteManagementTypes');
        $household_details['bath_and_wash_area'] = [
            'bath_and_wash_area' => $household_details['bath_and_wash_area']
        ];

        $query = HouseholdResident::with('resident', 'household')
            ->where('household_id', $household->id);
        if (request()->filled('name')) {
            $query->whereHas('resident', function ($q) {
                $q->where('firstname', 'like', '%' . request('name') . '%')
                    ->orWhere('lastname', 'like', '%' . request('name') . '%')
                    ->orWhere('middlename', 'like', '%' . request('name') . '%')
                    ->orWhere('suffix', 'like', '%' . request('name') . '%')
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, suffix) LIKE ?", ['%' . request('name') . '%']);
            });
        }
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('gender', request('gender'));
            });
        }
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

            $query->whereHas('resident', function ($q) use ($min, $max) {
                if (isset($min)) {
                    $q->whereBetween('birthdate', [$min, $max]);
                } else {
                    $q->where('birthdate', '<=', $max);
                }
            });
        }
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('employment_status', request('estatus'));
            });
        }
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('registered_voter', request('voter_status'));
            });
        }
        if (request()->filled('is_pwd') && request('is_pwd') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('is_pwd', request('is_pwd'));
            });
        }
        if (request()->filled('relation') && request('relation') !== 'All') {
            $query->where('relationship_to_head', request('relation'));
        }
        if (request()->filled('household_position') && request('household_position') !== 'All') {
            $query->where('household_position', request('household_position'));
        }
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

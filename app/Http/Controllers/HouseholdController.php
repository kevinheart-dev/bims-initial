<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayOfficial;
use App\Models\Family;
use App\Models\FamilyRelation;
use App\Models\Household;
use App\Http\Requests\StoreHouseholdRequest;
use App\Http\Requests\UpdateHouseholdRequest;
use App\Models\HouseholdElectricitySource;
use App\Models\HouseholdHeadHistory;
use App\Models\HouseholdResident;
use App\Models\HouseholdToilet;
use App\Models\HouseholdWasteManagement;
use App\Models\HouseholdWaterSource;
use App\Models\InternetAccessibility;
use App\Models\OccupationType;
use App\Models\Purok;
use App\Models\Resident;
use App\Models\Street;
use App\Models\Vehicle;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barangayId = auth()->user()->barangay_id;
        $request = request();

        // 🧠 Cache commonly used lists (short lifetime to stay fresh)
        $puroks = Cache::remember("puroks_{$barangayId}", now()->addMinutes(10), function () use ($barangayId) {
            return Purok::where('barangay_id', $barangayId)
                ->orderBy('purok_number')
                ->pluck('purok_number');
        });

        $streets = Cache::remember("streets_{$barangayId}", now()->addMinutes(10), function () use ($barangayId) {
            return Street::whereHas('purok', fn($q) => $q->where('barangay_id', $barangayId))
                ->orderBy('street_name')
                ->pluck('street_name');
        });

        // 🟢 Base query for latest household heads
        $query = HouseholdResident::query()
            ->select('id', 'resident_id', 'household_id', 'relationship_to_head', 'updated_at')
            ->with([
                'resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,residency_type,residency_date',
                'household:id,barangay_id,purok_id,street_id,house_number,ownership_type,housing_condition,year_established,house_structure,number_of_rooms,number_of_floors',
                'household.street:id,street_name',
                'household.purok:id,purok_number',
                'household.residentsCount',
            ])
            ->whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
            ->where('relationship_to_head', 'self')
            ->whereIn('id', function ($sub) {
                $sub->selectRaw('MAX(id)')
                    ->from('household_residents')
                    ->where('relationship_to_head', 'self')
                    ->groupBy('household_id');
            })
            ->latest('updated_at');

        // 🟡 Filter: Name search (optimized multi-part handling)
        if ($name = trim($request->get('name', ''))) {
            $parts = array_filter(explode(' ', $name));
            $query->whereHas('resident', function ($r) use ($parts, $name) {
                $r->where(function ($w) use ($parts, $name) {
                    foreach ($parts as $part) {
                        $w->orWhere('firstname', 'like', "%{$part}%")
                            ->orWhere('lastname', 'like', "%{$part}%")
                            ->orWhere('middlename', 'like', "%{$part}%")
                            ->orWhere('suffix', 'like', "%{$part}%");
                    }
                    $w->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
                });
            });
        }

        // 🟡 Map of request filters to their target columns/relations
        $filters = [
            'purok'     => ['relation' => 'household.purok', 'column' => 'purok_number'],
            'street'    => ['relation' => 'household.street', 'column' => 'street_name'],
            'own_type'  => ['relation' => 'household', 'column' => 'ownership_type'],
            'condition' => ['relation' => 'household', 'column' => 'housing_condition'],
            'structure' => ['relation' => 'household', 'column' => 'house_structure'],
        ];

        // 🟢 Apply filters dynamically
        foreach ($filters as $key => $filter) {
            $value = $request->get($key);
            if ($value && $value !== 'All') {
                $query->whereHas($filter['relation'], fn($q) => $q->where($filter['column'], $value));
            }
        }

        // 🟢 Pagination with query preservation
        $heads = $query->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/Household/Index', [
            'households' => $heads,
            'puroks' => $puroks,
            'streets' => $streets,
            'queryParams' => $request->query() ?: null,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);
        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'sex', 'birthdate', 'residency_type', 'residency_date')->get();

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
        $barangayId = Auth()->user()->barangay_id;
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
                    'household_id' => $household->id,
                    'relationship_to_head' => 'self',
                    'household_position' => 'primary',
                ]);
                $household->householdHeadHistories()->create([
                    'resident_id' => $data['resident_id'],
                    'start_year' => $data['year_established'] ?? date('Y'),
                    'end_year' => null,
                ]);
                $resident = Resident::find($data['resident_id']);

                if ($resident && $resident->is_household_head == 0) {
                    $resident->update([
                        'is_household_head' => 1,
                    ]);
                }
                if($resident){
                    $household->householdHeadHistories()->create([
                        'resident_id' => $data['resident_id'],
                        'start_year'  => date('Y'),
                        'end_year'    => null,
                    ]);

                    // // Assuming $resident already contains the single resident model
                    // $monthlyIncome = $resident->occupations()
                    //     ->whereNull('ended_at')
                    //     ->sum('monthly_income') ?? 0;

                    // // Determine income bracket based on the monthly income
                    // if ($monthlyIncome < 5000) {
                    //     $incomeBracket = 'below_5000';
                    //     $incomeCategory = 'survival';
                    // } elseif ($monthlyIncome <= 10000) {
                    //     $incomeBracket = '5001_10000';
                    //     $incomeCategory = 'poor';
                    // } elseif ($monthlyIncome <= 20000) {
                    //     $incomeBracket = '10001_20000';
                    //     $incomeCategory = 'low_income';
                    // } elseif ($monthlyIncome <= 40000) {
                    //     $incomeBracket = '20001_40000';
                    //     $incomeCategory = 'lower_middle_income';
                    // } elseif ($monthlyIncome <= 70000) {
                    //     $incomeBracket = '40001_70000';
                    //     $incomeCategory = 'middle_income';
                    // } elseif ($monthlyIncome <= 120000) {
                    //     $incomeBracket = '70001_120000';
                    //     $incomeCategory = 'upper_middle_income';
                    // } else {
                    //     $incomeBracket = 'above_120001';
                    //     $incomeCategory = 'high_income';
                    // }

                    // // Create the family record
                    // $family = Family::create([
                    //     'barangay_id'     => $barangayId,
                    //     'household_id'    => $household->id,
                    //     'income_bracket'  => $incomeBracket,
                    //     'income_category' => $incomeCategory,
                    //     'family_name'     => $resident->lastname ?? null,
                    //     'family_type'     => "nuclear",
                    // ]);

                    $resident->update([
                        'household_id' => $household->id,
                    ]);


                }
            }
            return redirect()->route('household.index')->with('success', 'Household created successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->with('error','Household could not be created: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Household $household)
    {
        $household_details = $household->load('householdResidents.resident', 'toilets', 'electricityTypes', 'waterSourceTypes', 'wasteManagementTypes', 'street', 'purok', 'purok.barangay');
        $household_details['bath_and_wash_area'] = [
            'bath_and_wash_area' => $household_details['bath_and_wash_area']
        ];

        $query = HouseholdResident::with([
            'resident:id,household_id,firstname,middlename,lastname,maiden_name,suffix,sex,employment_status,is_deceased,is_household_head,is_family_head,family_id,is_pwd',
            'household:id,barangay_id,purok_id,street_id,house_number'
        ])
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
        $brgy_id = Auth()->user()->barangay_id;

        // Fetch the latest head for this household
        $latestHead = HouseholdResident::with([
            'resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,residency_type,residency_date',
            'household.street:id,street_name',
            'household.purok:id,purok_number',
            'household.pets',
            'household.livestocks',
            'household.electricityTypes',
            'household.toilets',
            'household.waterSourceTypes',
            'household.internetAccessibility',
            'household.wasteManagementTypes',
        ])
        ->where('household_id', $household->id)
        ->where('relationship_to_head', 'self')
        ->latest()
        ->first();

        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);

        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();

        $residents = Resident::where('barangay_id', $brgy_id)
            ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'gender', 'birthdate', 'residency_type', 'residency_date')
            ->get();

        return Inertia::render("BarangayOfficer/Household/Edit", [
            'puroks' => $puroks,
            'streets' => $streets,
            'barangays' => $barangays,
            'residents' => $residents,
            'latestHead' => $latestHead
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHouseholdRequest $request, Household $household)
    {
        $barangayId = Auth()->user()->barangay_id;
        $data = $request->validated();
        //dd($data);
        $householdData = [
            'barangay_id' => $barangayId ?? null,
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
            $household->update($householdData);

            // Refresh related data
            $existingIds = collect($data['toilets'])->pluck('id')->filter();
            $household->toilets()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['toilets'] ?? [] as $toiletData) {
                $household->toilets()->updateOrCreate(
                    ['id' => $toiletData['id'] ?? null],
                    ['toilet_type' => $toiletData['toilet_type'] ?? null]
                );
            }

           // Electricity types
            $existingIds = collect($data['electricity_types'] ?? [])->pluck('id')->filter();
            $household->electricityTypes()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['electricity_types'] ?? [] as $electric) {
                if (!empty($electric['electricity_type'])) {
                    $household->electricityTypes()->updateOrCreate(
                        ['id' => $electric['id'] ?? null],
                        ['electricity_type' => $electric['electricity_type']]
                    );
                }
            }
            // Water sources
            $existingIds = collect($data['water_source_types'] ?? [])->pluck('id')->filter();
            $household->waterSourceTypes()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['water_source_types'] ?? [] as $water) {
                if (!empty($water['water_source_type'])) {
                    $household->waterSourceTypes()->updateOrCreate(
                        ['id' => $water['id'] ?? null],
                        ['water_source_type' => $water['water_source_type']]
                    );
                }
            }

            // Waste management
            $existingIds = collect($data['waste_management_types'] ?? [])->pluck('id')->filter();
            $household->wasteManagementTypes()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['waste_management_types'] ?? [] as $waste) {
                if (!empty($waste['waste_management_type'])) {
                    $household->wasteManagementTypes()->updateOrCreate(
                        ['id' => $waste['id'] ?? null],
                        ['waste_management_type' => $waste['waste_management_type']]
                    );
                }
            }

            // Pets
            $existingIds = collect($data['pets'] ?? [])->pluck('id')->filter();
            $household->pets()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['pets'] ?? [] as $pet) {
                if (!empty($pet['pet_type'])) {
                    $household->pets()->updateOrCreate(
                        ['id' => $pet['id'] ?? null],
                        [
                            'pet_type' => $pet['pet_type'],
                            'is_vaccinated' => $pet['is_vaccinated'] ?? null
                        ]
                    );
                }
            }

            // Livestocks
            $existingIds = collect($data['livestocks'] ?? [])->pluck('id')->filter();
            $household->livestocks()->whereNotIn('id', $existingIds)->delete();

            foreach ($data['livestocks'] ?? [] as $livestock) {
                if (!empty($livestock['livestock_type'])) {
                    $household->livestocks()->updateOrCreate(
                        ['id' => $livestock['id'] ?? null],
                        [
                            'livestock_type' => $livestock['livestock_type'],
                            'quantity' => $livestock['quantity'] ?? null,
                            'purpose' => $livestock['purpose'] ?? null
                        ]
                    );
                }
            }

            // Internet accessibility (single record)
            if (!empty($data['type_of_internet'])) {
                $household->internetAccessibility()->updateOrCreate(
                    ['id' => $data['internet_accessibility_id'] ?? null],
                    ['type_of_internet' => $data['type_of_internet']]
                );
            } else {
                $household->internetAccessibility()->delete();
            }

            /**
             * Update household head and history
             */
            $currentHead = $household->householdResidents()
                ->where('relationship_to_head', 'self')
                ->first();

            if (!$currentHead || $currentHead->resident_id != $data['resident_id']) {

                // Close old head history if exists
                $oldHeadHistory = $household->householdHeadHistories()
                    ->whereNull('end_year')
                    ->first();
                if ($oldHeadHistory) {
                    $oldHeadHistory->update([
                        'end_year' => date('Y')
                    ]);
                }

                if ($currentHead) {

                    $newRelationship = HouseholdResident::where('resident_id', $data['resident_id'])
                        ->where('household_id', $household->id)
                        ->value('relationship_to_head');

                    HouseholdResident::where('resident_id', $data['resident_id'])
                        ->where('household_id', $household->id)
                        ->update([
                            'relationship_to_head' => $currentHead->relationship_to_head
                        ]);

                    $headRelationship = match ($newRelationship) {
                        'spouse'  => 'spouse',
                        'child'   => 'parent',
                        'parent'  => 'child',
                        'sibling' => 'sibling',
                        'grandparent' => 'grandchild',
                        default   => 'other',
                    };

                    HouseholdResident::where('resident_id', $currentHead->resident_id)
                        ->where('household_id', $household->id)
                        ->update([
                            'relationship_to_head' => $headRelationship
                        ]);
                }

                $household->householdResidents()
                    ->where('resident_id', $data['resident_id'])
                    ->update([
                        'relationship_to_head' => 'self',
                        'household_position'   => 'nuclear',
                    ]);

                $household->householdHeadHistories()->create([
                    'resident_id' => $data['resident_id'],
                    'start_year'  => date('Y'),
                    'end_year'    => null,
                ]);

                $resident = Resident::find($data['resident_id']);
                if ($resident && $resident->is_household_head == 0) {
                    $resident->update([
                        'is_household_head' => 1
                    ]);
                }
            }



            return redirect()->route('household.index')
                ->with('success', 'Household updated successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Household could not be updated: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Household $household)
    {
        try {
            DB::transaction(function () use ($household) {
                $household->toilets()->delete();
                $household->electricityTypes()->delete();
                $household->waterSourceTypes()->delete();
                $household->wasteManagementTypes()->delete();
                $household->pets()->delete();
                $household->livestocks()->delete();
                $household->internetAccessibility()->delete();
                $household->householdResidents()->delete();
                $household->householdHeadHistories()->delete();

                $household->delete();
            });

            return redirect()
                ->route('household.index')
                ->with('success', 'Household deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Household could not be deleted: ' . $e->getMessage());
        }
    }

    public function getLatestHead($id)
    {
        try {
            $head = HouseholdResident::with(['resident:id,household_id,firstname,middlename,lastname,maiden_name,suffix,sex,is_deceased,is_household_head,is_family_head,family_id', 'household'])
                ->where('household_id', $id)
                ->where('relationship_to_head', 'self')
                ->latest('created_at') // make it explicit which column to order by
                ->first();

            return response()->json([
                'success' => true,
                'head' => $head,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching latest head: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function remove($id)
    {
        DB::beginTransaction();

        try {
            $resident = Resident::findOrFail($id);

            // Delete all household resident links
            $resident->householdResidents()->delete(); // ✅ Use relationship method, not property
            $resident->familyRelations()->delete();

            // Reset resident's household info
            $resident->update([
                'household_id' => null,
                'family_id' => null,
                'is_household_head' => 0,
            ]);

            DB::commit();

            return back()->with(
                'success', 'Resident removed from household successfully.',
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with(
                'error', 'Failed to remove resident: ' . $e->getMessage(),
            );
        }
    }

    public function getLatestHouseNumber()
    {
        $barangayId = Auth()->user()->barangay_id;
        try {
            $latestHouse = Household::orderBy('house_number', 'desc')->where('barangay_id', $barangayId)->first();

            return response()->json([
                'success' => true,
                'house_number' => $latestHouse ? (string)($latestHouse->house_number + 1) : null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not fetch latest house number',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function householdOverview()
    {
        $barangayId = auth()->user()->barangay_id;
        $request = request();

        // 🧠 Cache Purok List (frequently used filter)
        $puroks = Cache::remember("puroks_{$barangayId}", now()->addMinutes(10), function () use ($barangayId) {
            return Purok::where('barangay_id', $barangayId)
                ->orderBy('purok_number')
                ->pluck('purok_number');
        });

        // 🟢 Base Query for Households
        $query = Household::query()
            ->select([
                'id',
                'barangay_id',
                'purok_id',
                'street_id',
                'house_number',
                'bath_and_wash_area',
            ])
            ->with([
                'toilets:id,household_id,toilet_type',
                'electricityTypes:id,household_id,electricity_type',
                'waterSourceTypes:id,household_id,water_source_type',
                'wasteManagementTypes:id,household_id,waste_management_type',
                'livestocks:id,household_id,livestock_type,quantity',
                'pets:id,household_id,pet_type,is_vaccinated',
                'internetAccessibility:id,household_id,type_of_internet',
                'purok:id,purok_number',
                'street:id,street_name',
            ])
            ->where('barangay_id', $barangayId)
            ->orderBy('house_number', 'asc');

        // 🟡 Apply Filters
        $filters = [
            'purok' => ['relation' => 'purok', 'column' => 'purok_number'],
            'street' => ['relation' => 'street', 'column' => 'street_name'],
            'bath' => ['relation' => null, 'column' => 'bath_and_wash_area'],
            'toilet' => ['relation' => 'toilets', 'column' => 'toilet_type'],
            'electricity' => ['relation' => 'electricityTypes', 'column' => 'electricity_type'],
            'water' => ['relation' => 'waterSourceTypes', 'column' => 'water_source_type'],
            'waste' => ['relation' => 'wasteManagementTypes', 'column' => 'waste_management_type'],
            'livestock' => ['relation' => 'livestocks', 'column' => 'livestock_type'],
            'pet' => ['relation' => 'pets', 'column' => 'pet_type'],
            'internet' => ['relation' => 'internetAccessibility', 'column' => 'type_of_internet'],
        ];

        foreach ($filters as $key => $filter) {
            $value = $request->get($key);
            if ($value && $value !== 'All') {
                if ($filter['relation']) {
                    $query->whereHas($filter['relation'], fn($q) => $q->where($filter['column'], $value));
                } else {
                    $query->where($filter['column'], $value);
                }
            }
        }

        // 🟢 Paginate & Preserve Query
        $households = $query->paginate(10)->withQueryString();

        // 🧩 Cache distinct type lists (to reduce heavy queries)
        $cacheDuration = now()->addMinutes(30);

        $toiletTypes = Cache::remember("toilet_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return HouseholdToilet::whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
                ->distinct()->pluck('toilet_type')->filter()->values();
        });

        $electricityTypes = Cache::remember("electricity_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return HouseholdElectricitySource::whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
                ->distinct()->pluck('electricity_type')->filter()->values();
        });

        $waterSourceTypes = Cache::remember("water_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return HouseholdWaterSource::whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
                ->distinct()->pluck('water_source_type')->filter()->values();
        });

        $wasteManagementTypes = Cache::remember("waste_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return HouseholdWasteManagement::whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
                ->distinct()->pluck('waste_management_type')->filter()->values();
        });

        $internetTypes = Cache::remember("internet_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return InternetAccessibility::whereHas('household', fn($q) => $q->where('barangay_id', $barangayId))
                ->distinct()->pluck('type_of_internet')->filter()->values();
        });

        $bathTypes = Cache::remember("bath_types_{$barangayId}", $cacheDuration, function () use ($barangayId) {
            return Household::where('barangay_id', $barangayId)
                ->distinct()
                ->pluck('bath_and_wash_area')
                ->filter()
                ->values();
        });


        // 🟢 Render with Filters
        return Inertia::render('BarangayOfficer/Household/Services', [
            'households' => $households,
            'puroks' => $puroks,
            'queryParams' => $request->query() ?: null,
            'toiletTypes' => $toiletTypes,
            'electricityTypes' => $electricityTypes,
            'waterSourceTypes' => $waterSourceTypes,
            'wasteManagementTypes' => $wasteManagementTypes,
            'internetTypes' => $internetTypes,
            'bathTypes' => $bathTypes
        ]);
    }
    public function exportHouseholdRBI($id)
    {
        $household = Household::with([
            'barangay',
            'purok',
            'street',
            'householdResidents.resident.latestOccupation'
        ])->findOrFail($id);

        $household_members = $household->householdResidents->map(function ($m) {
            $r = $m->resident;

            $tags = [];
            $age = $r->birthdate ? \Carbon\Carbon::parse($r->birthdate)->age : null;

            // ✅ Employment Status
            if ($r->latestOccupation) {
                if (in_array($r->latestOccupation->employment_type, ['full_time','part_time','contractual','self_employed'])) {
                    $tags[] = "Employed";
                } elseif ($r->latestOccupation->employment_type == 'unemployed') {
                    $tags[] = "Unemployed";
                }
                if (
                    str_contains(strtolower($r->latestOccupation->occupation ?? ''), 'ofw')
                    || ($r->latestOccupation->is_ofw ?? null) === true
                ) {
                    $tags[] = "OFW";
                }
            }

            // ✅ PWD
            if ($r->disabilities->isNotEmpty()) {
                $tags[] = "PWD";
            }

            if ($r->socialwelfareprofile) {
                $sw = $r->socialwelfareprofile;

                // Solo Parent
                if ($sw->is_solo_parent) {
                    $tags[] = "Solo Parent";
                }

                // 4Ps Beneficiary
                if ($sw->is_4ps_beneficiary) {
                    $tags[] = "4Ps";
                }
            }
            if ($r->latestEducation) {
                $edu = $r->latestEducation;

                // Out-of-School Youth (15-30) and Out-of-School Child (6-14)
                if ($edu->education_status === 'dropped_out') {
                    $tags[] = ($age >= 15 && $age <= 30) ? 'OSY' : (($age >= 6 && $age <= 14) ? 'OSC' : null);
                }

                // No education yet & school-age child
                if ($edu->educational_attainment === 'no_education_yet' && ($age >= 6 && $age <= 14)) {
                    $tags[] = 'OSC';
                }
            }

            // ✅ Indigenous People (IP)
            if (!empty($r->ethnicity) && preg_match('/tribe|indigenous|lumad|aeta|mangyan|ip/i', $r->ethnicity)) {
                $tags[] = "IP";
            }

            return (object) [
                'last_name' => $r->lastname,
                'first_name' => $r->firstname,
                'middle_name' => $r->middlename,
                'suffix' => $r->suffix,
                'place_of_birth' => $r->birthplace ?? '',
                'date_of_birth' => $r->birthdate ? Carbon::parse($r->birthdate)->format('F j, Y') : '',
                'age' => $age,
                'sex' => $r->sex,
                'civil_status' => $r->civil_status ?? '',
                'citizenship' => $r->citizenship ?? 'Filipino',
                'occupation' => $r->latestOccupation->occupation ?? '',
                'special_category' => $tags ? implode(", ", $tags) : '',
            ];
        });


        // **Household meta**
        $region = "Region II"; // or fetch from config
        $province = $household->barangay->province ?? "Isabela";
        $city = $household->barangay->city ?? "City of Ilagan";
        $barangay = $household->barangay->barangay_name;
        $household_address = $household->house_number . ' ' . ($household->street->street_name ?? '') . ', Purok ' . ($household->purok->purok_number ?? '');

        // Officers — replace with query if you store barangay officials
        $head_of_household = $household_members->first()->first_name . ' ' . $household_members->first()->last_name;
        $punong_barangay = BarangayOfficial::where('position', 'barangay_captain')
            ->where('status', 'active')
            ->first()?->resident->full_name ?? "_________________";

        $barangay_secretary = BarangayOfficial::where('position', 'barangay_secretary')
            ->where('status', 'active')
            ->first()?->resident->full_name ?? "_________________";

        $year = now()->year;

        $pdf = Pdf::loadView('bims.household_rbi_form', compact(
            'region',
            'province',
            'city',
            'barangay',
            'household_address',
            'household_members',
            'head_of_household',
            'barangay_secretary',
            'punong_barangay',
            'year'
        ))->setPaper('legal', 'landscape');

        return $pdf->stream("Household-{$household->id}-RBI-FORM.pdf");
    }
}

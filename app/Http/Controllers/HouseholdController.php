<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Family;
use App\Models\FamilyRelation;
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
use DB;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;;

        $query = HouseholdResident::query()
            ->with([
                'resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,residency_type,residency_date',
                'household:id,barangay_id,purok_id,street_id,house_number,ownership_type,housing_condition,year_established,house_structure,number_of_rooms,number_of_floors',
                'household.street:id,street_name',
                'household.purok:id,purok_number',
                'household.residentsCount'
            ])
            ->whereHas('household', function ($q) use ($brgy_id) {
                $q->where('barangay_id', $brgy_id);
            })
            ->where('relationship_to_head', 'self')
            ->whereIn('id', function ($sub) {
                $sub->selectRaw('MAX(id)')
                    ->from('household_residents')
                    ->where('relationship_to_head', 'self')
                    ->groupBy('household_id');
            })
            ->latest('updated_at');

        // Head name search
        if ($name = request('name')) {
            $name = trim($name);
            $parts = collect(explode(' ', $name))
                ->filter(fn($p) => $p !== '')
                ->values();

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

        // Purok filter
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('household.purok', function ($q) {
                $q->where('purok_number', request('purok'));
            });
        }

        // Street filter
        if (request()->filled('street') && request('street') !== 'All') {
            $query->whereHas('household.street', function ($q) {
                $q->where('street_name', request('street'));
            });
        }

        // Ownership type filter
        if (request()->filled('own_type') && request('own_type') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('ownership_type', request('own_type'));
            });
        }

        // Housing condition filter
        if (request()->filled('condition') && request('condition') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('housing_condition', request('condition'));
            });
        }

        // Structure filter
        if (request()->filled('structure') && request('structure') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('house_structure', request('structure'));
            });
        }

        // Get paginated results
        //dd($query->get());
        $heads = $query->paginate(10)->withQueryString();

        // For dropdowns
        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        $streets = Street::whereHas('purok', function ($query) use ($brgy_id) {
            $query->where('barangay_id', $brgy_id);
        })->pluck('street_name');

        return Inertia::render("BarangayOfficer/Household/Index", [
            "households" => $heads, // contains latest head per household
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
        $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
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

                    // Assuming $resident already contains the single resident model
                    $monthlyIncome = $resident->occupations()
                        ->whereNull('ended_at')
                        ->sum('monthly_income') ?? 0;

                    // Determine income bracket based on the monthly income
                    if ($monthlyIncome < 5000) {
                        $incomeBracket = 'below_5000';
                        $incomeCategory = 'survival';
                    } elseif ($monthlyIncome <= 10000) {
                        $incomeBracket = '5001_10000';
                        $incomeCategory = 'poor';
                    } elseif ($monthlyIncome <= 20000) {
                        $incomeBracket = '10001_20000';
                        $incomeCategory = 'low_income';
                    } elseif ($monthlyIncome <= 40000) {
                        $incomeBracket = '20001_40000';
                        $incomeCategory = 'lower_middle_income';
                    } elseif ($monthlyIncome <= 70000) {
                        $incomeBracket = '40001_70000';
                        $incomeCategory = 'middle_income';
                    } elseif ($monthlyIncome <= 120000) {
                        $incomeBracket = '70001_120000';
                        $incomeCategory = 'upper_middle_income';
                    } else {
                        $incomeBracket = 'above_120001';
                        $incomeCategory = 'high_income';
                    }

                    // Create the family record
                    $family = Family::create([
                        'barangay_id'     => $barangayId,
                        'household_id'    => $household->id,
                        'income_bracket'  => $incomeBracket,
                        'income_category' => $incomeCategory,
                        'family_name'     => $resident->lastname ?? null,
                        'family_type'     => "nuclear",
                    ]);

                    $resident->update([
                        'household_id' => $household->id,
                        'family_id' => $family->id,
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
            $head = HouseholdResident::with(['resident', 'household'])
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
}

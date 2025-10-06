<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResidentHouseholdRequest;
use App\Http\Resources\ResidentResource;
use App\Models\Barangay;
use App\Models\Family;
use App\Models\FamilyRelation;
use App\Models\Household;
use App\Models\HouseholdHeadHistory;
use App\Models\OccupationType;
use App\Models\Purok;
use App\Models\HouseholdResident;
use App\Models\Request;
use App\Models\Resident;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;

use App\Models\Street;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Str;
use Inertia\Inertia;

function calculateAge($birthdate)
{
    if (!$birthdate) {
        return null;
    }

    try {
        return Carbon::createFromFormat('Y-m-d', $birthdate)->age;
    } catch (\Exception $e) {
        return null;
    }
}

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = Resident::query()
            ->with([
                'socialwelfareprofile',
                'occupations' => function ($q) {
                    $q->latest('started_at');
                },
                'livelihoods',
            ])
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false);

        // ✅ get puroks once
        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        // ✅ name search optimization
        if ($name = request('name')) {
            $query->where(function ($q) use ($name) {
                $like = "%{$name}%";
                $q->where('firstname', 'like', $like)
                    ->orWhere('lastname', 'like', $like)
                    ->orWhere('middlename', 'like', $like)
                    ->orWhere('suffix', 'like', $like)
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", [$like]);
            });
        }

        // ✅ filtering
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }
        if (request()->filled('sex') && request('sex') !== 'All') {
            $query->where('sex', request('sex'));
        }
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->where('gender', request('gender'));
        }
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }
        if (request()->filled('cstatus') && request('cstatus') !== 'All') {
            $query->where('civil_status', request('cstatus'));
        }

        // ✅ age filtering
        if (request()->filled('age_group') && request('age_group') !== 'All') {
            $today = Carbon::today();

            [$min, $max] = match (request('age_group')) {
                '0_6_months' => [$today->copy()->subMonths(6), $today],
                '7mos_2yrs'  => [$today->copy()->subYears(2), $today->copy()->subMonths(7)],
                '3_5yrs'     => [$today->copy()->subYears(5), $today->copy()->subYears(3)],
                '6_12yrs'    => [$today->copy()->subYears(12), $today->copy()->subYears(6)],
                '13_17yrs'   => [$today->copy()->subYears(17), $today->copy()->subYears(13)],
                '18_59yrs'   => [$today->copy()->subYears(59), $today->copy()->subYears(18)],
                '60_above'   => [null, $today->copy()->subYears(60)],
                default      => [null, null],
            };

            if ($min && $max) {
                $query->whereBetween('birthdate', [$min, $max]);
            } elseif ($max) {
                $query->where('birthdate', '<=', $max);
            }
        }

        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

        if (
            // request('indigent') === '1' ||
            request('fourps') === '1' ||
            request('solo_parent') === '1' ||
            request('pwd') === '1'
        ) {
            $query->whereHas('socialwelfareprofile', function ($q) {
                // if (request('indigent') === '1') $q->where('is_indigent', 1);
                if (request('fourps') === '1') $q->where('is_4ps_beneficiary', 1);
                if (request('solo_parent') === '1') $q->where('is_solo_parent', 1);
                if (request('pwd') === '1') $q->where('is_pwd', 1);
            });
        }

        // ✅ Fetch residents
        $residents = request('all') === 'true'
            ? $query->get()
            : $query->paginate(10)->onEachSide(1)->appends(request()->query());

        // ✅ Transform data
        $transform = function ($resident) {
            return [
                'id' => $resident->id,
                'resident_picture' => $resident->resident_picture_path,
                'firstname' => $resident->firstname,
                'middlename' => $resident->middlename,
                'lastname' => $resident->lastname,
                'suffix' => $resident->suffix,
                'sex' => $resident->sex,
                'purok_number' => $resident->purok_number,
                'birthdate' => $resident->birthdate,
                'age' => $resident->age,
                'civil_status' => $resident->civil_status,
                'ethnicity' => $resident->ethnicity,
                'religion' => $resident->religion,
                'contact_number' => $resident->contact_number,
                'is_pwd' => $resident->is_pwd,
                'email' => $resident->email,
                'registered_voter' => $resident->registered_voter,
                'employment_status' => $resident->employment_status,
                // 'isIndigent' => $resident->socialwelfareprofile?->is_indigent,
                'isSoloParent' => $resident->socialwelfareprofile?->is_solo_parent,
                'is4ps' => $resident->socialwelfareprofile?->is_4ps_beneficiary,
                'occupation' => $resident->occupations->first()?->occupation, // already ordered by latest
            ];
        };

        if (request('all') === 'true') {
            $residents = $residents->map($transform);
        } else {
            $residents->getCollection()->transform($transform);
        }

        return Inertia::render('BarangayOfficer/Resident/Index', [
            'residents' => $residents,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks,
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
        $occupationTypes = OccupationType::all()->pluck('name');

        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();
        return Inertia::render("BarangayOfficer/Resident/Create", [
            'puroks' => $puroks,
            'streets' => $streets,
            'barangays' => $barangays,
            'occupationTypes' => $occupationTypes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResidentRequest $request)
    {

        $barangayId = Auth()->user()->barangay_id; // get brgy id through the admin
        try {
            $data = $request->validated();
            /**
             * @var $image \Illuminate\Http\UploadedFile
             */
            //dd($data);
            $image = $data['resident_image'] ?? null;
            if ($image) {
                $folder = 'resident/' . $data['lastname'] . $data['firstname'] . Str::random(10);
                $data['resident_image'] = $image->store($folder, 'public');
            }

            $householdId = $data['housenumber'] ?? null;
            $familyId =  Family::where('household_id', $householdId)
                ->where('barangay_id', $barangayId)
                ->value('id');

            $residentInformation = [
                'resident_picture_path' => $data['resident_image'] ?? null,
                'barangay_id' => $barangayId,
                'firstname' => $data['firstname'],
                'middlename' => $data['middlename'],
                'lastname' => $data['lastname'],
                'maiden_name' => $data['maiden_name'] ?? null,
                'suffix' => $data['suffix'] ?? null,
                'sex' => $data['sex'],
                'gender' => $data['gender'],
                'birthdate' => $data['birthdate'],
                'birthplace' => $data['birthplace'],
                'civil_status' => $data['civil_status'],
                'citizenship' => $data['citizenship'],
                'employment_status' => $data['employment_status'],
                'religion' => $data['religion'],
                'contact_number' => $data['contactNumber'] ?? null,
                'registered_voter' => $data['registered_voter'],
                'is_household_head' => 0,
                'household_id' => $householdId,
                'ethnicity' => $data['ethnicity'] ?? null,
                'email' => $data['email'] ?? null,
                'residency_date' => $data['residency_date'] ?? now(),
                'residency_type' => $data['residency_type'] ?? 'permanent',
                'purok_number' => $data['purok_number'],
                'street_id' => $data['street_id'] ?? null,
                'is_pwd' => $data['is_pwd'] ?? null,
                'family_id' => $familyId,
                'verfied' => $data['verified'] ?? 0,
            ];

            $residentVotingInformation = [
                'registered_barangay_id' => $data['registered_barangay'] ?? null,
                'voting_status' => $data['voting_status'] ?? null,
                'voter_id_number' => $data['voter_id_number'] ?? null,
            ];


            $residentSocialWelfareProfile = [
                'barangay_id' => $barangayId,
                'is_4ps_beneficiary' => $data['is_4ps_beneficiary'] ?? false,
                'is_solo_parent' => $data['is_solo_parent'] ?? false,
                'solo_parent_id_number' => $data['solo_parent_id_number'] ?? null,
            ];

            $householdResident = [
                'household_id' => $householdId,
                'relationship_to_head' => $data['relationship_to_head'] ?? null,
                'household_position' => $data['household_position'] ?? null,
            ];


            $resident = Resident::create($residentInformation);
            // add voting information
            $resident->votingInformation()->create([
                ...$residentVotingInformation,
            ]);

            //add educational histories
            if (!empty($data['educational_histories']) && is_array($data['educational_histories'])) {
                foreach ($data['educational_histories'] ?? [] as $educationalData) {
                    $resident->educationalHistories()->create([
                        'educational_attainment' => $educationalData['education'] ?? null,
                        'school_name' => $educationalData['school_name'] ?? null,
                        'school_type' => $educationalData['school_type'] ?? null,
                        'year_started' => $educationalData['year_started'] ?? null,
                        'year_ended' => $educationalData['year_ended'] ?? null,
                        'program' => $educationalData['program'] ?? null,
                        'education_status' => $educationalData['education_status'] ?? null,
                    ]);
                }
            }

            //add occupations
            if (!empty($data['occupations']) && is_array($data['occupations'])) {
                $normalizedOccupations = [];

                foreach ($data['occupations'] as $occupationData) {
                    $income = $occupationData['income'] ?? 0;

                    // Normalize all income to monthly
                    $monthlyIncome = match ($occupationData['income_frequency']) {
                        'monthly' => $income,
                        'weekly' => $income * 4,
                        'bi-weekly' => $income * 2,
                        'daily' => $income * 22, // Assuming 22 working days per month
                        'annually' => $income / 12,
                        default => null,
                    };

                    $normalizedOccupations[] = [
                        'occupation' => $occupationData['occupation'] ?? null,
                        'employment_type' => $occupationData['employment_type'] ?? null,
                        'occupation_status' => $occupationData['occupation_status'] ?? null,
                        'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                        'employer' => $occupationData['employer'] ?? null,
                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                        'is_main_livelihood' => $occupationData['is_main_source'] ?? false,
                        'started_at' => $occupationData['started_at'],
                        'ended_at' => $occupationData['ended_at'] ?? null,
                        'monthly_income' => $monthlyIncome,
                    ];
                }

                // Insert all occupations
                $resident->occupations()->createMany($normalizedOccupations);

                // Recompute family's total and average monthly income
                $family = Family::with('members.occupations')->findOrFail($familyId);
                $allIncomes = $family->members
                    ->flatMap(
                        fn($m) =>
                        // Filter only active occupations
                        $m->occupations->filter(
                            fn($occupation) =>
                            is_null($occupation->ended_at) || $occupation->ended_at >= now()
                        )
                    )
                    // Extract income values
                    ->pluck('monthly_income')
                    // Remove nulls
                    ->filter();

                $totalIncome = $allIncomes->sum();

                // Determine bracket and category
                $incomeBracket = match (true) {
                    $totalIncome < 5000 => 'below_5000',
                    $totalIncome <= 10000 => '5001_10000',
                    $totalIncome <= 20000 => '10001_20000',
                    $totalIncome <= 40000 => '20001_40000',
                    $totalIncome <= 70000 => '40001_70000',
                    $totalIncome <= 120000 => '70001_120000',
                    default => 'above_120001',
                };

                $incomeCategory = match (true) {
                    $totalIncome <= 10000 => 'survival',
                    $totalIncome <= 20000 => 'poor',
                    $totalIncome <= 40000 => 'low_income',
                    $totalIncome <= 70000 => 'lower_middle_income',
                    $totalIncome <= 120000 => 'middle_income',
                    $totalIncome <= 200000 => 'upper_middle_income',
                    default => 'above_high_income',
                };

                // Update family in one go
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                ]);
            }

            $residentMedicalInformation = [
                'weight_kg' => $data['weight_kg'] ?? 0,
                'height_cm' => $data['height_cm'] ?? 0,
                'bmi' => $data['bmi'] ?? 0,
                'nutrition_status' => $data['nutrition_status'] ?? null,
                'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
                'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
                'emergency_contact_relationship' => $data['emergency_contact_relationship'] ?? null,
                'is_smoker' => $data['is_smoker'] ?? 0,
                'is_alcohol_user' => $data['is_alcohol_user'] ?? 0,
                'blood_type' => $data['blood_type'] ?? null,
                'has_philhealth' => $data['has_philhealth'] ?? 0,
                'philhealth_id_number' => $data['philhealth_id_number'] ?? null,
                'pwd_id_number'  => $data['pwd_id_number'] ?? null,
            ];

            // add medical informations
            $resident->medicalInformation()->create($residentMedicalInformation);
            if ($data["is_pwd"] == '1') {
                foreach ($data['disabilities'] ?? [] as $disability) {
                    $resident->disabilities()->create(attributes: [
                        'disability_type' => $disability['disability_type'] ?? null,
                    ]);
                }
            }
            // add social welfare profile
            $resident->socialwelfareprofile()->create($residentSocialWelfareProfile);
            if ($householdId) {
                $resident->householdResidents()->create($householdResident);
                // Only process if not household head and has a declared relationship

                if (!empty($data['relationship_to_head'])) {
                    // Load all household members with relationship info
                    $members = HouseholdResident::where('household_id', $householdId)
                        ->with('resident')
                        ->get();

                    // Get the resident ID of the head
                    $head = $members->firstWhere('relationship_to_head', 'self');
                    if (!$head) {
                        return back()->withErrors(['error' => 'Household head is not defined (no member marked as self).']);
                    }
                    $headId = $head->resident_id;

                    // Get spouse
                    $spouse = $members->firstWhere('relationship_to_head', 'spouse');

                    // Create spouse ↔ head relation
                    if ($spouse) {
                        FamilyRelation::firstOrCreate([
                            'resident_id' => $headId,
                            'related_to' => $spouse->resident_id,
                            'relationship' => 'spouse',
                        ]);
                        FamilyRelation::firstOrCreate([
                            'resident_id' => $spouse->resident_id,
                            'related_to' => $headId,
                            'relationship' => 'spouse',
                        ]);
                    }

                    // Loop over all members
                    foreach ($members as $member) {
                        $residentId = $member->resident_id;
                        $relationship = strtolower(trim($member->relationship_to_head));

                        switch ($relationship) {
                            case 'child':
                                // Link child → head
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $headId,
                                    'relationship' => 'child',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $headId,
                                    'related_to' => $residentId,
                                    'relationship' => 'parent',
                                ]);

                                // Link child ↔ spouse
                                if ($spouse) {
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId,
                                        'related_to' => $spouse->resident_id,
                                        'relationship' => 'child',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $spouse->resident_id,
                                        'related_to' => $residentId,
                                        'relationship' => 'parent',
                                    ]);
                                }
                                break;

                            case 'parent':
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $headId,
                                    'relationship' => 'parent',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $headId,
                                    'related_to' => $residentId,
                                    'relationship' => 'child',
                                ]);
                                break;

                            case 'grandparent':
                                $parents = Resident::find($headId)?->parents ?? collect();

                                foreach ($parents as $parent) {
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId,
                                        'related_to' => $parent->id,
                                        'relationship' => 'parent',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $parent->id,
                                        'related_to' => $residentId,
                                        'relationship' => 'child',
                                    ]);
                                }
                                break;

                            case 'sibling':
                                $sharedParents = Resident::find($headId)?->parents ?? collect();

                                foreach ($sharedParents as $parent) {
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $parent->id,
                                        'related_to' => $residentId,
                                        'relationship' => 'parent',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId,
                                        'related_to' => $parent->id,
                                        'relationship' => 'child',
                                    ]);
                                }
                                break;

                            case 'parent_in_law':
                                if ($spouse) {
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId, // parent_in_law
                                        'related_to' => $spouse->resident_id,
                                        'relationship' => 'parent',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $spouse->resident_id,
                                        'related_to' => $residentId,
                                        'relationship' => 'child',
                                    ]);
                                }
                                break;

                            case 'spouse':
                            case 'self':
                                // already handled earlier
                                break;

                            default:
                                // skip or log unknown relationships
                                break;
                        }
                    }

                    // After looping through members
                    $children = $members->filter(function ($member) {
                        return strtolower($member->relationship_to_head) === 'child';
                    });

                    foreach ($children as $i => $childA) {
                        foreach ($children as $j => $childB) {
                            if ($i !== $j) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $childA->resident_id,
                                    'related_to' => $childB->resident_id,
                                    'relationship' => 'sibling',
                                ]);
                            }
                        }
                    }
                }
            }
            if (isset($data['has_vehicle'])) {
                foreach ($data['vehicles'] ?? [] as $vehicle) {
                    $resident->vehicles()->create([
                        'vehicle_type' => $vehicle['vehicle_type'],
                        'vehicle_class' => $vehicle['vehicle_class'],
                        'usage_status' => $vehicle['usage_status'],
                        'is_registered' => $vehicle['is_registered'],
                    ]);
                }
            }

            if (calculateAge($resident->birthdate) >= 60) {
                $resident->seniorcitizen()->create([
                    'is_pensioner' => $data['is_pensioner'] ?? null,
                    'osca_id_number' => $data['osca_id_number'] ?? null,
                    'pension_type' => $data['pension_type'] ?? null,
                    'living_alone' => $data['living_alone'] ?? null,
                ]);
            }
            $family = Family::with(['members.occupations'])->findOrFail($familyId);
            if ($family) {
                // Re-fetch occupations including newly created ones
                $family->load(['members.occupations']);

                $sumIncome = $family->members->sum(function ($member) {
                    return $member->occupations
                        ->filter(fn($occupation) => is_null($occupation->ended_at) || $occupation->ended_at >= now())
                        ->sum('monthly_income') ?? 0;
                });

                $memberCount = $family->members->count();

                $totalIncome = $memberCount > 0
                    ? $sumIncome / $memberCount
                    : 0;
                // Bracket classification
                $incomeBracket = match (true) {
                    $totalIncome < 5000 => 'below_5000',
                    $totalIncome <= 10000 => '5001_10000',
                    $totalIncome <= 20000 => '10001_20000',
                    $totalIncome <= 40000 => '20001_40000',
                    $totalIncome <= 70000 => '40001_70000',
                    $totalIncome <= 120000 => '70001_120000',
                    default => 'above_120001',
                };

                $incomeCategory = match (true) {
                    $totalIncome <= 10000 => 'survival',
                    $totalIncome <= 20000 => 'poor',
                    $totalIncome <= 40000 => 'low_income',
                    $totalIncome <= 70000 => 'lower_middle_income',
                    $totalIncome <= 120000 => 'middle_income',
                    $totalIncome <= 200000 => 'upper_middle_income',
                    default => 'above_high_income',
                };

                // Update family classification
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                ]);
            }
            return redirect()->route('resident.index')->with('success', 'Resident ' . ucwords($resident->full_name) . ' created successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Resident could not be created: ' . $e->getMessage());
        }
    }

    public function storeHousehold(StoreResidentHouseholdRequest $request)
    {

        $barangayId = Auth()->user()->barangay_id;
        try {
            $data = $request->validated();
            $householdData = [
                'barangay_id' =>  $barangayId ?? null,
                'purok_id' => $data['purok'] ?? null,
                'street_id' => $data['street'] ?? null,
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


            $household = Household::create($householdData);

            if ($household) {
                // toilets
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
                if ($data['has_pets']) {
                    foreach ($data['pets'] ?? [] as $pet) {
                        $household->pets()->create([
                            'pet_type' => $pet["pet_type"] ?? null,
                            'is_vaccinated' => $pet["is_vaccinated"] ?? null,
                        ]);
                    }
                }

                // livestocks
                if ($data['has_livestock']) {
                    foreach ($data['livestocks'] ?? [] as $livestock) {
                        $household->livestocks()->create([
                            'livestock_type' => $livestock["livestock_type"] ?? null,
                            'quantity' => $livestock["quantity"] ?? null,
                            'purpose' => $livestock["purpose"] ?? null,
                        ]);
                    }
                }

                // internet
                if ($data['type_of_internet']) {
                    $household->internetAccessibility()->create([
                        'type_of_internet' => $data["type_of_internet"] ?? null,
                    ]);
                }
                $hhld = $data['household'] ?? null;
                if ($hhld) {
                    foreach ($hhld['families'] ?? [] as $familyData) {
                        $family = Family::create([
                            'barangay_id' => $barangayId,
                            'household_id' => $household->id,
                            'income_bracket' =>  $hhld['income_bracket'] ?? null,
                            'income_category' =>  $hhld['income_category'] ?? null,
                            'family_name' =>  null,
                            'family_type' =>  $familyData['family_type'] ?? null,
                        ]);

                        $members = collect($familyData['members'] ?? [])
                            ->sortByDesc(fn($member) => $member['is_household_head'] ?? false)
                            ->values();

                        // resident information
                        foreach ($members as $member) {
                            $empStatus = 'unemployed';
                            $latestStatus = null;

                            foreach ($member['educations'] ?? [] as $education) {
                                $empStatus = isset($education['educational_status']) && $education['educational_status'] === 'enrolled'
                                    ? 'student'
                                    : null;

                                if (is_null($empStatus)) {
                                    $latestOccupation = collect($member['occupations'] ?? [])
                                        ->sortByDesc('started_at')
                                        ->first();
                                    $latestStatus = $latestOccupation['employment_status'] ?? 'unemployed';
                                }
                            }

                            $image = $member['resident_image'] ?? null;
                            $imagePath = null;
                            if ($image instanceof UploadedFile) {
                                $folder = 'resident/' . $member['lastname'] . $member['firstname'] . Str::random(10);
                                $imagePath = $image->store($folder, 'public');
                            }

                            $family->update([
                                'family_name' =>  $member['lastname'],
                            ]);

                            $residentInformation = [
                                'resident_picture_path' => $imagePath ?? null,
                                'barangay_id' => $barangayId,
                                'firstname' => $member['firstname'],
                                'middlename' => $member['middlename'],
                                'lastname' => $member['lastname'],
                                'maiden_name' => $member['maiden_name'] ?? null,
                                'suffix' => $member['suffix'] ?? null,
                                'sex' => $member['sex'],
                                'gender' => $member['gender'],
                                'birthdate' => $member['birthdate'],
                                'birthplace' => $member['birthplace'],
                                'civil_status' => $member['civil_status'],
                                'citizenship' => $member['citizenship'],
                                'employment_status' => $empStatus ?? $latestStatus,
                                'religion' => $member['religion'],
                                'contact_number' => $member['contactNumber'] ?? null,
                                'registered_voter' => $member['registered_voter'],
                                'ethnicity' => $member['ethnicity'] ?? null,
                                'email' => $member['email'] ?? null,
                                'residency_date' => $member['residency_date'] ?? now(),
                                'residency_type' => $member['residency_type'] ?? 'permanent',
                                'purok_number' => $data['purok'],
                                'street_id' => $data['street'] ?? null,
                                'is_pwd' => $member['is_pwd'] ?? null,
                                'household_id' => $household->id,
                                'is_household_head' => $member['is_household_head'] ?? 0,
                                'family_id' => $family->id,
                                'verified' => $data['verified'],
                            ];

                            $residentVotingInformation = [
                                'registered_barangay_id' => $member['registered_barangay'] ?? null,
                                'voting_status' => $member['voting_status'] ?? null,
                                'voter_id_number' => $member['voter_id_number'] ?? null,
                            ];

                            $residentSocialWelfareProfile = [
                                'barangay_id' => $barangayId,
                                'is_4ps_beneficiary' => $member['is_4ps_beneficiary'] ?? false,
                                'is_solo_parent' => $member['is_solo_parent'] ?? false,
                                'solo_parent_id_number' => $member['solo_parent_id_number'] ?? null,
                            ];

                            $householdResident = [
                                'household_id' => $household->id,
                                'relationship_to_head' => $member['relation_to_household_head'] ?? null,
                                'household_position' => $member['household_position'] ?? null,
                            ];

                            $resident = Resident::create($residentInformation);

                            // add voting information
                            if ($resident->registered_voter) {
                                $resident->votingInformation()->create([
                                    ...$residentVotingInformation,
                                ]);
                            }

                            //add educational histories
                            if (!empty($member['educations']) && is_array($member['educations'])) {
                                foreach ($member['educations'] as $educationalData) {
                                    $resident->educationalHistories()->create([
                                        'educational_attainment' => $educationalData['education'] ?? null,
                                        'school_name'            => $educationalData['school_name'] ?? null,
                                        'school_type'            => $educationalData['school_type'] ?? null,
                                        'year_started'           => $educationalData['year_started'] ?? null,
                                        'year_ended'             => $educationalData['year_ended'] ?? null,
                                        'program'                => $educationalData['program'] ?? null,
                                        'education_status'       => $educationalData['educational_status'] ?? null,
                                    ]);
                                }
                            }

                            //add occupations
                            if (!empty($member['occupations']) && is_array($member['occupations'])) {
                                $normalizedOccupations = [];
                                foreach ($member['occupations'] ?? [] as $occupationData) {
                                    $resident->occupations()->create([
                                        'occupation' => $occupationData['occupation'] ?? null,
                                        'employment_type' => $occupationData['employment_type'] ?? "null",
                                        'occupation_status' => $occupationData['occupation_status'] ?? null,
                                        'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                                        'employer' => $occupationData['employer'] ?? null,
                                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                                        'is_main_livelihood' => $occupationData['is_main_source'] ?? false,
                                        'started_at' => $occupationData['started_at'] ?? null,
                                        'ended_at' => $occupationData['ended_at'] ?? null,
                                        'monthly_income' => $occupationData['monthly_income'] ?? null,
                                    ]);
                                }
                            }

                            $residentMedicalInformation = [
                                'weight_kg' => $member['weight_kg'] ?? 0,
                                'height_cm' => $member['height_cm'] ?? 0,
                                'bmi' => $member['bmi'] ?? 0,
                                'nutrition_status' => $member['nutrition_status'] ?? null,
                                'emergency_contact_number' => $member['emergency_contact_number'] ?? null,
                                'emergency_contact_name' => $member['emergency_contact_name'] ?? null,
                                'emergency_contact_relationship' => $member['emergency_contact_relationship'] ?? null,
                                'is_smoker' => $member['is_smoker'] ?? 0,
                                'is_alcohol_user' => $member['is_alcohol_user'] ?? 0,
                                'blood_type' => $member['blood_type'] ?? null,
                                'has_philhealth' => $member['has_philhealth'] ?? 0,
                                'philhealth_id_number' => $member['philhealth_id_number'] ?? null,
                                'pwd_id_number'  => $member['pwd_id_number'] ?? null,
                            ];
                            $resident->medicalInformation()->create($residentMedicalInformation);
                            if ($member["is_pwd"] == '1') {
                                foreach ($member['disabilities'] ?? [] as $disability) {
                                    $resident->disabilities()->create(attributes: [
                                        'disability_type' => $disability['disability_type'] ?? null,
                                    ]);
                                }
                            }
                            $resident->socialwelfareprofile()->create($residentSocialWelfareProfile);

                            $resident->householdResidents()->create($householdResident);

                            if (isset($member['has_vehicle'])) {
                                foreach ($member['vehicles'] ?? [] as $vehicle) {
                                    $resident->vehicles()->create([
                                        'vehicle_type' => $vehicle['vehicle_type'],
                                        'vehicle_class' => $vehicle['vehicle_class'],
                                        'usage_status' => $vehicle['usage_status'],
                                        'is_registered' => $vehicle['is_registered'],
                                    ]);
                                }
                            }

                            if ($member['is_household_head'] == 1) {
                                HouseholdHeadHistory::create([
                                    'resident_id' => $resident->id,
                                    'household_id' => $household->id,
                                    'start_year' => 2025,
                                    'end_year' => null
                                ]);
                            }


                            if (calculateAge($resident->birthdate) >= 60) {
                                $resident->seniorcitizen()->create([
                                    'is_pensioner' => $member['is_pensioner'] ?? null,
                                    'osca_id_number' => $member['osca_id_number'] ?? null,
                                    'pension_type' => $member['pension_type'] ?? null,
                                    'living_alone' => $member['living_alone'] ?? null,
                                ]);
                            }
                        }

                        $householdId = $household->id;

                        // Load all household members with relationship info
                        $members = HouseholdResident::where('household_id', $householdId)
                            ->with('resident')
                            ->get();

                        // Get the resident ID of the head
                        $head = $members->firstWhere('relationship_to_head', 'self');
                        if (!$head) {
                            return back()->withErrors(['error' => 'Household head is not defined (no member marked as self).']);
                        }
                        $headId = $head->resident_id;

                        // Get spouse
                        $spouse = $members->firstWhere('relationship_to_head', 'spouse');

                        // Create spouse ↔ head relation
                        if ($spouse) {
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $headId,
                                'related_to' => $spouse->resident_id,
                                'relationship' => 'spouse',
                            ]);
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $spouse->resident_id,
                                'related_to' => $headId,
                                'relationship' => 'spouse',
                            ]);
                        }

                        // FIRST PASS: assign / inherit sibling_group_key for sibling groups
                        foreach ($members as $member) {
                            $relationship = strtolower(trim($member->relationship_to_head));

                            switch ($relationship) {
                                case 'sibling':
                                case 'sibling-of-spouse':
                                    // assign a new group key if not already set
                                    if (empty($member->sibling_group_key)) {
                                        $member->sibling_group_key = Str::uuid();
                                    }
                                    break;

                                case 'spouse-of-sibling-of-spouse':
                                case 'spouse-sibling':
                                    // inherit group key from sibling or sibling-of-spouse
                                    $partner = $members->first(fn($m) =>
                                        in_array(strtolower($m->relationship_to_head), ['sibling', 'sibling-of-spouse'])
                                    );

                                    if ($partner) {
                                        $member->sibling_group_key = $partner->sibling_group_key ?: Str::uuid();
                                        $partner->sibling_group_key = $member->sibling_group_key; // ensure shared key
                                    } else if (empty($member->sibling_group_key)) {
                                        $member->sibling_group_key = Str::uuid();
                                    }
                                    break;

                                case 'niblings':
                                    // inherit group key from parent (sibling, sibling-of-spouse, or spouse-of-sibling-of-spouse)
                                    $parent = $members->first(fn($m) =>
                                        in_array(strtolower($m->relationship_to_head), [
                                            'sibling', 'sibling-of-spouse', 'spouse-of-sibling-of-spouse'
                                        ]) &&
                                        !empty($m->sibling_group_key)
                                    );

                                    if ($parent) {
                                        $member->sibling_group_key = $parent->sibling_group_key;
                                    } else {
                                        // safe fallback
                                        if (empty($member->sibling_group_key)) {
                                            $member->sibling_group_key = Str::uuid();
                                        }
                                    }
                                    break;

                                default:
                                    // nothing to do for other relationships
                                    break;
                            }
                        }
                        // Loop over all members
                        foreach ($members as $member) {
                            $residentId = $member->resident_id;
                            $relationship = strtolower(trim($member->relationship_to_head));

                            switch ($relationship) {
                                case 'child':
                                    // Link child → head
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId,
                                        'related_to' => $headId,
                                        'relationship' => 'child',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $headId,
                                        'related_to' => $residentId,
                                        'relationship' => 'parent',
                                    ]);

                                    // Link child ↔ spouse
                                    if ($spouse) {
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $residentId,
                                            'related_to' => $spouse->resident_id,
                                            'relationship' => 'child',
                                        ]);
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $spouse->resident_id,
                                            'related_to' => $residentId,
                                            'relationship' => 'parent',
                                        ]);
                                    }
                                    break;

                                case 'parent':
                                    // Link parent ↔ head
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $residentId,
                                        'related_to' => $headId,
                                        'relationship' => 'parent',
                                    ]);
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $headId,
                                        'related_to' => $residentId,
                                        'relationship' => 'child',
                                    ]);

                                    // Link all parents together as spouses (excluding head's spouse)
                                    $allParents = $members->filter(fn($m) => strtolower($m->relationship_to_head) === 'parent' && (!$spouse || $m->resident_id !== $spouse->resident_id));
                                    if ($allParents->count() > 1) {
                                        $parentsArray = $allParents->values();
                                        for ($i = 0; $i < $parentsArray->count(); $i++) {
                                            for ($j = $i + 1; $j < $parentsArray->count(); $j++) {
                                                FamilyRelation::firstOrCreate([
                                                    'resident_id' => $parentsArray[$i]->resident_id,
                                                    'related_to' => $parentsArray[$j]->resident_id,
                                                    'relationship' => 'spouse',
                                                ]);
                                                FamilyRelation::firstOrCreate([
                                                    'resident_id' => $parentsArray[$j]->resident_id,
                                                    'related_to' => $parentsArray[$i]->resident_id,
                                                    'relationship' => 'spouse',
                                                ]);
                                            }
                                        }
                                    }
                                    break;

                                case 'grandparent':
                                    $parents = Resident::find($headId)?->parents ?? collect();

                                    foreach ($parents as $parent) {
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $residentId,
                                            'related_to' => $parent->id,
                                            'relationship' => 'parent',
                                        ]);
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $parent->id,
                                            'related_to' => $residentId,
                                            'relationship' => 'child',
                                        ]);
                                    }
                                    break;

                                case 'sibling':
                                    $parents = $members->filter(fn($m) => strtolower($m->relationship_to_head) === 'parent');

                                    foreach ($parents as $parent) {
                                        // link sibling <-> parent
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $member->resident_id,
                                            'related_to' => $parent->resident_id,
                                            'relationship' => 'child',
                                        ]);

                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $parent->resident_id,
                                            'related_to' => $member->resident_id,
                                            'relationship' => 'parent',
                                        ]);
                                    }

                                    // link sibling <-> head
                                    if ($head) {
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $member->resident_id,
                                            'related_to' => $head->resident_id,
                                            'relationship' => 'sibling',
                                        ]);

                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $head->resident_id,
                                            'related_to' => $member->resident_id,
                                            'relationship' => 'sibling',
                                        ]);
                                    }
                                    break;

                                case 'parent_in_law':
                                    if ($spouse) {
                                        // parent-in-law <-> spouse
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $residentId,
                                            'related_to' => $spouse->resident_id,
                                            'relationship' => 'parent',
                                        ]);

                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $spouse->resident_id,
                                            'related_to' => $residentId,
                                            'relationship' => 'child',
                                        ]);
                                    }

                                    // Collect all parent_in_law members
                                    $parentsInLaw = $members->filter(fn($m) => strtolower($m->relationship_to_head) === 'parent_in_law');

                                    if ($parentsInLaw->count() > 1) {
                                        // Connect the parent_in_laws as spouses
                                        $parentsInLaw->each(function($first) use ($parentsInLaw) {
                                            $parentsInLaw->each(function($second) use ($first) {
                                                if ($first->resident_id !== $second->resident_id) {
                                                    FamilyRelation::firstOrCreate([
                                                        'resident_id' => $first->resident_id,
                                                        'related_to' => $second->resident_id,
                                                        'relationship' => 'spouse',
                                                    ]);
                                                }
                                            });
                                        });
                                    }
                                    break;

                                case 'sibling-of-spouse':
                                    if ($spouse) {
                                        // Assign sibling group key if not already set
                                        if (!$member->sibling_group_key) {
                                            $member->sibling_group_key = Str::uuid();
                                            $member->save();
                                        }

                                        // Link sibling-of-spouse ↔ spouse as "sibling"
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $member->resident_id,
                                            'related_to' => $spouse->resident_id,
                                            'relationship' => 'sibling',
                                        ]);

                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $spouse->resident_id,
                                            'related_to' => $member->resident_id,
                                            'relationship' => 'sibling',
                                        ]);

                                        // Link sibling-of-spouse ↔ spouse's parents (as parent/child)
                                        $spouseParents = $members->filter(fn($m) =>
                                            in_array(strtolower($m->relationship_to_head), ['parent', 'parent_in_law'])
                                        );

                                        foreach ($spouseParents as $parent) {
                                            FamilyRelation::firstOrCreate([
                                                'resident_id' => $member->resident_id,
                                                'related_to' => $parent->resident_id,
                                                'relationship' => 'child',
                                            ]);

                                            FamilyRelation::firstOrCreate([
                                                'resident_id' => $parent->resident_id,
                                                'related_to' => $member->resident_id,
                                                'relationship' => 'parent',
                                            ]);
                                        }
                                    }
                                    break;

                                case 'spouse-of-sibling-of-spouse':
                                case 'spouse-sibling':
                                    $partner = $members->first(fn($m) =>
                                        in_array(strtolower($m->relationship_to_head), ['sibling', 'sibling-of-spouse']) &&
                                        $m->sibling_group_key === $member->sibling_group_key
                                    );

                                    if ($partner) {
                                        // Link as spouse
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $member->resident_id,
                                            'related_to' => $partner->resident_id,
                                            'relationship' => 'spouse',
                                        ]);
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $partner->resident_id,
                                            'related_to' => $member->resident_id,
                                            'relationship' => 'spouse',
                                        ]);

                                        // Link to niblings sharing the same group key
                                        $niblings = $members->filter(fn($m) =>
                                            strtolower($m->relationship_to_head) === 'niblings' &&
                                            $m->sibling_group_key === $member->sibling_group_key
                                        );

                                        foreach ($niblings as $nibling) {
                                            FamilyRelation::firstOrCreate([
                                                'resident_id' => $member->resident_id,
                                                'related_to' => $nibling->resident_id,
                                                'relationship' => 'parent',
                                            ]);
                                            FamilyRelation::firstOrCreate([
                                                'resident_id' => $nibling->resident_id,
                                                'related_to' => $member->resident_id,
                                                'relationship' => 'child',
                                            ]);
                                        }
                                    }
                                    break;

                                case 'niblings':
                                    // Find parent who is a sibling or sibling-of-spouse sharing the same group key
                                    $parent = $members->first(fn($m) =>
                                        in_array(strtolower($m->relationship_to_head), ['sibling', 'sibling-of-spouse']) &&
                                        $m->sibling_group_key === $member->sibling_group_key
                                    );

                                    if ($parent) {
                                        // Link child ↔ parent
                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $residentId,
                                            'related_to' => $parent->resident_id,
                                            'relationship' => 'child',
                                        ]);

                                        FamilyRelation::firstOrCreate([
                                            'resident_id' => $parent->resident_id,
                                            'related_to' => $residentId,
                                            'relationship' => 'parent',
                                        ]);
                                    }
                                    break;
                                case 'spouse':
                                case 'self':
                                    // already handled earlier
                                    break;

                                default:
                                    // skip or log unknown relationships
                                    break;
                            }
                        }

                        // After looping through members
                        $children = $members->filter(function ($member) {
                            return strtolower($member->relationship_to_head) === 'child';
                        });

                        foreach ($children as $i => $childA) {
                            foreach ($children as $j => $childB) {
                                if ($i !== $j) {
                                    FamilyRelation::firstOrCreate([
                                        'resident_id' => $childA->resident_id,
                                        'related_to' => $childB->resident_id,
                                        'relationship' => 'sibling',
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
            dd($data);
            return redirect()->route('resident.index')->with('success', 'Residents Household created successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Residents Household could not be created: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Resident $resident)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resident $resident)
    {
        $resident->load([
            'votingInformation',
            'educationalHistories',
            'occupations',
            'medicalInformation',
            'disabilities',
            'livelihoods',
            'socialwelfareprofile',
            'vehicles',
            'seniorcitizen',
            'household',
            'family',
            'street',
            'street.purok',
            'barangay',
            'latestHouseholdResident' => function ($query) {
                $query->with(['resident' => function ($query) {
                    $query->select('id', 'firstname', 'middlename', 'lastname', 'suffix', 'is_household_head');
                }]);
            },
        ]);

        $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);

        $residentHousehold = Resident::where('barangay_id', $brgy_id)
            ->whereNotNull('household_id')
            ->where('is_household_head', true)
            ->with([
                'household' => function ($query) {
                    $query->select('id', 'purok_id', 'street_id', 'house_number');
                },
                'household.street' => function ($query) {
                    $query->select('id', 'street_name');
                },
                'household.purok' => function ($query) {
                    $query->select('id', 'purok_number');
                },
            ])
            ->get([
                'id',
                'household_id',
                'lastname',
                'firstname',
                'middlename',
                'suffix',
                'is_household_head'
            ]);
        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();
        $resident = new ResidentResource($resident);

        return Inertia::render("BarangayOfficer/Resident/Edit", [
            'puroks' => $puroks,
            'occupationTypes' => OccupationType::all()->pluck('name'),
            'streets' => $streets,
            'households' => $residentHousehold->toArray(),
            'barangays' => $barangays,
            'resident' => $resident,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateFamilyRelations($householdId)
    {
        // Load all household members with their relationship to head
        $members = HouseholdResident::where('household_id', $householdId)
            ->with('resident')
            ->get();

        // Get the resident ID of the head
        $head = $members->firstWhere('relationship_to_head', 'self');
        if (!$head) {
            return back()->withErrors(['error' => 'Household head is not defined (no member marked as self).']);
        }

        $headId = $head->resident_id;

        // Delete all existing relations involving these residents
        $residentIds = $members->pluck('resident_id')->toArray();
        FamilyRelation::whereIn('resident_id', $residentIds)
            ->orWhereIn('related_to', $residentIds)
            ->delete();

        // Get spouse
        $spouse = $members->firstWhere('relationship_to_head', 'spouse');

        // Create spouse ↔ head relation
        if ($spouse) {
            FamilyRelation::create([
                'resident_id' => $headId,
                'related_to' => $spouse->resident_id,
                'relationship' => 'spouse',
            ]);
            FamilyRelation::create([
                'resident_id' => $spouse->resident_id,
                'related_to' => $headId,
                'relationship' => 'spouse',
            ]);
        }

        // Loop through members and build relations
        foreach ($members as $member) {
            $residentId = $member->resident_id;
            $relationship = strtolower(trim($member->relationship_to_head));

            switch ($relationship) {
                case 'child':
                    // Link child → head
                    FamilyRelation::create([
                        'resident_id' => $residentId,
                        'related_to' => $headId,
                        'relationship' => 'child',
                    ]);
                    FamilyRelation::create([
                        'resident_id' => $headId,
                        'related_to' => $residentId,
                        'relationship' => 'parent',
                    ]);

                    // Link child ↔ spouse
                    if ($spouse) {
                        FamilyRelation::create([
                            'resident_id' => $residentId,
                            'related_to' => $spouse->resident_id,
                            'relationship' => 'child',
                        ]);
                        FamilyRelation::create([
                            'resident_id' => $spouse->resident_id,
                            'related_to' => $residentId,
                            'relationship' => 'parent',
                        ]);
                    }
                    break;

                case 'parent':
                    FamilyRelation::create([
                        'resident_id' => $residentId,
                        'related_to' => $headId,
                        'relationship' => 'parent',
                    ]);
                    FamilyRelation::create([
                        'resident_id' => $headId,
                        'related_to' => $residentId,
                        'relationship' => 'child',
                    ]);
                    break;

                case 'grandparent':
                    $parents = Resident::find($headId)?->parents ?? collect();
                    foreach ($parents as $parent) {
                        FamilyRelation::create([
                            'resident_id' => $residentId,
                            'related_to' => $parent->id,
                            'relationship' => 'parent',
                        ]);
                        FamilyRelation::create([
                            'resident_id' => $parent->id,
                            'related_to' => $residentId,
                            'relationship' => 'child',
                        ]);
                    }
                    break;

                case 'sibling':
                    $sharedParents = Resident::find($headId)?->parents ?? collect();
                    foreach ($sharedParents as $parent) {
                        FamilyRelation::create([
                            'resident_id' => $parent->id,
                            'related_to' => $residentId,
                            'relationship' => 'parent',
                        ]);
                        FamilyRelation::create([
                            'resident_id' => $residentId,
                            'related_to' => $parent->id,
                            'relationship' => 'child',
                        ]);
                    }
                    break;

                case 'parent_in_law':
                    if ($spouse) {
                        FamilyRelation::create([
                            'resident_id' => $residentId,
                            'related_to' => $spouse->resident_id,
                            'relationship' => 'parent',
                        ]);
                        FamilyRelation::create([
                            'resident_id' => $spouse->resident_id,
                            'related_to' => $residentId,
                            'relationship' => 'child',
                        ]);
                    }
                    break;

                case 'spouse':
                case 'self':
                    // Already handled
                    break;

                default:
                    // Ignore unhandled relationships
                    break;
            }
        }

        // Link all children as siblings to each other
        $children = $members->filter(fn($m) => strtolower($m->relationship_to_head) === 'child');
        foreach ($children as $i => $childA) {
            foreach ($children as $j => $childB) {
                if ($i !== $j) {
                    FamilyRelation::create([
                        'resident_id' => $childA->resident_id,
                        'related_to' => $childB->resident_id,
                        'relationship' => 'sibling',
                    ]);
                }
            }
        }

        return true;
    }

    public function update(UpdateResidentRequest $request, Resident $resident)
    {

        try {
            DB::beginTransaction();
            $data = $request->validated();
            //dd($data );
            $barangayId = Auth()->user()->barangay_id;
            /**
             * @var $image \Illuminate\Http\UploadedFile
             */
            // Handle image upload
            $image = $data['resident_image'] ?? null;
            if ($image) {
                $folder = 'resident/' . $data['lastname'] . $data['firstname'] . Str::random(10);
                $data['resident_image'] = $image->store($folder, 'public');
            } else {
                // Preserve existing image if not updated
                $data['resident_image'] = $resident->resident_picture_path;
            }

            $householdId = $data['housenumber'] ?? null;
            $familyId =  Family::where('household_id', $householdId)
                ->where('barangay_id', $barangayId)
                ->value('id');

            $residentInformation = [
                'resident_picture_path' => $data['resident_image'] ?? null,
                'barangay_id' => $barangayId,
                'firstname' => $data['firstname'],
                'middlename' => $data['middlename'],
                'lastname' => $data['lastname'],
                'maiden_name' => $data['maiden_name'] ?? null,
                'suffix' => $data['suffix'] ?? null,
                'sex' => $data['sex'],
                'gender' => $data['gender'],
                'birthdate' => $data['birthdate'],
                'birthplace' => $data['birthplace'],
                'civil_status' => $data['civil_status'],
                'citizenship' => $data['citizenship'],
                'employment_status' => $data['employment_status'],
                'religion' => $data['religion'],
                'contact_number' => $data['contactNumber'] ?? null,
                'registered_voter' => $data['registered_voter'],
                'email' => $data['email'] ?? null,
                'residency_date' => $data['residency_date'] ?? now(),
                'residency_type' => $data['residency_type'] ?? 'permanent',
                'purok_number' => $data['purok_number'],
                'street_id' => $data['street_id'] ?? null,
                'is_pwd' => $data['is_pwd'] ?? null,
                'ethnicity' => $data['ethnicity'] ?? null,
                'family_id' => $familyId,
                'household_id' =>  $householdId,
                'verfied' => $data['verified'] ?? 0,
            ];

            $residentSocialWelfareProfile = [
                'barangay_id' => $barangayId,
                'is_4ps_beneficiary' => $data['is_4ps_beneficiary'] ?? false,
                'is_solo_parent' => $data['is_solo_parent'] ?? false,
                'solo_parent_id_number' => $data['solo_parent_id_number'] ?? null,
            ];

            $residentVotingInformation = [
                'registered_barangay_id' => $data['registered_barangay'] ?? null,
                'voting_status' => $data['voting_status'] ?? null,
                'voter_id_number' => $data['voter_id_number'] ?? null,
            ];

            $residentMedicalInformation = [
                'weight_kg' => $data['weight_kg'] ?? 0,
                'height_cm' => $data['height_cm'] ?? 0,
                'bmi' => $data['bmi'] ?? 0,
                'nutrition_status' => $data['nutrition_status'] ?? null,
                'emergency_contact_number' => $data['emergency_contact_number'] ?? null,
                'emergency_contact_name' => $data['emergency_contact_name'] ?? null,
                'emergency_contact_relationship' => $data['emergency_contact_relationship'] ?? null,
                'is_smoker' => $data['is_smoker'] ?? 0,
                'is_alcohol_user' => $data['is_alcohol_user'] ?? 0,
                'blood_type' => $data['blood_type'] ?? null,
                'has_philhealth' => $data['has_philhealth'] ?? 0,
                'philhealth_id_number' => $data['philhealth_id_number'] ?? null,
                'pwd_id_number'  => $data['pwd_id_number'] ?? null,
            ];


            // === Update basic resident info ===
            $resident->update($residentInformation);


            // === Update Voting Information ===
            $resident->votingInformation()->updateOrCreate(
                ['resident_id' => $resident->id],
                $residentVotingInformation
            );


            // === Update Social Welfare Profile ===
            $resident->socialWelfareProfile()->updateOrCreate(
                ['resident_id' => $resident->id],
                $residentSocialWelfareProfile
            );


            // === Update Medical Information ===
            $resident->medicalInformation()->updateOrCreate(
                ['resident_id' => $resident->id], // attributes to match on
                $residentMedicalInformation      // values to update or insert
            );

            $resident->educationalHistories()->delete();
            // === Update Educational Histories ===
            if (!empty($data['educational_histories']) && is_array($data['educational_histories'])) {
                foreach ($data['educational_histories'] ?? [] as $educationalData) {
                    $resident->educationalHistories()->create([
                        'educational_attainment' => $educationalData['education'] ?? null,
                        'school_name' => $educationalData['school_name'] ?? null,
                        'school_type' => $educationalData['school_type'] ?? null,
                        'year_started' => $educationalData['year_started'] ?? null,
                        'year_ended' => $educationalData['year_ended'] ?? null,
                        'program' => $educationalData['program'] ?? null,
                        'education_status' => $educationalData['education_status'] ?? null,
                    ]);
                }
            }
            $resident->occupations()->delete();
            // === Update Occupations ===
            if (!empty($data['occupations']) && is_array($data['occupations'])) {
                $normalizedOccupations = [];
                foreach ($data['occupations'] as $occupationData) {
                    $income = $occupationData['income'] ?? 0;

                    // Normalize all income to monthly
                    $monthlyIncome = match ($occupationData['income_frequency']) {
                        'monthly' => $income,
                        'weekly' => $income * 4,
                        'bi-weekly' => $income * 2,
                        'daily' => $income * 22, // Assuming 22 working days per month
                        'annually' => $income / 12,
                        default => null,
                    };

                    $normalizedOccupations[] = [
                        'occupation' => $occupationData['occupation'] ?? null,
                        'employment_type' => $occupationData['employment_type'] ?? null,
                        'occupation_status' => $occupationData['occupation_status'] ?? null,
                        'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                        'employer' => $occupationData['employer'] ?? null,
                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                        'is_main_livelihood' => $occupationData['is_main_source'] ?? false,
                        'started_at' => $occupationData['started_at'],
                        'ended_at' => $occupationData['ended_at'] ?? null,
                        'monthly_income' => $monthlyIncome,
                    ];
                }

                // Insert all occupations
                $resident->occupations()->createMany($normalizedOccupations);

                // Recompute family's total and average monthly income
                $family = Family::with('members.occupations')->findOrFail($familyId);
                $totalIncome = $family->members->sum(function ($member) {
                    return $member->occupations
                        ->filter(fn($occupation) => is_null($occupation->ended_at) || $occupation->ended_at >= now())
                        ->sum('monthly_income') ?? 0;
                });

                // Determine bracket and category
                $incomeBracket = match (true) {
                    $totalIncome < 5000 => 'below_5000',
                    $totalIncome <= 10000 => '5001_10000',
                    $totalIncome <= 20000 => '10001_20000',
                    $totalIncome <= 40000 => '20001_40000',
                    $totalIncome <= 70000 => '40001_70000',
                    $totalIncome <= 120000 => '70001_120000',
                    default => 'above_120001',
                };

                $incomeCategory = match (true) {
                    $totalIncome <= 5000 => 'survival',
                    $totalIncome <= 10000 => 'poor',
                    $totalIncome <= 20000 => 'low_income',
                    $totalIncome <= 40000 => 'lower_middle_income',
                    $totalIncome <= 70000 => 'middle_income',
                    $totalIncome <= 120000 => 'upper_middle_income',
                    default => 'above_high_income',
                };

                // Update family in one go
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                ]);
            }

            $resident->disabilities()->delete();
            // === Update Disabilities ===
            if (isset($data['disabilities'])) {
                foreach ($data['disabilities'] ?? [] as $disability) {
                    $resident->disabilities()->create(attributes: [
                        'disability_type' => $disability['disability_type'] ?? null,
                    ]);
                }
            }

            $resident->vehicles()->delete();
            // === Update Vehicles ===
            if (isset($data['vehicles'])) {
                foreach ($data['vehicles'] ?? [] as $vehicle) {
                    $resident->vehicles()->create([
                        'vehicle_type' => $vehicle['vehicle_type'],
                        'vehicle_class' => $vehicle['vehicle_class'],
                        'usage_status' => $vehicle['usage_status'],
                        'is_registered' => $vehicle['is_registered'],
                    ]);
                }
            }

            if (calculateAge($resident->birthdate) >= 60) {
                $resident->seniorcitizen()->create([
                    'is_pensioner' => $data['is_pensioner'] ?? null,
                    'osca_id_number' => $data['osca_id_number'] ?? null,
                    'pension_type' => $data['pension_type'] ?? null,
                    'living_alone' => $data['living_alone'] ?? null,
                ]);
            }

            // === Update Household Relationship ===
            if ($householdId) {
                $resident->householdResidents()->updateOrCreate(
                    [
                        'resident_id' => $resident->id,      // Find by resident
                        'household_id' => $householdId,      // And household
                    ],
                    [
                        'relationship_to_head' => $data['relationship_to_head'] ?? null,
                        'household_position'   => $data['household_position'] ?? null,
                    ]
                );

                $this->updateFamilyRelations($resident->household_id);
            }

            DB::commit();

            return redirect()->route('resident.index')
                ->with('success', 'Resident ' . ucwords($resident->full_name) . ' updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Resident could not be updated: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resident $resident)
    {
        DB::beginTransaction();

        try {
            $householdResident = HouseholdResident::where('resident_id', $resident->id)->first();

            if ($householdResident && $householdResident->relationship_to_head === 'self') {
                // Get all members in the household
                $householdId = $householdResident->household_id;
                $members = HouseholdResident::where('household_id', $householdId)
                    ->where('resident_id', '!=', $resident->id)
                    ->get();

                if ($members->isNotEmpty()) {
                    // Assign a new head (first member)
                    $newHead = $members->firstWhere('relationship_to_head', 'spouse'); // 1. Spouse
                    if (!$newHead) {
                        $newHead = $members->where('relationship_to_head', 'child')
                            ->sortBy(function ($member) {
                                return optional($member->resident)->birthdate;
                            })
                            ->first(); // 2. Eldest child
                    }
                    if (!$newHead) {
                        $newHead = $members->firstWhere('relationship_to_head', 'grandparent'); // 3. Grandparent
                    }
                    if (!$newHead) {
                        $newHead = $members->first(); // 4. Any remaining member
                    }

                    if (!$newHead) {
                        return; // No one to assign
                    }

                    if ($newHead) {
                        $previousRole = $newHead->relationship_to_head;
                        $newHead->update(['relationship_to_head' => 'self']);
                        $newHead->resident->update(['is_household_head' => true]);
                        // Adjust relationships based on new head
                        foreach ($members as $member) {
                            if ($member->id === $newHead->id) {
                                continue; // skip the new head
                            }

                            switch ($previousRole) {
                                case 'child':
                                    if ($member->relationship_to_head === 'spouse') {
                                        $member->update(['relationship_to_head' => 'parent']);
                                    } elseif ($member->relationship_to_head === 'parent') {
                                        $member->update(['relationship_to_head' => 'grandparent']);
                                    }
                                    break;
                                case 'grandparent':
                                    if ($member->relationship_to_head === 'parent') {
                                        $member->update(['relationship_to_head' => 'child']);
                                    }
                                    break;

                                default:
                                    if ($member->relationship_to_head === 'self') {
                                        $member->update(['relationship_to_head' => 'other']);
                                    }
                                    break;
                            }
                        }
                    }
                }
            }

            // Delete resident
            $residentName = ucwords($resident->full_name);
            $resident->delete();

            DB::commit();
            return redirect()->route('resident.index')
                ->with('success', "Resident {$residentName} deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Resident could not be deleted: ' . $e->getMessage());
        }
    }

    public function getFamilyTree(Resident $resident)
    {
        $resident->load([
            'votingInformation',
            'educationalHistories',
            'occupations',
            'medicalInformation',
            'disabilities',
            'socialwelfareprofile',
            'vehicles',
            'seniorcitizen',
            'household',
            'family',
            'street',
            'street.purok',
            'barangay',
        ]);

        $familyTree = $resident->familyTree();

        // Eager-load relationships for all related residents
        collect($familyTree)->each(function ($value, $key) {
            if (is_a($value, Collection::class)) {
                $value->load([
                    'votingInformation',
                    'educationalHistories',
                    'occupations',
                    'medicalInformation',
                    'disabilities',
                    'socialwelfareprofile',
                    'vehicles',
                    'seniorcitizen',
                    'household',
                    'family',
                    'street',
                    'street.purok',
                    'barangay',

                ]);
            } elseif ($value instanceof Resident) {
                $value->load([
                    'votingInformation',
                    'educationalHistories',
                    'occupations',
                    'medicalInformation',
                    'disabilities',
                    'socialwelfareprofile',
                    'vehicles',
                    'seniorcitizen',
                    'household',
                    'family',
                    'street',
                    'street.purok',
                    'barangay',
                ]);
            }
        });

        return Inertia::render('BarangayOfficer/Resident/FamilyTree', [
            'family_tree' => [
                'self' => new ResidentResource($familyTree['self']),
                'parents' => ResidentResource::collection($familyTree['parents']),
                'grandparents' => ResidentResource::collection($familyTree['grandparents']),
                'uncles_aunts' => ResidentResource::collection($familyTree['uncles_aunts']),
                'siblings' => ResidentResource::collection($familyTree['siblings']),
                'children' => ResidentResource::collection($familyTree['children']),
                'spouse' => ResidentResource::collection($familyTree['spouse']),
            ],
        ]);
    }

    public function createResident()
    {
        $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);

        $residentHousehold = Resident::where('barangay_id', $brgy_id)
            ->whereNotNull('household_id')
            ->where('is_household_head', true)
            ->with([
                'household' => function ($query) {
                    $query->select('id', 'purok_id', 'street_id', 'house_number');
                },
                'household.street' => function ($query) {
                    $query->select('id', 'street_name');
                },
                'household.purok' => function ($query) {
                    $query->select('id', 'purok_number');
                },
            ])
            ->get([
                'id',
                'household_id',
                'lastname',
                'firstname',
                'middlename',
                'suffix',
                'is_household_head'
            ]);
        $barangays = Barangay::all()->pluck('barangay_name', 'id')->toArray();

        return Inertia::render("BarangayOfficer/Resident/CreateResident", [
            'puroks' => $puroks,
            'occupationTypes' => OccupationType::all()->pluck('name'),
            'streets' => $streets,
            'households' => $residentHousehold->toArray(),
            'barangays' => $barangays,
        ]);
    }

    public function showResident($id)
    {
        $resident = Resident::with(
            'educationalHistories',
            'occupations',
            'medicalInformation',
            'seniorcitizen',
            'socialwelfareprofile',
            'disabilities',
            'barangay',
            'street',
            'street.purok'
        )->findOrFail($id);
        return response()->json([
            'resident' => $resident,
        ]);
    }

    public function fetchResidents()
    {
        $barangayId = Auth()->user()->barangay_id;
        $residents = Resident::with([
            'votingInformation',
            'educationalHistories',
            'occupations',
            'medicalInformation',
            'disabilities',
            'livelihoods',
            'socialwelfareprofile',
            'vehicles',
            'seniorcitizen',
            'household',
            'family',
            'street',
            'street.purok',
            'barangay',
        ])->where('barangay_id', $barangayId)->get();

        return response()->json([
            'residents' => ResidentResource::collection($residents),
        ]);
    }

    // unoptimized
    // public function chartData()
    // {
    //     $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
    //     $query = Resident::query()
    //         ->with([
    //             'socialwelfareprofile',
    //             'occupations',
    //             'livelihoods',
    //         ])
    //         ->where('residents.barangay_id', $brgy_id);
    //     $query = $query->where('barangay_id', $brgy_id);

    //     // handles purok filtering
    //     if (request()->filled('purok') && request('purok') !== 'All') {
    //         $query->where('purok_number', request('purok'));
    //     }

    //     // handles gender filtering
    //     if (request()->filled('sex') && request('sex') !== 'All') {
    //         $query->where('sex', request('sex'));
    //     }
    //     if (request()->filled('gender') && request('gender') !== 'All') {
    //         $query->where('gender', request('gender'));
    //     }

    //     // handles employment filtering
    //     if (request()->filled('estatus') && request('estatus') !== 'All') {
    //         $query->where('employment_status', request('estatus'));
    //     }

    //     // handles civil status filtering
    //     if (request()->filled('cstatus') && request('cstatus') !== 'All') {
    //         $query->where('civil_status', request('cstatus'));
    //     }

    //     // handles age filtering
    //     if (request()->filled('age_group') && request('age_group') !== 'll') {
    //         $today = Carbon::today();

    //         switch (request('age_group')) {
    //             case '0_6_months':
    //                 $max = $today->copy()->subMonths(0); // today
    //                 $min = $today->copy()->subMonths(6);
    //                 break;

    //             case '7mos_2yrs':
    //                 $max = $today->copy()->subYears(0)->subMonths(7);
    //                 $min = $today->copy()->subYears(2);
    //                 break;

    //             case '3_5yrs':
    //                 $max = $today->copy()->subYears(3);
    //                 $min = $today->copy()->subYears(5);
    //                 break;

    //             case '6_12yrs':
    //                 $max = $today->copy()->subYears(6);
    //                 $min = $today->copy()->subYears(12);
    //                 break;

    //             case '13_17yrs':
    //                 $max = $today->copy()->subYears(13);
    //                 $min = $today->copy()->subYears(17);
    //                 break;

    //             case '18_59yrs':
    //                 $max = $today->copy()->subYears(18);
    //                 $min = $today->copy()->subYears(59);
    //                 break;

    //             case '60_above':
    //                 $max = $today->copy()->subYears(60);
    //                 $min = null; // no lower bound
    //                 break;
    //         }

    //         if ($min) {
    //             $query->whereBetween('birthdate', [$min, $max]);
    //         } else {
    //             $query->where('birthdate', '<=', $max);
    //         }
    //     }

    //     // handles voter status filtering
    //     if (request()->filled('voter_status') && request('voter_status') !== 'All') {
    //         $query->where('registered_voter', request('voter_status'));
    //     }

    //     if (
    //         request('indigent') === '1' ||
    //         request('fourps') === '1' ||
    //         request('solo_parent') === '1' ||
    //         request('pwd') === '1'
    //     ) {
    //         $query->whereHas('socialwelfareprofile', function ($q) {
    //             if (request('indigent') === '1') {
    //                 $q->where('is_indigent', 1);
    //             }
    //             if (request('fourps') === '1') {
    //                 $q->where('is_4ps_beneficiary', 1);
    //             }
    //             if (request('solo_parent') === '1') {
    //                 $q->where('is_solo_parent', 1);
    //             }
    //             if (request('pwd') === '1') {
    //                 $q->where('is_pwd', 1);
    //             }
    //         });
    //     }

    //     $residents = $query->get(); // full list

    //     $transform = function ($resident) {
    //         return [
    //             'id' => $resident->id,
    //             'gender' => $resident->gender,
    //             'purok_number' => $resident->purok_number,
    //             'birthdate' => $resident->birthdate,
    //             'age' => $resident->age,
    //             'civil_status' => $resident->civil_status,
    //             'citizenship' => $resident->citizenship,
    //             'religion' => $resident->religion,
    //             'is_pwd' => $resident->is_pwd,
    //             'registered_voter' => $resident->registered_voter,
    //             'employment_status' => $resident->employment_status,
    //             'isIndigent' => optional($resident->socialwelfareprofile)->is_indigent,
    //             'isSoloParent' => optional($resident->socialwelfareprofile)->is_solo_parent,
    //             'is4ps' => optional($resident->socialwelfareprofile)->is_4ps_beneficiary,
    //             'occupation' => optional(
    //                 $resident->occupations->sortByDesc('started_at')->first()
    //             )?->occupation,
    //         ];
    //     };


    //     $residents = $residents->map($transform);

    //     //dd($residents->toArray());
    //     return response()->json([
    //         'residents' => $residents,
    //     ]);
    // }


    // optimized
    public function chartData()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = Resident::query()
            ->with([
                'socialwelfareprofile', // keep full relation
                'occupations' => function ($q) {
                    $q->latest('started_at'); // fetch latest first
                },
                'livelihoods', // keep full relation
            ])
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false);

        // ✅ filters
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }
        if (request()->filled('sex') && request('sex') !== 'All') {
            $query->where('sex', request('sex'));
        }
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->where('gender', request('gender'));
        }
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }
        if (request()->filled('cstatus') && request('cstatus') !== 'All') {
            $query->where('civil_status', request('cstatus'));
        }

        // ✅ age filter
        if (request()->filled('age_group') && request('age_group') !== 'All') {
            $today = Carbon::today();

            switch (request('age_group')) {
                case '0_6_months':
                    $max = $today;
                    $min = $today->copy()->subMonths(6);
                    break;
                case '7mos_2yrs':
                    $max = $today->copy()->subMonths(7);
                    $min = $today->copy()->subYears(2);
                    break;
                case '3_5yrs':
                    $max = $today->copy()->subYears(3);
                    $min = $today->copy()->subYears(5);
                    break;
                case '6_12yrs':
                    $max = $today->copy()->subYears(6);
                    $min = $today->copy()->subYears(12);
                    break;
                case '13_17yrs':
                    $max = $today->copy()->subYears(13);
                    $min = $today->copy()->subYears(17);
                    break;
                case '18_59yrs':
                    $max = $today->copy()->subYears(18);
                    $min = $today->copy()->subYears(59);
                    break;
                case '60_above':
                    $max = $today->copy()->subYears(60);
                    $min = null;
                    break;
            }

            if ($min) {
                $query->whereBetween('birthdate', [$min, $max]);
            } else {
                $query->where('birthdate', '<=', $max);
            }
        }

        // ✅ voter filter
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

        // ✅ welfare filter
        if (
            request('indigent') === '1' ||
            request('fourps') === '1' ||
            request('solo_parent') === '1' ||
            request('pwd') === '1'
        ) {
            $query->whereHas('socialwelfareprofile', function ($q) {
                if (request('indigent') === '1') {
                    $q->where('is_indigent', 1);
                }
                if (request('fourps') === '1') {
                    $q->where('is_4ps_beneficiary', 1);
                }
                if (request('solo_parent') === '1') {
                    $q->where('is_solo_parent', 1);
                }
                if (request('pwd') === '1') {
                    $q->where('is_pwd', 1);
                }
            });
        }

        $residents = $query->get();

        $residents = $residents->map(function ($resident) {
            return [
                'id' => $resident->id,
                'gender' => $resident->gender,
                'purok_number' => $resident->purok_number,
                'birthdate' => $resident->birthdate,
                'age' => $resident->age,
                'civil_status' => $resident->civil_status,
                'citizenship' => $resident->citizenship,
                'religion' => $resident->religion,
                'is_pwd' => $resident->is_pwd,
                'registered_voter' => $resident->registered_voter,
                'employment_status' => $resident->employment_status,
                'isIndigent' => $resident->socialwelfareprofile?->is_indigent,
                'isSoloParent' => $resident->socialwelfareprofile?->is_solo_parent,
                'is4ps' => $resident->socialwelfareprofile?->is_4ps_beneficiary,
                'occupation' => $resident->occupations->first()?->occupation, // already ordered by latest
                'livelihoods' => $resident->livelihoods, // keep full data
            ];
        });

        return response()->json([
            'residents' => $residents,
        ]);
    }
}

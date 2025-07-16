<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResidentHouseholdRequest;
use App\Http\Resources\ResidentResource;
use App\Models\Barangay;
use App\Models\Family;
use App\Models\FamilyRelation;
use App\Models\Household;
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
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        $query = Resident::query()
            ->with([
                'socialwelfareprofile',
                'occupations',
                'livelihoods',
            ])
            ->where('residents.barangay_id', $brgy_id);
        // $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->get();
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $query = $query->where('barangay_id', $brgy_id);

        if (request('name')) {
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

        // handles purok filtering
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        // handles gender filtering
        if (request()->filled('sex') && request('sex') !== 'All') {
            $query->where('gender', request('sex'));
        }

        // handles employment filtering
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }

        // handles civil status filtering
        if (request()->filled('cstatus') && request('cstatus') !== 'All') {
            $query->where('civil_status', request('cstatus'));
        }

        // handles age filtering
        if (request()->filled('age_group') && request('age_group') !== 'All') {
            $today = Carbon::today();

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

        // handles voter status filtering
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

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


        if (request('all') === 'true') {
            $residents = $query->get(); // full list
        } else {
            $residents = $query->paginate(10)->onEachSide(1);
        }

        $transform = function ($resident) {
            return [
                'id' => $resident->id,
                'resident_picture' => $resident->resident_picture_path,
                'firstname' => $resident->firstname,
                'middlename' => $resident->middlename,
                'lastname' => $resident->lastname,
                'suffix' => $resident->suffix,
                'gender' => $resident->gender,
                'purok_number' => $resident->purok_number,
                'birthdate' => $resident->birthdate,
                'age' => $resident->age,
                'civil_status' => $resident->civil_status,
                'citizenship' => $resident->citizenship,
                'religion' => $resident->religion,
                'contact_number' => $resident->contact_number,
                'is_pwd' => $resident->is_pwd,
                'email' => $resident->email,
                'registered_voter' => $resident->registered_voter,
                'employment_status' => $resident->employment_status,
                'isIndigent' => optional($resident->socialwelfareprofile)->is_indigent,
                'isSoloParent' => optional($resident->socialwelfareprofile)->is_solo_parent,
                'is4ps' => optional($resident->socialwelfareprofile)->is_4ps_beneficiary,
                'occupation' => optional(
                    $resident->occupations->sortByDesc('started_at')->first()
                )?->occupation,
            ];
        };

        if (request('all') === 'true') {
            $residents = $residents->map($transform);
        } else {
            $residents->getCollection()->transform($transform);
        }
        //dd($residents->toArray());
        return Inertia::render('BarangayOfficer/Resident/Index', [
            'residents' => $residents,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks,
            'success' => session('success') ?? null,
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

        $barangayId = Auth()->user()->resident->barangay_id; // get brgy id through the admin
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


        $latestOccupation = collect($data['occupations'] ?? [])
            ->filter(fn($occ) => isset($occ['started_at']))
            ->sortByDesc('started_at')
            ->first();

        $latestStatus = $latestOccupation['employment_status'] ?? 'unemployed';

        $latestEducation = collect($data['educational_histories'] ?? [])
            ->filter(fn($edu) => ($edu['education_status'] ?? '') === 'enrolled' && isset($edu['year_started']))
            ->sortByDesc('year_started') // or 'year_ended' if you want latest completed
            ->first();
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
            'gender' => $data['gender'],
            'birthdate' => $data['birthdate'],
            'birthplace' => $data['birthplace'],
            'civil_status' => $data['civil_status'],
            'citizenship' => $data['citizenship'],
            'employment_status' => $latestEducation ? "student" : $latestStatus,
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
            'is_family_head' => $data['is_family_head'] ?? 0,
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

        try {
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
                foreach ($data['occupations'] ?? [] as $occupationData) {

                    if ($occupationData['income_frequency'] === 'monthly') {
                        $occupationData['income'] = $occupationData['income'] ?? 0;
                    } elseif ($occupationData['income_frequency'] === 'weekly') {
                        $occupationData['income'] = ($occupationData['income'] ?? 0) * 4;
                    } elseif ($occupationData['income_frequency'] === 'annually') {
                        $occupationData['income'] = ($occupationData['income'] ?? 0) / 12;
                    } else {
                        $occupationData['income'] = $occupationData['income'] ?? null;
                    }

                    $resident->occupations()->create([
                        'occupation' => $occupationData['occupation'] ?? null,
                        'employment_type' => $occupationData['employment_type'] ?? null,
                        'occupation_status' => $occupationData['occupation_status'] ?? null,
                        'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                        'employer' => $occupationData['employer'] ?? null,
                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                        'started_at' => $occupationData['started_at'],
                        'ended_at' => $occupationData['ended_at'] ?? null,
                        'monthly_income' => $occupationData['income'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    $family = Family::with(['members.occupations'])->findOrFail($familyId);
                    // Sum total monthly income from all members' occupations
                    $totalIncome = $family->members->flatMap(function ($member) {
                        return $member->occupations;
                    })->sum('monthly_income');

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

                    $family->update([
                        'income_bracket' => $incomeBracket,
                        'income_category' => $incomeCategory,
                    ]);
                }
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
                'created_at' => now(),
                'updated_at' => now()
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
                        'quantity' => $vehicle['quantity'],
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
            return redirect()->route('resident.index')->with('success', 'Resident ' . ucwords($resident->getFullNameAttribute()) . ' created successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Resident could not be created: ' . $e->getMessage()]);
        }
    }

    public function storeHousehold(StoreResidentHouseholdRequest $request)
    {
        $barangayId = Auth()->user()->resident->barangay_id;
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

        try {
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

                $family = Family::create([
                    'barangay_id' => $barangayId,
                    'household_id' => $household->id,
                    'income_bracket' =>  $data['income_bracket'] ?? null,
                    'income_category' =>  $data['income_category'] ?? null,
                    'family_name' =>  $data['family_name'] ?? null,
                    'family_type' =>  $data['family_type'] ?? null,
                ]);

                $members = collect($data['members'] ?? [])
                    ->sortByDesc(fn($member) => $member['is_household_head'] ?? false)
                    ->values();

                // resident information
                foreach ($members as $member) {
                    $empStatus = null;
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

                    $residentInformation = [
                        'resident_picture_path' => $member['resident_image'] ?? null,
                        'barangay_id' => $barangayId,
                        'firstname' => $member['firstname'],
                        'middlename' => $member['middlename'],
                        'lastname' => $member['lastname'],
                        'maiden_name' => $member['maiden_name'] ?? null,
                        'suffix' => $member['suffix'] ?? null,
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
                        'is_household_head' => $member['is_household_head'] ?? false,
                        'family_id' => $family->id,
                        'is_family_head' => $member['is_family_head'] ?? false,
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
                        foreach ($member['occupations'] ?? [] as $occupationData) {
                            $resident->occupations()->create([
                                'occupation' => $occupationData['occupation'] ?? null,
                                'employment_type' => $occupationData['employment_type'] ?? null,
                                'occupation_status' => $occupationData['occupation_status'] ?? null,
                                'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                                'employer' => $occupationData['employer'] ?? null,
                                'is_ofw' => $occupationData['is_ofw'] ?? false,
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
                        'created_at' => now(),
                        'updated_at' => now()
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
                                'quantity' => $vehicle['quantity'],
                            ]);
                        }
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
            return redirect()->route('resident.index')->with('success', 'Residents Household created successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Residents Household could not be created: ' . $e->getMessage()]);
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
            'socialwelfareprofile',
            'vehicles',
            'seniorcitizen',
            'household',
            'family',
        ]);

        dd($resident);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResidentRequest $request, Resident $resident)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resident $resident)
    {
        //
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
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
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
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Barangay;
use App\Models\Family;
use App\Models\FamilyRelation;
use App\Models\Household;
use App\Models\OccupationType;
use App\Models\Purok;
use App\Models\Request;
use App\Models\Resident;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;

use App\Models\Street;

use Str;
use Inertia\Inertia;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id; // get brgy id through the admin
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
            $today = \Carbon\Carbon::today();

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
        return Inertia::render("BarangayOfficer/Resident/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResidentRequest $request)
    {

        $barangayId = Auth()->user()->barangay_id; // get brgy id through the admin
        $data = $request->validated();
        /**
         * @var $image \Illuminate\Http\UploadedFile
         */
        // dd($data);
        $image = $data['resident_image'] ?? null;
        if ($image) {
            $folder = 'resident/' . $data['lastname'] . $data['firstname'] . Str::random(10);
            $data['resident_image'] = $image->store($folder, 'public');
        }

        $latestOccupation = collect($data['occupations'] ?? [])
            ->sortByDesc('started_at')
            ->first();
        $latestStatus = $latestOccupation['employment_status'] ?? 'unemployed';
        $isStudent = (int) ($data['is_student'] ?? 0);
        $hasOccupation = !empty($data['occupations']);

        $householdId = $data['housenumber'] ?? null;
        $familyId = $householdId
            ? Family::where('household_id', $householdId)
                ->where('barangay_id', $barangayId)
                ->value('id')
            : null;

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
            'employment_status' =>
                $isStudent && $latestStatus === 'unemployed'
                    ? 'student'
                    : (!$isStudent || ($isStudent && $hasOccupation)
                        ? $latestStatus
                        : 'student'),
            'religion' => $data['religion'],
            'contact_number' => $data['contactNumber'] ?? null,
            'registered_voter' => $data['registered_voter'],
            'is_household_head' => $data['is_household_head'] ?? false,
            'household_id' => $householdId,
            'ethnicity' => $data['ethnicity'] ?? null,
            'email' => $data['email'] ?? null,
            'residency_date' => $data['residency_date'] ?? now(),
            'residency_type' => $data['residency_type'] ?? 'permanent',
            'purok_number' => $data['purok_number'],
            'street_id' => $data['street_id'] ?? null,
            'is_pwd' => $data['is_pwd'] ?? null,
            'family_id' => $familyId,
            'is_family_head' => $data['is_family_head'] ?? false,
        ];


        $residentVotingInformation = [
            'registered_barangay_id' => $data['registered_barangay'] ?? null,
            'voting_status' => $data['voting_status'] ?? null,
            'voter_id_number' => $data['voter_id_number'] ?? null,
        ];


        $residentSocialWelfareProfile = [
            'barangay_id' => $barangayId,
            'is_indigent' => $data['is_indigent'] ?? null,
            'is_4ps_beneficiary' => $data['is_4ps_beneficiary'] ?? false,
            'is_solo_parent' => $data['is_solo_parent'] ?? false,
            'solo_parent_id_number' => $data['solo_parent_id_number'] ?? null,
            'orphan_status' => $data['orphan_status'] ?? false,
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
                    if($educationalData['education_status'] === 'graduate'){
                        $yearGraduated = $educationalData['year_ended'];
                    }
                    $resident->educationalHistories()->create([
                        'educational_attainment' => $educationalData['education'] ?? null,
                        'school_name' => $educationalData['school_name'] ?? null,
                        'school_type' => $educationalData['school_type'] ?? null,
                        'year_started' => $educationalData['year_started'] ?? null,
                        'year_ended' => $educationalData['year_ended'] ?? null,
                        'program' => $educationalData['program'] ?? null,
                        'year_graduated' => $yearGraduated ?? null,
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
                        'job_sector' => $occupationData['job_sector'] ?? null,
                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                        'started_at' => $occupationData['started_at'],
                        'ended_at' => $occupationData['ended_at'] ?? null,
                        'monthly_income' => $occupationData['income'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now()
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
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }


            // add social welfare profile
            $resident->socialwelfareprofile()->create($residentSocialWelfareProfile);

            if ($householdId) {
                $resident->householdResidents()->create($householdResident);
                // Only process if not household head and has a declared relationship

                if (!empty($data['relationship_to_head'])) {
                    $head = Resident::where('household_id', $householdId)
                    ->where('is_household_head', true)
                    ->first();

                if ($head) {
                    $relationship = $data['relationship_to_head'];

                    // 🔸 Grandparent case (only if household position is not nuclear)
                    if ($relationship === 'grandparent') {
                        $position = strtolower($data['household_position'] ?? '');
                        if ($position === 'nuclear') {
                            return back()->withErrors(['error' => 'Grandparents cannot be added to a nuclear household.']);
                        }

                        $headParents = $head->parents()->get();
                        $matches = $headParents->filter(function ($parent) use ($resident) {
                            return (
                                strtolower($parent->firstname) === strtolower($resident->firstname) &&
                                strtolower($parent->middlename) === strtolower($resident->middlename) &&
                                strtolower($parent->lastname) === strtolower($resident->lastname)
                            );
                        });

                        if ($matches->isNotEmpty()) {
                            foreach ($matches as $matchedParent) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $resident->id,
                                    'related_to' => $matchedParent->id,
                                    'relationship' => 'parent',
                                ]);

                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $matchedParent->id,
                                    'related_to' => $resident->id,
                                    'relationship' => 'child',
                                ]);
                            }
                        } else {
                            return back()->withErrors(['error' => 'No parent of the household head matches the grandparent\'s name.']);
                        }
                    }

                    // 🔸 Sibling of the head (link to head's parents)
                    elseif ($relationship === 'sibling') {
                        $headParents = $head->parents()->get();

                        if ($headParents->isEmpty()) {
                            return back()->withErrors(['error' => 'Cannot add sibling: household head has no registered parents.']);
                        }

                        foreach ($headParents as $parent) {
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $parent->id,
                                'related_to' => $resident->id,
                                'relationship' => 'parent',
                            ]);

                            FamilyRelation::firstOrCreate([
                                'resident_id' => $resident->id,
                                'related_to' => $parent->id,
                                'relationship' => 'child',
                            ]);
                        }
                    }

                    // 🔸 Child → attach to head and all spouses
                    elseif ($relationship === 'child') {
                        $spouses = $head->spouses()->get();
                        $relatedAdults = collect([$head])->merge($spouses);

                        foreach ($relatedAdults as $adult) {
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $adult->id,
                                'related_to' => $resident->id,
                                'relationship' => 'parent',
                            ]);

                            FamilyRelation::firstOrCreate([
                                'resident_id' => $resident->id,
                                'related_to' => $adult->id,
                                'relationship' => 'child',
                            ]);
                        }
                    }

                    // 🔸 Parent → attach this resident as parent of the head
                    elseif ($relationship === 'parent') {
                        FamilyRelation::firstOrCreate([
                            'resident_id' => $resident->id,
                            'related_to' => $head->id,
                            'relationship' => 'parent',
                        ]);

                        FamilyRelation::firstOrCreate([
                            'resident_id' => $head->id,
                            'related_to' => $resident->id,
                            'relationship' => 'child',
                        ]);
                    }

                    // 🔸 Spouse
                    elseif ($relationship === 'spouse') {
                        FamilyRelation::firstOrCreate([
                            'resident_id' => $resident->id,
                            'related_to' => $head->id,
                            'relationship' => 'spouse',
                        ]);

                        FamilyRelation::firstOrCreate([
                            'resident_id' => $head->id,
                            'related_to' => $resident->id,
                            'relationship' => 'spouse',
                        ]);
                    }
                }
                }
            }

            return redirect()->route('resident.index')->with('success', 'Resident '. ucwords($resident->getFullNameAttribute()) .' created successfully!');

        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Resident could not be created: ' . $e->getMessage()]);
        }
    }

    public function storeHousehold(Request $request)
    {
        return response()->json($request->all());
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
        //
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
        $familyTree = $resident->familyTree();
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
        // $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->get();
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->get(['id', 'street_name']);

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

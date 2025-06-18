<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\OccupationType;
use App\Models\Purok;
use App\Models\Resident;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
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
                'occupations.occupationType',
                'livelihoods.livelihoodType',
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
            $residents = $query->paginate(15)->onEachSide(1);
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
                    $resident->occupations->sortByDesc('started_at')->first()?->occupationType
                )->name,
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
        $image = $data['resident_image'] ?? null;
        if ($image) {
            $folder = 'resident/' . $data['lastname'] . $data['firstname'] . Str::random(10);
            $data['resident_image'] = $image->store($folder, 'public');
        }

        $latestOccupation = collect($data['occupations'] ?? [])
            ->sortByDesc('started_at')
            ->first();

        $latestEmploymentStatus = $latestOccupation['employment_status'] ?? null;

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
            'employment_status' => $latestEmploymentStatus ?? 'unemployed',
            'religion' => $data['religion'],
            'contact_number' => $data['contactNumber'] ?? null,
            'registered_voter' => $data['registered_voter'],
            'ethnicity' => $data['ethnicity'] ?? null,
            'email' => $data['email'] ?? null,
            'residency_date' => $data['residency_date'] ?? now(),
            'residency_type' => $data['residency_type'] ?? 'permanent',
            'purok_number' => $data['purok_number'],
            'street_id' => $data['street_id'] ?? null,
        ];

        $residentEducation = [];
        if($data['is_student']) {
            $residentEducation = [
                'enrolled_now' => $data['is_student'] ?? false,
                'school_name' => $data['school_name'] ?? null,
                'school_type' => $data['school_type'] ?? null,
                'current_level' => $data['current_level'] ?? null,
                'education_status' =>  null,
                'osc' =>  null,
                'osy' => null,
                'year_started' => null,
                'year_ended' =>  null,
                'year_graduated' =>  null,
                'program' => null,
            ];
        } else {
            $residentEducation = [
                'enrolled_now' => $data['is_student'] ?? false,
                'school_name' => $data['school_name'] ?? null,
                'school_type' => $data['school_type'] ?? null,
                'current_level' => $data['current_level'] ?? null,
                'education_status' => $data['education_status'] ?? null,
                'osc' => $data['osc'] ?? null,
                'osy' => $data['osy'] ?? null,
                'year_started' => $data['year_started'] ?? null,
                'year_ended' => $data['year_ended'] ?? null,
                'year_graduated' => $data['year_graduated'] ?? null,
                'program' => $data['program'] ?? null,
            ];
        }


        try {
            $resident = Resident::create($residentInformation);
            $residentEducation['resident_id'] = $resident->id;

            // add educational history
            $resident->educationalHistories()->create($residentEducation);

            //add occupations
            if (!empty($data['occupations']) && is_array($data['occupations'])) {
                foreach ($data['occupations'] ?? [] as $occupationData) {

                    if($occupationData['income_frequency'] === 'monthly') {
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
                    ]);
                }
            }
            return redirect()->route('resident.index')->with('success', 'Resident '. ucwords($resident->getFullNameAttribute()) .' created successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Resident could not be created: ' . $e->getMessage()]);
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

    public function getFamilyTree(Resident $resident){
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

    public function createResident(){
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        // $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->get();
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');
        return Inertia::render("BarangayOfficer/Resident/CreateResident", [
            'puroks' => $puroks,
            'occupationTypes' => OccupationType::all()->pluck('name'),
        ]);
    }
}

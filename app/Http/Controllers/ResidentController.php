<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Purok;
use App\Models\Resident;
use App\Http\Requests\StoreResidentRequest;
use App\Http\Requests\UpdateResidentRequest;
use Inertia\Inertia;

class ResidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Resident::query();
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
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


        $residents = $query->paginate(15)->onEachSide(1);
        $residents->getCollection()->transform(function ($resident) {
        return [
            'id' => $resident->id,
            'firstname' => $resident->firstname,
            'middlename' => $resident->middlename,
            'lastname' => $resident->lastname,
            'suffix' => $resident->suffix,
            'gender' => $resident->gender,
            'purok_number' => $resident->purok_number,
            'birthdate' => $resident->birthdate,
            'age' => $resident->age,
            'civil_status' => $resident->civil_status,
            'residency_date' => $resident->residency_date,
            'employment_status' => $resident->employment_status,
        ];
    });

        return Inertia::render('BarangayOfficer/Resident/Index', [
            'residents' => $residents,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks
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
        //
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
}

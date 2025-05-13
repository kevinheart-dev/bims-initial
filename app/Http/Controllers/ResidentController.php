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
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->get();

        $query = $query->where('barangay_id', $brgy_id);

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('firstname', 'like', '%' . request('name') . '%')
                    ->orWhere('lastname', 'like', '%' . request('name') . '%')
                    ->orWhere('middlename', 'like', '%' . request('name') . '%')
                    ->orWhere('suffix', 'like', '%' . request('name') . '%')
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ['%' . request('name') . '%']);
            });
        }

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_id', request('purok'));
        }

        $residents = $query->paginate(15)->onEachSide(1);

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

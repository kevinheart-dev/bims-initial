<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Family;
use App\Http\Requests\StoreFamilyRequest;
use App\Http\Requests\UpdateFamilyRequest;
use App\Models\Purok;
use App\Models\Resident;
use Inertia\Inertia;

class FamilyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgyId = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        $query = Family::with([
            'latestHead.householdResidents.household'
        ])->with([
            'latestHead.street.purok'
        ])->where('barangay_id', $brgyId)->withCount('members');

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('family_name', 'like', '%' . request('name') . '%')
                    ->orWhereHas('members.householdResidents.household', function ($sub) {
                        $sub->where('house_number', 'like', '%' . request('name') . '%');
                    });
            });
        }
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('members.householdResidents.household.purok', function ($q) {
                $q->where('purok_number', request('purok'));
            });
        }
        if (request()->filled('famtype') && request('famtype') !== 'All') {
            $query->where('family_type', request('famtype'));
        }
        if (request()->filled('income_bracket') && request('income_bracket') !== 'All') {
            $query->where('income_bracket', request('income_bracket'));
        }
        if (request()->filled('household_head') && request('household_head') !== 'All') {
            $query->whereHas('members', function ($q) {
                $q->where('is_household_head', request('household_head'));
            });
        }

        $families = $query->get();

        $families->each(function ($resident) use ($brgyId) {
            $resident->family_member_count = $resident->family?->members
                ->where('barangay_id', $brgyId)
                ->count() ?? 0;
        });
        $puroks = Purok::where('barangay_id', $brgyId)->orderBy('purok_number', 'asc')->pluck('purok_number');
        return Inertia::render("BarangayOfficer/Family/Index", [
            'families' => $families,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd('ers');
        $brgy_id = Auth()->user()->resident->barangay_id; // get brgy id through the admin
        return Inertia::render("BarangayOfficer/Family/AddFamily");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFamilyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Family $family)
    {
        //
    }

    public function showFamily(Family $family)
    {
        $family_details = $family->load('household','members');
        $household_details = $family->household;

        $query = $family->members()->with('householdResidents');

        // Search by name
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

        // Filter by gender
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->where('gender', request('gender'));
        }

        // Filter by age group
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

        // Filter by employment status
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }

        // Filter by voter status
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

        // Filter by PWD
        if (request()->filled('is_pwd') && request('is_pwd') !== 'All') {
            $query->where('is_pwd', request('is_pwd'));
        }

        // Filter by relation to head (from householdResidents relation)
        if (request()->filled('relation') && request('relation') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('relationship_to_head', request('relation'));
            });
        }

        // Filter by household position
        if (request()->filled('household_position') && request('household_position') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('household_position', request('household_position'));
            });
        }

        $members = $query->get();

        return Inertia::render("BarangayOfficer/Family/ShowFamily", [
            'members' => $members,
            'family_details' => $family_details,
            'household_details' => $household_details,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Family $family)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFamilyRequest $request, Family $family)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Family $family)
    {
        //
    }
}

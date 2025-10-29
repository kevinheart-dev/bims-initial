<?php

namespace App\Http\Controllers;

use App\Models\BarangayInstitution;
use App\Http\Requests\StoreBarangayInstitutionRequest;
use App\Http\Requests\UpdateBarangayInstitutionRequest;
use App\Models\BarangayInstitutionMember;
use App\Models\Purok;
use App\Models\Resident;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangayInstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Base query
        $query = BarangayInstitution::query()
            ->where('barangay_id', $brgy_id)
            ->with(['head.resident:id,firstname,lastname,middlename,suffix']) // eager load head and its resident
            ->distinct();

        // Optional filters
        if (request()->filled('institution') && request('institution') !== 'All') {
            $query->where('name', request('institution'));
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . request('name') . '%');
            });
        }

        // Paginate and keep query string
        $institutions = $query->paginate(10)->withQueryString();

        // Distinct dropdown filters
        $institutionsnames = BarangayInstitution::where('barangay_id', $brgy_id)
            ->select('id', 'name')
            ->distinct()
            ->get();

        // Return Inertia page
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayInstitution/InstitutionIndex', [
            'institutions' => $institutions,
            'institutionNames' => $institutionsnames,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBarangayInstitutionRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $data = $request->validated();
        try {
            if (!empty($data['institutions']) && is_array($data['institutions'])) {
                foreach ($data['institutions'] as $insti) {
                    BarangayInstitution::create([
                        'barangay_id'        => $brgy_id,
                        'name'               => $insti['name'],
                        'type'               => $insti['type'],
                        'year_established'   => $insti['year_established'],
                        'status'             => $insti['status'],
                        'description'        => $insti['description'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_institution.index')
                ->with('success', 'Institution created successfully!');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Institution(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayInstitution $barangayInstitution)
    {
        $brgy_id = Auth()->user()->barangay_id;
        // Load all members for this institution with their resident info
        $members = $barangayInstitution->members()->with('resident:id,firstname,lastname,middlename,suffix,sex,gender,birthdate,purok_number,contact_number')->get();

        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        $residents = Resident::where('barangay_id', $brgy_id)
            ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate')
            ->get();

        return Inertia::render(
            "BarangayOfficer/BarangayProfile/BarangayInstitution/Members",
            [
                'institution' => $barangayInstitution,
                'members' => $members,
                'puroks' => $puroks,
                'residents' => $residents,
                'queryParams' => request()->query() ?: null,
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayInstitutionRequest $request, BarangayInstitution $barangayInstitution)
    {
        $data = $request->validated();
        try {
            if (!empty($data['institutions']) && is_array($data['institutions'])) {
                foreach ($data['institutions'] as $insti) {
                    $barangayInstitution->update([
                        'name'             => $insti['name'],
                        'type'             => $insti['type'],
                        'year_established' => $insti['year_established'],
                        'status'           => $insti['status'],
                        'description'      => $insti['description'],
                    ]);
                }
            }

            return redirect()
                ->route('barangay_institution.index')
                ->with('success', 'Institution updated successfully!');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Institution could not be updated: ' . $e->getMessage()
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayInstitution $barangayInstitution)
    {
        DB::beginTransaction();
        try {
            $barangayInstitution->delete();
            DB::commit();
            return redirect()
                ->route('barangay_institution.index')
                ->with('success', 'Institution deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Institution could not be deleted: ' . $e->getMessage());
        }
    }

    public function institutionDetails($id){
        $institution = BarangayInstitution::findOrFail($id);
        return response()->json([
            'institution' => $institution,
        ]);
    }

}

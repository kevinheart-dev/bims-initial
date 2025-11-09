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
            ->with(['head.resident:id,firstname,lastname,middlename,suffix,contact_number']) // eager load head and its resident
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

        $brgy_id = auth()->user()->barangay_id;

        $query = $barangayInstitution->members()
            ->with('resident:id,firstname,lastname,middlename,suffix,sex,gender,birthdate,purok_number,contact_number');

        // Filter by Purok
        if ($purok = request()->query('purok')) {
            if ($purok !== 'All') {
                $query->whereHas('resident', fn($q) => $q->where('purok_number', $purok));
            }
        }

        // Filter by Sex
        if ($sex = request()->query('sex')) {
            if ($sex !== 'All') {
                $query->whereHas('resident', fn($q) => $q->where('sex', $sex));
            }
        }

        // Filter by Age Group
        if ($age_group = request()->query('age_group')) {
            $today = now();
            $query->whereHas('resident', function($q) use ($age_group, $today) {
                switch ($age_group) {
                    case '0_6_months':
                        $q->whereBetween('birthdate', [$today->copy()->subMonths(6), $today]);
                        break;
                    case '7mos_2yrs':
                        $q->whereBetween('birthdate', [$today->copy()->subYears(2), $today->copy()->subMonths(7)]);
                        break;
                    case '3_5yrs':
                        $q->whereBetween('birthdate', [$today->copy()->subYears(5), $today->copy()->subYears(3)]);
                        break;
                    case '6_12yrs':
                        $q->whereBetween('birthdate', [$today->copy()->subYears(12), $today->copy()->subYears(6)]);
                        break;
                    case '13_17yrs':
                        $q->whereBetween('birthdate', [$today->copy()->subYears(17), $today->copy()->subYears(13)]);
                        break;
                    case '18_59yrs':
                        $q->whereBetween('birthdate', [$today->copy()->subYears(59), $today->copy()->subYears(18)]);
                        break;
                    case '60_above':
                        $q->where('birthdate', '<=', $today->copy()->subYears(60));
                        break;
                }
            });
        }

        if ($pwd = request()->query('pwd')) {
            if ($pwd === '1') {
                $query->whereHas('resident', fn($q) => $q->where('is_pwd', true));
            }
        }

        if ($fourps = request()->query('fourps')) {
            if ($fourps === '1') {
                $query->whereHas('resident.socialwelfareprofile', fn($q) => $q->where('is_4ps_beneficiary', true));
            }
        }

        if ($soloParent = request()->query('solo_parent')) {
            if ($soloParent === '1') {
                $query->whereHas('resident.socialwelfareprofile', fn($q) => $q->where('is_solo_parent', true));
            }
        }

        $members = $query->get();

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

<?php

namespace App\Http\Controllers;

use App\Models\BlotterReport;
use App\Models\Resident;
use App\Models\Summon;
use App\Http\Requests\StoreSummonRequest;
use App\Http\Requests\UpdateSummonRequest;
use Inertia\Inertia;

class SummonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;
        $query = Summon::with([
            'blotter:id,type_of_incident,incident_date',
            'blotter.participants:id,blotter_id,resident_id,role_type,name',
            'blotter.participants.resident:id,firstname,middlename,lastname,suffix',

            'issuedBy:id,resident_id,position',
            'issuedBy.resident:id,firstname,middlename,lastname,suffix',

            'latestTake' => fn($q) => $q->select(
                'summon_takes.id',
                'summon_takes.summon_id',
                'summon_takes.session_number',
                'summon_takes.hearing_date',
                'summon_takes.session_status',
                'summon_takes.session_remarks'
            ),
        ])
        ->select('id', 'blotter_id', 'status', 'remarks', 'issued_by')
        ->whereHas('blotter', fn($q) => $q->where('barangay_id', $brgy_id));

        // 🔎 Filter: Summon status (on_going, closed)
        if (request()->filled('summon_status') && request('summon_status') !== 'All') {
            $query->where('status', request('summon_status'));
        }

        // 🔎 Filter: Hearing number (1, 2, 3)
        if (request()->filled('hearing_number') && request('hearing_number') !== 'All') {
            $query->whereHas('latestTake', function ($q) {
                $q->where('session_number', request('hearing_number'));
            });
        }

        if (request()->filled('hearing_status') && request('hearing_status') !== 'All') {
            $query->whereHas('latestTake', function ($q) {
                $q->where('session_status', request('hearing_status'));
            });
        }

        // 🔎 Filter: Incident type
        if (request()->filled('incident_type') && request('incident_type') !== 'All') {
            $query->whereHas('blotter', function ($q) {
                $q->where('type_of_incident', request('incident_type'));
            });
        }

        // 🔎 Filter: Incident date
        if (request()->filled('incident_date')) {
            $query->whereHas('blotter', function ($q) {
                $q->whereDate('incident_date', request('incident_date'));
            });
        }

        // 🔎 Filter: Participant name (resident or manual input)
        if (request()->filled('name')) {
            $search = request('name');
            $query->whereHas('blotter.participants', function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', IFNULL(suffix, '')) LIKE ?",
                        ["%{$search}%"]
                    )
                    ->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$search}%"]
                    );
                })
                ->orWhere('name', 'like', "%{$search}%"); // non-resident participant
            });
        }

        $summons = $query->latest()->paginate(10)->withQueryString();

        $incident_types = BlotterReport::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('type_of_incident');

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Summon/Index", [
            'summons'        => $summons,
            'queryParams'    => request()->query() ?: null,
            'incident_types' => $incident_types,
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
    public function store(StoreSummonRequest $request)
    {
        dd($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Summon $summon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Summon $summon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSummonRequest $request, Summon $summon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Summon $summon)
    {
        //
    }

    public function elevate($id)
    {
        $brgy_id = auth()->user()->barangay_id;

        // Fetch blotter report with complainants, recorder, and summons with their takes
        $blotter_details = BlotterReport::with([
            'participants.resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,purok_number,contact_number,email',
            'recordedBy.resident:id,firstname,lastname,middlename,suffix',
            'summons.takes'
        ])
        ->where('id', $id)
        ->firstOrFail();

        // Get residents of the same barangay for participant selection
        $residents = Resident::where('barangay_id', $brgy_id)
            ->select(
                'id', 'firstname', 'lastname', 'middlename', 'suffix',
                'resident_picture_path', 'gender', 'birthdate',
                'purok_number', 'contact_number', 'email'
            )
            ->get();

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Summon/Elevate", [
            'residents' => $residents,
            'blotter_details' => $blotter_details
        ]);
    }

}

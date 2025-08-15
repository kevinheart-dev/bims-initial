<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Http\Requests\StoreBarangayOfficialRequest;
use App\Http\Requests\UpdateBarangayOfficialRequest;
use App\Models\BarangayOfficialTerm;
use App\Models\Designation;
use App\Models\Purok;
use App\Models\Resident;
use DB;
use Inertia\Inertia;

class BarangayOfficialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $officials = BarangayOfficial::with([
            'resident.barangay',
            'resident.street.purok',
            'term',
            'activeDesignations',
            'activeDesignations.purok'
        ])
        ->whereHas('resident', fn($q) => $q->where('barangay_id', $brgy_id))
        ->get();

        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate', 'email', 'contact_number')->get();

        $puroks = Purok::where('barangay_id', operator: $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');


        $activeterms = BarangayOfficialTerm::query()->where('barangay_id', $brgy_id)->where("status", 'active')->get();
        //dd($officials);
        return Inertia::render("BarangayOfficer/BarangayInfo/BarangayOfficials", [
            'officials' => $officials,
            'residents' => $residents,
            'puroks' => $puroks,
            'activeterms' => $activeterms
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
    public function store(StoreBarangayOfficialRequest $request)
    {
        try {

            $data = $request->validated();
            DB::beginTransaction();


            // Store Barangay Official
            $official = BarangayOfficial::create([
                'resident_id'       => $data['resident_id'],
                'term_id'           => $data['term'],
                'position'          => $data['position'],
                'contact_number'    => $data['contact_number'],
                'email'             => $data['email'],
                'status'            => $data['status'] ?? 'active',
                'appointment_type'  => $data['appointment_type'],
                'appointed_by'      => $data['appointed_by'],
                'appointment_reason'=> $data['appointment_reason'],
                'remarks'           => $data['remarks'],
            ]);

            // Store designation(s) only for kagawad positions
            if (in_array($data['position'], ['barangay_kagawad', 'sk_kagawad']) && !empty($data['designation'])) {
                foreach ($data['designation'] as $purokId) {
                    Designation::create([
                        'official_id' => $official->id,
                        'purok_id'    => $purokId,
                        'started_at'  => now()->year,
                        'ended_at'    => null,
                    ]);
                }
            }

            DB::commit();

            return back()->with('success', 'Barangay Official successfully added.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Barangay Official could not be added: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayOfficialRequest $request, BarangayOfficial $barangayOfficial)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial)
    {
        //
    }
}

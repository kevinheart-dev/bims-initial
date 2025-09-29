<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Http\Requests\StoreBarangayOfficialRequest;
use App\Http\Requests\UpdateBarangayOfficialRequest;
use App\Models\BarangayOfficialTerm;
use App\Models\Designation;
use App\Models\Purok;
use App\Models\Resident;
use Carbon\Carbon;
use DB;
use Inertia\Inertia;
use Str;

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
        return response()->json([
            'officials'   => $officials,
            'residents'   => $residents,
            'puroks'      => $puroks,
            'activeterms' => $activeterms,
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
            //dd($request->all());
            $data = $request->validated();
            DB::beginTransaction();
            //dd($data);
            // Store Barangay Official
            $official = BarangayOfficial::create([
                'resident_id'       => $data['resident_id'],
                'term_id'           => $data['term'],
                'position'          => $data['position'],
                'status'            => $data['status'] ?? 'active',
                'appointment_type'  => $data['appointment_type']  ?? null,
                'appointted_by'      => $data['appointted_by'] ?? null,
                'appointment_reason'=> $data['appointment_reason']  ?? null,
                'remarks'           => $data['remarks']  ?? null,
            ]);

            // Store designation(s) only for kagawad positions
            if (in_array($data['position'], ['barangay_kagawad', 'sk_kagawad']) && !empty($data['designations'])) {
                foreach ($data['designations'] as $designation) {
                    $purok_id = Purok::where('barangay_id', auth()->user()->resident->barangay_id)
                        ->where('purok_number', $designation['designation'])
                        ->value('id'); // get the actual ID

                    if ($purok_id) { // only create if a valid Purok exists
                        Designation::create([
                            'official_id' => $official->id,
                            'purok_id'    => $purok_id,
                            'started_at'  => $designation['term_start'] ?? now()->year,
                            'ended_at'    => $designation['term_end'] ?? null,
                        ]);
                    }
                }
            }
            DB::commit();
            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Barangay Official successfully added.',
                    'activeTab' => 'officials'
                ]);
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
        try {
            $data = $request->validated();
            //dd($data);
            // If appointment type is not "appointed", remove the appointed_by and appointment_reason
            if ($data['appointment_type'] !== 'appointed') {
                $data['appointed_by'] = null;
                $data['appointment_reason'] = null;
            }

            // Update Barangay Official
            $barangayOfficial->update([
                'resident_id'        => $data['resident_id'],
                'position'           => $data['position'],
                'appointment_type'   => $data['appointment_type'],
                'appointed_by'       => $data['appointed_by'] ?? null,
                'appointment_reason' => $data['appointment_reason'] ?? null,
                'term'            => $data['term'] ?? null,
                'remarks'            => $data['remarks'] ?? null,
            ]);

            if (!empty($data['designations'])) {
                // Remove existing designations
                $barangayOfficial->designation()->delete();

                // Add new ones
                foreach ($data['designations'] as $des) {
                    $barangayOfficial->designation()->create([
                        'purok_id'   => $des['designation'],
                        'started_at' => $des['term_start'], // just the year
                        'ended_at'   => $des['term_end'],   // just the year
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Barangay Official successfully updated.',
                    'activeTab' => 'officials'
                ]);

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update Barangay Official: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial)
    {
        //
    }

    public function getOfficialInformation($id)
    {
        $official = BarangayOfficial::with([
            'resident.barangay',
            'resident.street.purok',
            'designation.purok',
            'term'
        ])->findOrFail($id);

        $official->designation->transform(function ($d) {
            return [
                'id' => $d->id,
                'purok_id' => $d->purok_id,
                'purok_number' => $d->purok->purok_number ?? null, // easier for display
                'started_at' => $d->started_at,
                'ended_at' => $d->ended_at,
            ];
        });

        return response()->json(['official' => $official]);
    }
}

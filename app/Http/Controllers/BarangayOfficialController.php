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

        // Fetch officials with relationships
        $officials = BarangayOfficial::with([
            'resident.barangay',
            'resident.street.purok',
            'term',
            'activeDesignations',
            'activeDesignations.purok'
        ])
        ->whereHas('resident', fn($q) => $q->where('barangay_id', $brgy_id))
        ->get();

        $priorityOrder = [
            'barangay_captain',
            'barangay_secretary',
            'barangay_treasurer',
            'barangay_kagawad',
            'sk_chairman',
            'sk_kagawad',
            'health_worker',
            'tanod',
        ];

        $officials = $officials->sortBy(function($official) use ($priorityOrder) {
            return array_search($official->position, $priorityOrder);
        })->values();

        // Residents dropdown or selection
        $residents = Resident::where('barangay_id', $brgy_id)
            ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate', 'email', 'contact_number')
            ->get();

        // Purok numbers for filtering
        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        // Active official terms
        $activeterms = BarangayOfficialTerm::query()
            ->where('barangay_id', $brgy_id)
            ->where('status', 'active')
            ->get();

        // Return Inertia page
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayOfficials/BarangayOfficials', [
            'officials'   => $officials,
            'residents'   => $residents,
            'puroks'      => $puroks,
            'activeterms' => $activeterms,
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
                ->route('barangay_official.index')
                ->with('success','Barangay Official successfully added.');
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

            // Clear appointed fields if not appointed
            if ($data['appointment_type'] !== 'appointed') {
                $data['appointed_by'] = null;
                $data['appointment_reason'] = null;
            }

            // Update official
            $barangayOfficial->update([
                'resident_id'        => $data['resident_id'],
                'position'           => $data['position'],
                'appointment_type'   => $data['appointment_type'],
                'appointed_by'       => $data['appointed_by'] ?? null,
                'appointment_reason' => $data['appointment_reason'] ?? null,
                'term_id'            => $data['term'] ?? null,
                'remarks'            => $data['remarks'] ?? null,
            ]);

            // Update designations if provided
            if (!empty($data['designations'])) {
                $barangayOfficial->designation()->delete();

                foreach ($data['designations'] as $des) {
                    $barangayOfficial->designation()->create([
                        'purok_id'   => $des['designation'],
                        'started_at' => $des['term_start'],
                        'ended_at'   => $des['term_end'],
                    ]);
                }
            }

            return redirect()
                ->route('barangay_official.index')
                ->with('success','Barangay Official successfully updated.');

        } catch (\Exception $e) {
            return back()->with('error','Failed to update Barangay Official: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial)
    {
        DB::beginTransaction();

        try {
            // Delete related designations first
            $barangayOfficial->designation()->delete();

            // Delete the barangay official record
            $barangayOfficial->delete();

            DB::commit();

            return redirect()
                ->route('barangay_official.index')
                ->with('success', 'Barangay Official deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                'Failed to delete Barangay Official: ' . $e->getMessage()
            );
        }
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

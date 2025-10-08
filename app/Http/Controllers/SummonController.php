<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Models\BlotterReport;
use App\Models\CaseParticipant;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Resident;
use App\Models\Summon;
use App\Http\Requests\StoreSummonRequest;
use App\Http\Requests\UpdateSummonRequest;
use App\Models\SummonTake;
use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;

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
    public function store(StoreSummonRequest $request)
    {
        //dd($request->all());
        DB::beginTransaction();

        try {
            $data = $request->validated();
            //dd($data);

            // 🔎 Find the related blotter
            $blotter = BlotterReport::findOrFail($data['blotter_id']);

            // 1️⃣ Update Blotter fields
            $blotter->update([
                'actions_taken'   => $data['actions_taken'] ?? $blotter->actions_taken,
                'recommendations' => $data['recommendations'] ?? $blotter->recommendations,
                'report_status'   => $data['report_status'] ?? $blotter->report_status,
            ]);

            // 2️⃣ Create or Update Summon
            $summon = Summon::updateOrCreate(
                ['blotter_id' => $blotter->id], // unique constraint
                [
                    'issued_by' => BarangayOfficial::where('resident_id', auth()->user()->resident_id)->value('id'),
                    'status'    => $data['summon_status'],
                    'remarks'   => $data['summon_remarks'] ?? null,
                ]
            );


            // 3️⃣ Save Participants (sync with updateOrCreate)
            $saveParticipants = function (array $participants, string $role) use ($blotter) {
                foreach ($participants as $p) {
                    // Skip if both resident_id and resident_name are missing
                    if (empty($p['resident_id']) && empty($p['resident_name'])) {
                        continue;
                    }

                    CaseParticipant::updateOrCreate(
                        [
                            'blotter_id'  => $blotter->id,
                            'resident_id' => $p['resident_id'] ?? null,
                            'role_type'   => $role,
                        ],
                        [
                            'name'  => $p['resident_name'] ?? null, // ✅ adjusted
                            'notes' => $p['notes'] ?? null,
                        ]
                    );
                }
            };

            $saveParticipants($data['complainants'] ?? [], 'complainant');
            $saveParticipants($data['respondents'] ?? [], 'respondent');
            $saveParticipants($data['witnesses'] ?? [], 'witness');

            // 4️⃣ Existing summon sessions (update or create)

            if (!empty($data['summons'])) {
                foreach ($data['summons'] as $s) {
                    if (!empty($s['takes'])) {
                        foreach ($s['takes'] as $take) {
                            SummonTake::updateOrCreate(
                                [
                                    'summon_id'      => $summon->id,
                                    'session_number' => $take['session_number'],
                                ],
                                [
                                    'hearing_date'   => $take['hearing_date'] ?? null,
                                    'session_status' => $take['session_status'] ?? null,
                                    'session_remarks'=> $take['session_remarks'] ?? null,
                                ]
                            );
                        }
                    }
                }
            }

            // 5️⃣ New summon session
            if (!empty($data['newSession']['session_number'])) {
                $newsessoin = SummonTake::updateOrCreate(
                    [
                        'summon_id'      => $summon->id,
                        'session_number' => $data['newSession']['session_number'],
                    ],
                    [
                        'hearing_date'   => $data['newSession']['hearing_date'] ?? null,
                        'session_status' => $data['newSession']['session_status'] ?? null,
                        'session_remarks'=> $data['newSession']['session_remarks'] ?? null,
                    ]
                );
            }

            DB::commit();

            return redirect()
                ->route('summon.index')
                ->with('success', 'Summon saved successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            \Log::error("Summon Store Failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to save summon. Please try again.' .  $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $blotter_details = BlotterReport::with([
            'participants.resident:id,firstname,lastname,middlename,suffix,resident_picture_path,gender,birthdate,purok_number,contact_number,email',
            'recordedBy.resident:id,firstname,lastname,middlename,suffix',
            'summons.takes'
        ])
        ->where('id', $id)
        ->firstOrFail();

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Summon/Show", [
            'blotter_details' => $blotter_details
        ]);
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
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $summon = Summon::findOrFail($id);
            $summon->delete();

            DB::commit();

            return redirect()
                ->route('summon.index') // ✅ adjust if needed
                ->with('success', 'Summon and its related records deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Summon could not be deleted: ' . $e->getMessage());
        }
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

    public function generateForm($id)
    {
        $user       = auth()->user()->resident;
        $barangayId = $user->barangay_id;

        try {
            // Load blotter report with participants
            $blotter = BlotterReport::with([
                'complainants.resident',
                'respondents.resident',
                'recordedBy.resident'
            ])->findOrFail($id);

            // Load summon template (KP Form 9)
            $template = Document::where('barangay_id', $barangayId)
                ->where('specific_purpose', 'summon')
                ->latest()
                ->first();

            // Template not found
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Summon template not found.'
                ], 404);
            }

            $templatePath = storage_path('app/public/' . $template->file_path);

            // Template file missing in storage
            if (!file_exists($templatePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template file missing in storage.'
                ], 404);
            }

            $templateProcessor = new TemplateProcessor($templatePath);

            // Prepare replacement values
            $officer = BarangayOfficial::where('resident_id', $user->id)->first();
            $barangayCaptain = BarangayOfficial::where('position', 'Captain')
                ->whereHas('resident', fn($q) => $q->where('barangay_id', $barangayId))
                ->first()?->resident?->full_name ?? $officer?->resident?->full_name ?? '';

            $values = collect([
                'type_of_incident'  => $blotter->type_of_incident ?? '',
                'complainants'      => $blotter->complainants
                                        ->map(fn($p) => $p->resident?->full_name ?? $p->name)
                                        ->join(", "),
                'respondents'       => $blotter->respondents
                                        ->map(fn($p) => $p->resident?->full_name ?? $p->name)
                                        ->join(", "),
                'narrative_details' => $blotter->narrative_details ?? '',
                'recommendation'    => $blotter->recommendations ?? '',
                'day'                => now()->format('d'),
                'month'              => now()->translatedFormat('F'),
                'year'               => now()->format('Y'),
                'time'               => now()->format('h:i A'),
                'barangay_captain'   => $barangayCaptain,
            ]);

            // Fill template placeholders
            foreach ($templateProcessor->getVariables() as $placeholder) {
                $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
            }

            // File paths
            $baseName     = "kp_form9_{$blotter->id}";
            $docxFilename = "{$baseName}.docx";
            $barangaySlug = \Str::slug($user->barangay->barangay_name);
            $docxRelative = "kp_forms/{$barangaySlug}/docx/{$docxFilename}";
            $docxPath     = storage_path("app/public/{$docxRelative}");

            \Storage::disk('public')->makeDirectory(dirname($docxRelative));
            $templateProcessor->saveAs($docxPath);

            if (!file_exists($docxPath) || filesize($docxPath) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Generated DOCX is empty or invalid.'
                ], 500);
            }

            // Return file for download
            return response()->download($docxPath, $docxFilename);

        } catch (\Throwable $e) {
            \Log::error('KP Form generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate KP Form: ' . $e->getMessage()
            ], 500);
        }
    }

}

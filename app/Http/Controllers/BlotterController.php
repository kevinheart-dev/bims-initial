<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Models\BlotterReport;
use App\Http\Requests\StoreBlotterReportRequest;
use App\Http\Requests\UpdateBlotterReportRequest;
use App\Models\CaseParticipant;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Resident;
use Carbon\Carbon;
use DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;

class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = BlotterReport::with([
                'complainants.resident:id,firstname,lastname,middlename,suffix',
                'recordedBy.resident:id,firstname,lastname,middlename,suffix'
            ])
            ->where('barangay_id', $brgy_id)
            ->latest();

        // Filter by participant name
        if (request()->filled('name')) {
            $search = request('name');
            $query->whereHas('participants', function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?",
                        ["%{$search}%"]
                    )
                    ->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$search}%"]
                    );
                })
                ->orWhere('name', 'like', "%{$search}%"); // matches participants added manually
            });
        }

        // Filter by incident_type
        if (request()->filled('incident_type') && request('incident_type') !== 'All') {
            $query->where('type_of_incident', request('incident_type'));
        }

        // Filter by report_type
        if (request()->filled('report_type') && request('report_type') !== 'All') {
            $query->where('report_type', request('report_type'));
        }

        // Filter by incident_date
        if (request()->filled('incident_date')) {
            $query->whereDate('incident_date', request('incident_date'));
        }

        // Paginate the results
        $blotters = $query->paginate(10)->withQueryString();

        // Get distinct incident types for the filter dropdown
        $incident_types = BlotterReport::where('barangay_id', $brgy_id)
                            ->distinct()
                            ->pluck('type_of_incident');

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Index", [
            'blotters'       => $blotters,
            'queryParams'    => request()->query() ?: null,
            'incident_types' => $incident_types,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brgy_id = auth()->user()->barangay_id;
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'sex', 'birthdate', 'purok_number', 'contact_number', 'email')->get();
        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Create", [
            'residents' => $residents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreBlotterReportRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            // Get the BarangayOfficial ID of the logged-in officer
            $recordedByOfficialId = BarangayOfficial::where('resident_id', auth()->user()->resident_id)
                ->value('id');
            // 1️⃣ Create BlotterReport
            $blotter = BlotterReport::create([
                'barangay_id'       => auth()->user()->barangay_id,
                'type_of_incident'  => $data['type_of_incident'],
                'incident_date'     => $data['incident_date'],
                'location'          => $data['location'] ?? null,
                'narrative_details' => $data['narrative_details'] ?? null,
                'actions_taken'     => $data['actions_taken'] ?? null,
                'report_status'     => $data['report_status'] ?? 'pending',
                'resolution'        => $data['resolution'] ?? null,
                'recommendations'   => $data['recommendations'] ?? null,
                'recorded_by'       => $recordedByOfficialId,
            ]);

            // 2️⃣ Save Participants
            $saveParticipants = function (array $participants, string $role) use ($blotter) {
                foreach ($participants as $p) {
                    if (empty($p['resident_id']) && empty($p['resident_name']) && empty($p['name'])) {
                        continue; // skip invalid entry
                    }

                    CaseParticipant::create([
                        'blotter_id'  => $blotter->id,
                        'resident_id' => $p['resident_id'] ?? null,
                        'name'        => $p['resident_name'] ?? $p['name'] ?? null,
                        'role_type'   => $role,
                        'notes'       => $p['notes'] ?? null,
                    ]);
                }
            };

            $saveParticipants($data['complainants'] ?? [], 'complainant');
            $saveParticipants($data['respondents'] ?? [], 'respondent');
            $saveParticipants($data['witnesses'] ?? [], 'witness');

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report created successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            // Log the full error for debugging
            \Log::error("Blotter Report Store Failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to save blotter report. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    protected function prepareForValidation()
    {
        if ($this->incident_date) {
            try {
                // Convert from "01/10/2025 12:10:10 PM" → "2025-01-10 12:10:10"
                $formatted = Carbon::createFromFormat('m/d/Y h:i:s A', $this->incident_date)
                    ->format('Y-m-d H:i:s');

                $this->merge([
                    'incident_date' => $formatted,
                ]);
            } catch (\Exception $e) {
                // Leave it unchanged → validation will catch invalid format
            }
        }
    }
    public function show(BlotterReport $blotterReport)
    {
        $brgy_id = auth()->user()->barangay_id;

        // Ensure it's scoped to the authenticated user's barangay
        $report = BlotterReport::with([
                'complainants.resident:id,firstname,lastname,middlename,suffix',
                'respondents.resident:id,firstname,lastname,middlename,suffix',
                'witnesses.resident:id,firstname,lastname,middlename,suffix',
                'recordedBy.resident:id,firstname,lastname,middlename,suffix',
            ])
            ->where('barangay_id', $brgy_id)
            ->findOrFail($blotterReport->id);

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Show", [
            'blotter_details' => $report,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlotterReport $blotterReport)
    {
        $brgy_id = auth()->user()->barangay_id;
        $blotterReport->load([
            'participants.resident:id,firstname,lastname,middlename,suffix,resident_picture_path,sex,birthdate,purok_number,contact_number,email'
        ]);
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'sex', 'birthdate', 'purok_number', 'contact_number', 'email')->get();
        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Edit", [
            'residents' => $residents,
            'blotter_details' => $blotterReport
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlotterReportRequest $request, BlotterReport $blotterReport)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            // Get the BarangayOfficial ID for the currently authenticated user
            $recordedByOfficialId = BarangayOfficial::where('resident_id', auth()->user()->resident_id)
                ->value('id');

            // 1️⃣ Update the BlotterReport
            $blotterReport->update([
                'type_of_incident'  => $data['type_of_incident'],
                'incident_date'     => $data['incident_date'],
                'location'          => $data['location'] ?? null,
                'narrative_details' => $data['narrative_details'] ?? null,
                'actions_taken'     => $data['actions_taken'] ?? null,
                'report_status'     => $data['report_status'] ?? 'pending',
                'resolution'        => $data['resolution'] ?? null,
                'recommendations'   => $data['recommendations'] ?? null,
                'recorded_by'       => $recordedByOfficialId,
            ]);

            // 2️⃣ Remove old participants (to avoid duplicates)
            $blotterReport->participants()->delete();

            // 3️⃣ Helper closure to store participants
            $storeParticipants = function (array $participants, string $role) use ($blotterReport) {
                foreach ($participants as $p) {
                    if (empty($p['resident_id']) && empty($p['resident_name'])) {
                        continue; // skip empty participant
                    }

                    CaseParticipant::create([
                        'blotter_id'  => $blotterReport->id,
                        'resident_id' => $p['resident_id'] ?? null,
                        'name'        => $p['resident_name'] ?? $p['name'] ?? null,
                        'role_type'   => $role,
                        'notes'       => $p['notes'] ?? null,
                    ]);
                }
            };

            // 4️⃣ Re-store all participant types
            $storeParticipants($data['complainants'] ?? [], 'complainant');
            $storeParticipants($data['respondents'] ?? [], 'respondent');
            $storeParticipants($data['witnesses'] ?? [], 'witness');

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update blotter report: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlotterReport $blotterReport)
    {
        DB::beginTransaction();

        try {
            // Delete related participants
            $blotterReport->participants()->delete();

            // // Delete related attachments (if applicable)
            // if ($blotterReport->attachments && $blotterReport->attachments->count() > 0) {
            //     foreach ($blotterReport->attachments as $attachment) {
            //         // Optional: delete file from storage if stored locally
            //         if ($attachment->file_path && \Storage::exists($attachment->file_path)) {
            //             \Storage::delete($attachment->file_path);
            //         }
            //         $attachment->delete();
            //     }
            // }

            // Delete the blotter itself
            $blotterReport->delete();

            DB::commit();

            return redirect()
                ->route('blotter_report.index')
                ->with('success', 'Blotter report deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Blotter report could not be deleted: ' . $e->getMessage());
        }
    }

    public function generateForm($id)
    {

        $barangay     = Auth()->user()->barangay;

        $barangayId   = $barangay->id;
        $barangayName = $barangay->barangay_name;
        $userResidentId = auth()->user()->resident_id;

        $officer = null;

        if ($userResidentId) {
            $officer = BarangayOfficial::where('resident_id', $userResidentId)->first();
        }

        DB::beginTransaction();

        try {
            // Load blotter report with participants
            $blotter = BlotterReport::with([
                'complainants.resident',
                'respondents.resident',
                'witnesses.resident',
                'recordedBy.resident'
            ])->findOrFail($id);


            // Load the latest 'blotter' template
            $template = Document::where('barangay_id', $barangayId)
                ->where('specific_purpose', 'blotter')
                ->latest()
                ->first();

            // Template not found
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Blotter template not found.'
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

            // Prepare placeholder values
            $values = collect([
                'type_of_incident'           => $blotter->type_of_incident ?? '',
                'inclusive_date_of_incident' => $blotter->incident_date
                    ? Carbon::parse($blotter->incident_date)->format('F j, Y h:i A') // e.g., September 29, 2025 07:45 AM
                    : '',

                // Combine respondents and witnesses with distinction
                'respondents_witnesses'      => trim(
                    "\nRespondents: " . $blotter->respondents->map(fn($p) => $p->resident?->full_name ?? $p->name)->join(", ") . "\n" .
                    "Witnesses: "   . $blotter->witnesses->map(fn($p) => $p->resident?->full_name ?? $p->name)->join(", ")
                ),

                'narrative_details'          => $blotter->narrative_details ?? '',
                'actions_taken'              => $blotter->actions_taken ?? '',
                'recommendation'             => $blotter->recommendations ?? '',

                // Complainants / reported by
                'complainants'               => $blotter->complainants->map(fn($p) => $p->resident?->full_name ?? $p->name)->join(", "),

                'date_recieved'              => $blotter->created_at?->format('Y-m-d') ?? '',
                // REVIEWED BY (the official who recorded it)
                'reviewed_by' => $blotter->recordedBy->resident->full_name ?? str_repeat("\u{00A0}", 30),
            ]);

            // Fill placeholders dynamically
            foreach ($templateProcessor->getVariables() as $placeholder) {
                $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
            }

            // Generate file names and temp paths
            $baseName    = "blotter_report_{$blotter->id}";
            $docxFilename = "{$baseName}.docx";

            $tempDir = sys_get_temp_dir();
            $tempDocx = $tempDir . DIRECTORY_SEPARATOR . $docxFilename;

            // Save DOCX
            $templateProcessor->saveAs($tempDocx);

            if (!file_exists($tempDocx) || filesize($tempDocx) === 0) {
                throw new \Exception('Generated DOCX is empty or invalid.');
            }

            // Save files to public storage
            $barangaySlug = Str::slug($barangayName);
            $docxRelative = "blotter_forms/{$barangaySlug}/docx/{$docxFilename}";

            \Storage::disk('public')->makeDirectory(dirname($docxRelative));

            \Storage::disk('public')->putFileAs(dirname($docxRelative), new \Illuminate\Http\File($tempDocx), basename($docxRelative));

            // Record issuance in Certificate table
            Certificate::create([
                'resident_id'    => $blotter->recordedBy->resident->id,
                'document_id'    => $template->id,
                'barangay_id'    => $barangayId,
                'request_status' => 'issued',
                'purpose'        => 'blotter',
                'issued_at'      => now(),
                'issued_by'      => $officer->id ?? null,
                'docx_path'      => $docxRelative,
                'pdf_path'       => null,
                'control_number' => $blotter->id . '-' . now()->format('YmdHis'),
            ]);

            DB::commit();

            // Return download response
            return response()->download($tempDocx, $docxFilename)->deleteFileAfterSend(true);

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('Blotter form generation failed', [
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

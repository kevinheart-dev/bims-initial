<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Resident;
use CloudConvert\CloudConvert;
use CloudConvert\Models\Job;
use CloudConvert\Models\Task;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use Dompdf\Dompdf;
use Dompdf\Options;

class CertificateController extends Controller
{
    public function index()
    {
        $barangay_id = auth()->user()->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        $documents = $query->get();
        $residents = Resident::whereBarangayId($barangay_id)->with('latestHousehold')->get();

        $query = Certificate::where('barangay_id', $barangay_id)
        ->with('resident:id,firstname,middlename,lastname,suffix,purok_number', 'document:id,name', 'issuedBy:id,position')
        ->select('id', 'resident_id', 'document_id', 'barangay_id', 'request_status', 'purpose', 'issued_at', 'issued_by', 'docx_path', 'pdf_path', 'control_number');

        // Filter by certificate_type (assuming it's on the documents table)
        if (request('certificate_type') && request('certificate_type') !== 'All') {
            $type = request('certificate_type');
            $query->whereHas('document', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        // Filter by request_status
        if (request('request_status') && request('request_status') !== 'All') {
            $query->where('request_status', request('request_status'));
        }

        // Filter by issued_by
        if (request('issued_by') && request('issued_by') !== 'All') {
            $query->where('issued_by', request('issued_by'));
        }

        if ($issuedAt = request('issued_at')) {
            try {
                $date = \Carbon\Carbon::parse($issuedAt)->toDateString();
                $query->whereDate('issued_at', $date);
            } catch (\Exception $e) {
                // Ignore invalid date filter
            }
        }

        $search = trim(request('name', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($r) use ($search) {
                    $r->where(function ($rr) use ($search) {
                        $rr->where('firstname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('suffix', 'like', "%{$search}%");
                    });
                })
                ->orWhere('purpose', 'like', "%{$search}%")
                ->orWhereHas('document', function ($d) use ($search) {
                    $d->where('name', 'like', "%{$search}%");
                });
            });
        }

        $certificates = $query->get();

        if (request()->boolean('success')) {
            session()->flash('success', 'Certificate issued successfully.');
        }
        return Inertia::render('BarangayOfficer/Document/CertificateIssuance', [
            'documents' => $documents,
            'residents' => $residents,
            'queryParams' => request()->query() ?: null,
            'certificates' => $certificates,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }
    public function storeFromPost(Request $request)
    {
        $validated = $request->validate([
            'document_id' => 'required|exists:documents,id',
            'resident_id' => 'required|exists:residents,id',
            'purpose' => 'required|string',
        ]);

        $template = Document::findOrFail($validated['document_id']);
        $resident = Resident::findOrFail($validated['resident_id']);

        return $this->store($template, $resident, $request->all());
    }

    public function getPendingCertificates()
    {
        try {
            $barangayId = auth()->user()->barangay_id;

            $count = Certificate::where('request_status', 'pending')
                ->where('barangay_id', $barangayId)
                ->count();

            return response()->json([
                'success' => true,
                'count' => $count,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve pending certificate count.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function store(Document $template, Resident $resident, array $data)
    // {
    //     $barangay_id = auth()->user()->resident->barangay_id;
    //     $officer = BarangayOfficial::findOrFail(auth()->user()->resident->id);
    //     $barangay_name = auth()->user()->resident->barangay->barangay_name;

    //     if (!isset($data['purpose'])) {
    //         throw new \InvalidArgumentException('Purpose is required.');
    //     }

    //     DB::beginTransaction();

    //     try {
    //         $templatePath = storage_path("app/public/{$template->template_path}");

    //         if (!file_exists($templatePath)) {
    //             throw new \Exception('Template file not found.');
    //         }

    //         $templateProcessor = new TemplateProcessor($templatePath);
    //         $placeholders = $templateProcessor->getVariables();

    //         $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
    //         $ctrlNo = 'CSA-' . now()->format('YmdHis');

    //         $systemValues = collect([
    //             'fullname' => $fullName,
    //             'day' => now()->format('j'),
    //             'month' => now()->format('F'),
    //             'year' => now()->format('Y'),
    //             'civil_status' => $resident->civil_status,
    //             'gender' => $resident->gender,
    //             'purpose' => $data['purpose'],
    //             'ctrl_no' => $ctrlNo,
    //             'purok' => $resident->purok_number,
    //         ]);

    //         $customValues = collect($data)->except([
    //             'document_id',
    //             'resident_id',
    //             'purpose',
    //         ]);

    //         $values = $systemValues->merge($customValues);

    //         foreach ($placeholders as $placeholder) {
    //             $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
    //         }

    //         // Build filename and storage path
    //         $filename = 'certificate_' . Str::slug($fullName) . '_' . now()->format('Ymd_His') . '.docx';
    //         $tempPath = storage_path("app/temp/{$filename}");

    //         // Ensure temp directory exists
    //         if (!is_dir(dirname($tempPath))) {
    //             mkdir(dirname($tempPath), 0755, true);
    //         }

    //         // Save to temp then move to persistent public disk
    //         $templateProcessor->saveAs($tempPath);

    //         // Store permanently in public storage under certificates/
    //         $barangaySlug = Str::slug($barangay_name);
    //         $storedRelativePath = "certificates/{$barangaySlug}/{$filename}";
    //         Storage::disk('public')->putFileAs("certificates/{$barangaySlug}", new File($tempPath), $filename);

    //         // Create certificate record with file_path
    //         $certificate = Certificate::create([
    //             'resident_id' => $resident->id,
    //             'document_id' => $template->id,
    //             'barangay_id' => $barangay_id,
    //             'request_status' => 'issued',
    //             'purpose' => $data['purpose'],
    //             'issued_at' => now(), // assuming column is date or datetime
    //             'issued_by' => $officer->id,
    //             'docx_path' => $storedRelativePath,
    //         ]);

    //         DB::commit();

    //         // Return download response from the stored file (keeps copy)
    //         return Storage::disk('public')->download($storedRelativePath, $filename);

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'error' => 'Certificate generation failed.',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    // public function download($id)
    // {
    //     $certificate = Certificate::findOrFail($id);

    //     // Optional: authorize access
    //     // $this->authorize('view', $certificate);

    //     if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
    //         $message = 'Certificate file not found.';

    //         if (request()->wantsJson() || request()->ajax()) {
    //             return response()->json(['error' => $message], 404);
    //         }

    //         return redirect()->back()->with('error', $message);
    //     }

    //     try {
    //         return Storage::disk('public')->download($certificate->file_path);
    //     } catch (\Throwable $e) {
    //         // log if you want: \Log::error("Certificate download failed: ".$e->getMessage());

    //         $fallback = 'Failed to download certificate.';
    //         if (request()->wantsJson() || request()->ajax()) {
    //             return response()->json([
    //                 'error' => $fallback,
    //                 'message' => $e->getMessage(),
    //             ], 500);
    //         }

    //         return redirect()->back()->with('error', $fallback);
    //     }
    // }



    public function store(Document $template, Resident $resident, array $data)
    {
        $this->validateInput($data);

        $user       = auth()->user()->resident; // might be null
        $barangay   = auth()->user()->barangay; // might be null

        $barangayId   = $barangay?->id;        // null-safe
        $barangayName = $barangay?->barangay_name ?? 'Unknown Barangay';

        $officer = $user ? BarangayOfficial::where('resident_id', $user->id)->first() : null;
        $issuedBy = $officer?->id;             // use this later in DB save

        DB::beginTransaction();

        try {
            // Prepare template processor
            $templateProcessor = $this->loadTemplate($template->file_path);

            // --- Handle primary resident values ---
            $values = $this->prepareValues($resident, $data);
            $secondResident = null;

            // --- Handle dual resident placeholders ---
            if (isset($data['resident_id_2'])) {
                $resident2 = Resident::findOrFail($data['resident_id_2']);
                if($resident2){
                    $values = $values->merge($this->prepareSecondResidentValues($resident2, $data));
                }
                $secondResident = $resident2;
            }else{
                $val = collect([
                    'fullname_2'     => str_repeat("\u{00A0}", 40),
                    'civil_status_2' => str_repeat("\u{00A0}", 10),
                    'gender_2'       => str_repeat("\u{00A0}", 8),
                    'purpose_2'      => str_repeat("\u{00A0}", 50),
                    'purok_2'        => str_repeat("\u{00A0}", 3),
                    'day_2'          => str_repeat("\u{00A0}", 5),
                    'month_2'        => str_repeat("\u{00A0}", 12),
                    'year_2'         => str_repeat("\u{00A0}", 8),
                    'issued_on'      => str_repeat("\u{00A0}", 30),
                ]);
                $values = $values->merge($val);
            }

            // Fill placeholders
            foreach ($templateProcessor->getVariables() as $placeholder) {
                $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
            }

            // Generate file names & paths
            $baseName = $this->generateBaseName(
                                $resident,
                                $template->name,
                                $secondResident ?? null
                            );

            $docxFilename = "{$baseName}.docx";
            $tempDocx     = storage_path("app/temp/{$docxFilename}");

            $this->ensureTempDirectory(dirname($tempDocx));

            // Save as DOCX
            $templateProcessor->saveAs($tempDocx);

            // Store in public storage
            $barangaySlug = Str::slug($barangayName);
            $docxRelative = "certificates/{$barangaySlug}/docx/{$docxFilename}";

            $this->storeFiles($tempDocx, $docxRelative);

            // Save DB record (still tied to primary resident)
            $certificate = Certificate::create([
                'resident_id'    => $resident->id,
                'document_id'    => $template->id,
                'barangay_id'    => $barangayId,
                'request_status' => 'issued',
                'purpose'        => $data['purpose'],
                'issued_at'      => now(),
                'issued_by'      => $officer?->id,
                'docx_path'      => $docxRelative,
                'control_number' => $values['ctrl_no'],
            ]);

            DB::commit();

            return Storage::disk('public')->download($docxRelative, $docxFilename);

        } catch (\Throwable $e) {
            \Log::error('Certificate generation failed: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            DB::rollBack();

            return response()->json([
                'error' => 'Certificate generation failed.',
                'message' => $e->getMessage(), // Add this
            ], 500);
        }
    }

/* ----------------- HELPER METHODS ----------------- */

    protected function validateInput(array $data): void
    {
        // Primary purpose is always required
        if (empty($data['purpose'])) {
            throw new \InvalidArgumentException('Purpose is required.');
        }

        // Only validate second resident if provided
        if (!empty($data['resident_id_2'])) {
            if (empty($data['purpose_2'])) {
                throw new \InvalidArgumentException('Purpose for second resident is required when resident 2 is provided.');
            }
        }
    }

    protected function loadTemplate(string $path): TemplateProcessor
    {
        $templatePath = storage_path("app/public/{$path}");
        if (!file_exists($templatePath)) {
            throw new \Exception('Template file not found.');
        }

        return new TemplateProcessor($templatePath);
    }

    protected function prepareValues(Resident $resident, array $data): \Illuminate\Support\Collection
    {
        $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
        $ctrlNo   = 'CSA-' . now()->format('YmdHis');

        // Format day with suffix
        $day = now()->day;
        $dayWithSuffix = $day . $this->getDaySuffix($day);

        $systemValues = collect([
            'fullname'     => $fullName,
            'day'          => $dayWithSuffix,
            'month'        => now()->format('F'),
            'year'         => now()->format('Y'),
            'civil_status' => $resident->civil_status,
            'gender'       => $resident->gender,
            'purpose'      => $data['purpose'],
            'ctrl_no'      => $ctrlNo,
            'purok'        => $resident->purok_number,
        ]);

        return $systemValues->merge(
            collect($data)->except(['document_id', 'resident_id', 'purpose', 'resident_id_2', 'purpose_2'])
        );
    }

    protected function prepareSecondResidentValues(Resident $resident2, array $data): \Illuminate\Support\Collection
    {
        $fullName2 = trim("{$resident2->firstname} {$resident2->middlename} {$resident2->lastname} {$resident2->suffix}");
                // Format day with suffix
        $day = now()->day;
        $dayWithSuffix = $day . $this->getDaySuffix($day);

        return collect([
            'fullname_2'     => $fullName2,
            'civil_status_2' => $resident2->civil_status,
            'gender_2'       => $resident2->gender,
            'purpose_2'      => $data['purpose_2'] ?? '',
            'purok_2'        => $resident2->purok_number,
            'day_2'          => $dayWithSuffix,
            'month_2'        => now()->format('F'),
            'year_2'         => now()->format('Y'),
            'issued_on'      =>now()->format('F') . " $dayWithSuffix, " . now()->format('Y'),
        ]);
    }

    protected function getDaySuffix(int $day): string
    {
        if ($day % 100 >= 11 && $day % 100 <= 13) {
            return 'ᵗʰ';
        }

        return match ($day % 10) {
            1 => 'ˢᵗ',
            2 => 'ⁿᵈ',
            3 => 'ʳᵈ',
            default => 'ᵗʰ',
        };
    }

    protected function generateBaseName(Resident $resident, string $documentName, ?Resident $secondResident = null): string
    {
        // Always take the first name of the main resident
        $namePart = Str::slug($resident->firstname);

        // If there is a second resident, append their first name
        if ($secondResident) {
            $namePart .= '-' . Str::slug($secondResident->firstname);
        }

        return Str::slug($documentName) . '_' . $namePart . '_' . now()->format('Ymd_His');
    }

    protected function ensureTempDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }

    protected function storeFiles(string $docxPath, string $docxRelative): void
    {
        Storage::disk('public')->putFileAs(dirname($docxRelative), new File($docxPath), basename($docxRelative));
        @unlink($docxPath);
    }

    public function print($id)
    {
        $certificate = Certificate::findOrFail($id);

        if (!$certificate->docx_path || !Storage::disk('public')->exists($certificate->docx_path)) {
            return back()->with('error', 'DOCX file not found.');
        }

        $cloudconvert = new CloudConvert([
            'api_key' => config('cloudconvert.api_key'),
            'sandbox' => false, // Use real mode
        ]);

        try {
            // Create job
            $job = (new Job())
                ->addTask(new Task('import/upload', 'import-my-file'))
                ->addTask((new Task('convert', 'convert-my-file'))
                    ->set('input', 'import-my-file')
                    ->set('output_format', 'pdf'))
                ->addTask((new Task('export/url', 'export-my-file'))
                    ->set('input', 'convert-my-file'));

            $job = $cloudconvert->jobs()->create($job);

            // Upload DOCX
            $importTask = $job->getTasks()->whereName('import-my-file')[0];
            $cloudconvert->tasks()->upload(
                $importTask,
                fopen(Storage::disk('public')->path($certificate->docx_path), 'r')
            );

            // Wait for the job to finish
            $job = $cloudconvert->jobs()->wait($job);

            // Get the export task
            $exportTask = $job->getTasks()->whereName('export-my-file')[0];

            // ✅ Use getter for status
            if ($exportTask->getStatus() !== 'finished' || empty($exportTask->getResult()->files)) {
                return back()->with('error', 'PDF conversion failed or no files returned.');
            }

            // Access the first file URL
            $fileUrl = $exportTask->getResult()->files[0]->url;

            // Save PDF to local storage
            $pdfFileName = 'converted_' . time() . '.pdf';
            //Storage::disk('public')->put('generated_pdfs/' . $pdfFileName, file_get_contents($fileUrl));

            // Redirect to PDF
            return redirect(asset('storage/generated_pdfs/' . $pdfFileName));

        } catch (\Exception $e) {
            return back()->with('error', 'Conversion error: ' . $e->getMessage());
        }
    }
    public function download($id)
    {
        $certificate = Certificate::findOrFail($id);

        // Check if DOCX file exists
        if (!$certificate->docx_path || !Storage::disk('public')->exists($certificate->docx_path)) {
            return response()->json(['error' => 'DOCX file not found.'], 404);
        }

        // Return DOCX file for download
        return Storage::disk('public')->download(
            $certificate->docx_path,
            basename($certificate->docx_path), // Download with original filename
            ['Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        );
    }

    // RESIDENT ISSUANCE
    public function issue($id)
    {
        // Fetch certificate and related models
        $certificate = Certificate::where('id', $id)
            ->where('request_status', 'pending')
            ->firstOrFail();


        $template = Document::findOrFail($certificate->document_id);
        $resident = Resident::findOrFail($certificate->resident_id);

        // Get authenticated user and their barangay safely
        $userAccount  = auth()->user();
        $barangay     = $userAccount?->barangay;

        if (!$userAccount || !$barangay) {
            return response()->json([
                'error'   => 'Unauthorized',
                'message' => 'Missing user or barangay information.',
            ], 401);
        }

        $barangayName = $barangay->barangay_name;

        // Find officer, null-safe
        $officer   = BarangayOfficial::where('resident_id', $userAccount->resident_id)->first();
        $issuedBy  = $officer?->id;

        DB::beginTransaction();

        try {
            // Load template
            $templateProcessor = $this->loadTemplate($template->file_path);

            // Prepare certificate values
            $values = $this->prepareValues($resident, ['purpose' => $certificate->purpose]);

            // Merge dynamic values if they exist
            $dynamicValues = $certificate->dynamic_values ?? [];
            $flatDynamicValues = collect();

            if (is_array($dynamicValues)) {
                foreach ($dynamicValues as $field) {
                    if (!empty($field['key'])) {
                        $flatDynamicValues[$field['key']] = $field['value'] ?? '';
                    }
                }
            }

            $values = $values->merge($flatDynamicValues);

            // Fill placeholder for second resident (blank lines)
            $blank2 = collect([
                'fullname_2'    => str_repeat("_", 40),
                'civil_status_2'=> str_repeat("_", 10),
                'gender_2'      => str_repeat("_", 8),
                'purpose_2'     => str_repeat("_", 50),
                'purok_2'       => str_repeat("_", 3),
                'day_2'         => str_repeat("_", 5),
                'month_2'       => str_repeat("_", 12),
                'year_2'        => str_repeat("_", 8),
                'issued_on'     => str_repeat("_", 30),
            ]);
            $values = $values->merge($blank2);

            // Fill template placeholders
            foreach ($templateProcessor->getVariables() as $placeholder) {
                $templateProcessor->setValue($placeholder, $values[$placeholder] ?? '');
            }

            // Generate file names and temp paths
            $baseName    = $this->generateBaseName($resident, $template->name);
            $docxFilename= "{$baseName}.docx";
            $tempDocx    = storage_path("app/temp/{$docxFilename}");

            $this->ensureTempDirectory(dirname($tempDocx));
            $templateProcessor->saveAs($tempDocx);

            // Store in public storage
            $barangaySlug = Str::slug($barangayName);
            $docxRelative = "certificates/{$barangaySlug}/docx/{$docxFilename}";
            $this->storeFiles($tempDocx,  $docxRelative); // PDF not used here

            // Update certificate record
            $certificate->update([
                'request_status' => 'issued',
                'issued_at'      => now(),
                'issued_by'      => $issuedBy,
                'docx_path'      => $docxRelative,
                'control_number' => $values['ctrl_no'] ?? null,
            ]);
            $certificate->load('document');
            DB::commit();
            // ✅ Send email notification that certificate is ready for pickup
            try {
                app(EmailController::class)->sendCertificateReadyEmail(
    $resident->email,
    "{$resident->firstname} {$resident->lastname}",
    $certificate,

            );
            } catch (\Exception $ex) {
                \Log::error("Certificate ready email failed: " . $ex->getMessage());
            }
            // Return the DOCX as a download
            return Storage::disk('public')->download($docxRelative, $docxFilename);

        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);

            return response()->json([
                'error'   => 'Issuance failed.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    // Deny
    public function denyRequest($id){
        DB::beginTransaction();
        $certificate = Certificate::findOrFail($id);
        $resident = Resident::findOrFail($certificate->resident_id);
        $certificate->load('document');
        try {
            $certificate->delete();
            DB::commit();
            try {
                app(EmailController::class)->sendCertificateDeniedEmail(
    $resident->email,
    "{$resident->firstname} {$resident->lastname}",
    $certificate,
            );
            } catch (\Exception $ex) {
                \Log::error("Certificate ready email failed: " . $ex->getMessage());
            }
            return  redirect()->route('certificate.index')->with('success', 'Certificate request denied successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Certificate request failed: ' . $e->getMessage());
            return back()->with(
                'error','Certificate request could not be denied: ' . $e->getMessage()
            );
        }
    }
    public function destroy($id){
        DB::beginTransaction();
        $certificate = Certificate::findOrFail($id);
        try {
            $certificate->delete();
            DB::commit();
            return  redirect()->route('certificate.index')->with('success', 'Certificate record deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Certificate request failed: ' . $e->getMessage());
            return back()->with(
                'error','Certificate request could not be deleted: ' . $e->getMessage()
            );
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCertificateRequest;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Family;
use App\Models\Household;
use App\Models\Purok;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use App\Models\Street;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Str;

class ResidentAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        $certificate = Certificate::findOrFail($id);
        try {
            $certificate->delete();
            DB::commit();
            return  redirect()->route('resident_account.certificates')->with('success', 'Certificate request cancelled successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Certificate request failed: ' . $e->getMessage());
            return back()->with(
                'error','Certificate request could not be cancelled: ' . $e->getMessage()
            );
        }
    }

    public function dashboard(){
        $brgy_id = auth()->user()->barangay_id;
        $residentCount = Resident::where('barangay_id', $brgy_id)->count();
        $seniorCitizenCount = SeniorCitizen::whereHas('resident', function ($query) use ($brgy_id) {
            $query->where('barangay_id', $brgy_id);
        })->count();
        $totalHouseholds = Household::query()->where('barangay_id', $brgy_id)->count();
        $totalFamilies = Family::query()->where('barangay_id', $brgy_id)->count();

        $genderDistribution = Resident::select('gender')
            ->where('barangay_id', $brgy_id)
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        $populationPerPurok = Resident::selectRaw('purok_number, COUNT(*) as count')
            ->where('barangay_id', $brgy_id)
            ->groupBy('purok_number')
            ->pluck('count', 'purok_number');


        $ageGroups = [
            '0-6 months' => [0, 0.5],
            '7 mos. to 2 years old' => [0.6, 2],
            '3-5 years old' => [3, 5],
            '6-12 years old' => [6, 12],
            '13-17 years old' => [13, 17],
            '18-59 years old' => [18, 59],
            '60 years old and above' => [60, 200],
        ];

        $ageDistribution = [];

        foreach ($ageGroups as $label => [$min, $max]) {
            $ageDistribution[$label] = Resident::where('barangay_id', $brgy_id)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        $pwdDistribution = [
            'PWD' => Resident::where('barangay_id', $brgy_id)
                ->whereHas('disabilities')
                ->count(),
            'nonPWD' => Resident::where('barangay_id', $brgy_id)
                ->whereDoesntHave('disabilities')
                ->count(),
        ];
        return Inertia::render('Resident/Dashboard', [
            'residentCount' => $residentCount,
            'seniorCitizenCount' => $seniorCitizenCount,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies' => $totalFamilies,
            'genderDistribution' => $genderDistribution,
            'populationPerPurok' => $populationPerPurok,
            'ageDistribution' => $ageDistribution,
            'pwdDistribution' => $pwdDistribution,
        ]);
    }

    public function residentCertificates(){
        $user = auth()->user();
        $barangay_id = $user->resident->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        $documents = $query->get();

        $query = Certificate::where('barangay_id', $barangay_id)
        ->with('document:id,name', 'issuedBy:id,position')->where('resident_id', $user->resident->id)
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
                $q->where('purpose', 'like', "%{$search}%")
                ->orWhereHas('document', function ($d) use ($search) {
                    $d->where('name', 'like', "%{$search}%");
                })->orWhere('control_number', 'like', "%{$search}%");
            });
        }


        $certificates = $query->paginate(10)->withQueryString();

        return Inertia::render('Resident/Certificate/Index', [
            'documents' => $documents,
            'queryParams' => request()->query() ?: null,
            'certificates' => $certificates,

        ]);
    }

    public function requestCertificate(StoreCertificateRequest $request)
    {
        try {
            $user = auth()->user();
            $resident = $user->resident;

            // Count today's certificate requests for this resident
            $todayRequests = Certificate::where('resident_id', $resident->id)
                ->whereDate('created_at', Carbon::today())
                ->count();

            if ($todayRequests >= 3) {
                return back()->with('error', 'You can only submit up to 3 certificate requests per day.');
            }

            $validated = $request->validated();

            $certificate = Certificate::create([
                'resident_id'    => $validated['resident_id'] ?? $resident->id,
                'document_id'    => $validated['document_id'],
                'barangay_id'    => $resident->barangay_id,
                'request_status' => 'pending',
                'purpose'        => $validated['purpose'],
                'issued_at'      => null,
                'issued_by'      => null,
                'docx_path'      => null,
                'pdf_path'       => null,
                'control_number' => null,
                'dynamic_values' => json_encode($validated['placeholders'] ?? []),
            ]);

            // Send email notification to resident
            app(EmailController::class)->sendCertificateRequestEmail(
                $resident->email,
                "{$resident->firstname} {$resident->lastname}",
                $certificate
            );

            // Send email notification to barangay
            $barangayEmail = $resident->barangay->email;
            if ($barangayEmail) {
                app(EmailController::class)->sendBarangayCertificateNotification(
                    $barangayEmail,
                    $resident,
                    $certificate
                );
            }

            return redirect()->route('resident_account.certificates')
                ->with('success', 'Certificate request submitted successfully.');

        } catch (\Exception $e) {
            \Log::error('Certificate request failed: ' . $e->getMessage());
            return back()->with('error', 'Certificate request could not be submitted: ' . $e->getMessage());
        }
    }

    public function basicInformation() {
        $residentId = auth()->user()->resident_id;

        $resident = Resident::with(
            'barangay',
            'street',
            'street.purok'
        )->findOrFail($residentId);

        $barangayId = $resident->barangay_id;

        $puroks = Purok::where('barangay_id', $barangayId)->orderBy('purok_number', 'asc')->pluck('purok_number');
        $streets = Street::whereIn('purok_id', $puroks)
            ->orderBy('street_name', 'asc')
            ->with(['purok:id,purok_number'])
            ->get(['id', 'street_name', 'purok_id']);

        return Inertia::render("Resident/BasicInfo/Index", [
            'details' => $resident,
            'puroks'  => $puroks,
            'streets' => $streets,
        ]);
    }

    public function updateInfo(Request $request)
    {
        try {
            $resident = Resident::findOrFail($request->resident_id);

            $validated = $request->validate([
                'resident_image' => ['nullable', 'image', 'max:5120'], // max:5MB

                'lastname' => ['required', 'string', 'max:55'],
                'firstname' => ['required', 'string', 'max:55'],
                'middlename' => ['nullable', 'string', 'max:55'],
                'maiden_name' => ['nullable', 'string', 'max:100'],

                'suffix' => ['nullable', Rule::in(['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'])],

                'birthdate' => ['required', 'date', 'before:today'],
                'birthplace' => ['required', 'string', 'max:150'],

                'civil_status' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated', 'annulled'])],
                'sex' => ['required', Rule::in(['male', 'female'])],

                'citizenship' => ['required', 'string', 'max:55'],
                'religion' => ['required', 'string', 'max:55'],
                'ethnicity' => ['nullable', 'string', 'max:55'],

                'contact_number' => ['nullable', 'string', 'max:15'],

                'email' => [
                    'nullable',
                    'email',
                    'min:10',
                    'max:55',
                    Rule::unique('residents', 'email')->ignore($resident->id)
                ],

                'residency_type' => ['required', Rule::in(['permanent', 'temporary', 'immigrant'])],
                'residency_date' => [
                    'required',
                    'digits:4',
                    'integer',
                    'min:1900',
                    'max:' . now()->year,
                ],

                'purok_number' => ['required', 'integer'],
                'street_id' => ['required', 'exists:streets,id'],
            ]);

            // ✅ Handle Image Upload
            $image = $validated['resident_image'] ?? null;

            if ($image instanceof \Illuminate\Http\UploadedFile) {
                $folder = 'residents/' . $validated['lastname'] . $validated['firstname'] . Str::random(6);
                $path = $image->store($folder, 'public');
            } else {
                $path = $resident->resident_picture_path; // keep old image
            }

            // ✅ Format data for update
            $residentInformation = [
                'resident_picture_path' => $path ?? $resident->resident_picture_path,
                'firstname' => $validated['firstname'] ?? $resident->firstname,
                'middlename' => $validated['middlename'] ?? $resident->middlename,
                'lastname' => $validated['lastname'] ?? $resident->lastname,
                'maiden_name' => $validated['maiden_name'] ?? $resident->maiden_name,
                'suffix' => $validated['suffix'] ?? $resident->suffix,
                'sex' => $validated['sex'] ?? $resident->sex,
                'birthdate' => $validated['birthdate'] ?? $resident->birthdate,
                'birthplace' => $validated['birthplace'] ?? $resident->birthplace,
                'civil_status' => $validated['civil_status'] ?? $resident->civil_status,
                'citizenship' => $validated['citizenship'] ?? $resident->citizenship,
                'religion' => $validated['religion'] ?? $resident->religion,
                'contact_number' => $validated['contact_number'] ?? $resident->contact_number,
                'email' => $validated['email'] ?? $resident->email,
                'residency_date' => $validated['residency_date'] ?? $resident->residency_date,
                'residency_type' => $validated['residency_type'] ?? $resident->residency_type,
                'purok_number' => $validated['purok_number'] ?? $resident->purok_number,
                'street_id' => $validated['street_id'] ?? $resident->street_id,
                'ethnicity' => $validated['ethnicity'] ?? $resident->ethnicity,
                'verified' => $validated['verified'] ?? $resident->verified,
            ];

            $resident->update($residentInformation);

            return back()->with('success', 'Resident information updated successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->validator)->withInput();

        } catch (\Exception $e) {
            \Log::error('Resident update failed: '.$e->getMessage(), [
                'resident_id' => $request->resident_id,
            ]);

            return back()->with('error', 'An unexpected error occurred. Please try again later.');
        }
    }

}

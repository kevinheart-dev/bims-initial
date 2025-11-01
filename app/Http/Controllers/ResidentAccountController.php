<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCertificateRequest;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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

            // Send email notification
            app(EmailController::class)->sendCertificateRequestEmail(
                $resident->email,
                "{$resident->firstname} {$resident->lastname}",
                $certificate
            );

            // Send email notification to barangay
            $barangayEmail = $resident->barangay->email; // make sure your Barangay model has an email field
            if ($barangayEmail) {
                app(EmailController::class)->sendBarangayCertificateNotification(
                    $barangayEmail,
                    $resident,
                    $certificate
                );
            }

            return  redirect()->route('resident_account.certificates')->with('success', 'Certificate request submitted successfully.');
        } catch (\Exception $e) {
            \Log::error('Certificate request failed: ' . $e->getMessage());
            return back()->with(
                'error','Certificate request could not be submitted: ' . $e->getMessage()
            );
        }
    }


}

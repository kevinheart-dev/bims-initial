<?php

namespace App\Http\Controllers;

use App\Http\Requests\CertificateRequestFormRequest;
use App\Models\Barangay;
use App\Models\Certificate;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UnauthenticatedIssuanceController extends Controller
{
    public function makeRequest(){
        $barangays = Barangay::all()->select('id', 'barangay_name');

        return Inertia::render('UnauthenticatedIssuance', ['barangays' => $barangays]);
    }

    public function fetchDocuments($id)
    {
        $query = Document::where('barangay_id',  $id);
        $documents = $query->get();
        return response()->json([
            'documents' => $documents
        ]);
    }

    public function store(CertificateRequestFormRequest $request)
    {
        dd($request->all());
        try {
            // Only validated fields
            $validated = $request->validated();

            $certificate = Certificate::create([
                'resident_id'    => $validated['resident_id'] ?? null, // optional if no user
                'document_id'    => $validated['document_id'],
                'barangay_id'    => $validated['barangay_id'] ?? null, // pass from request
                'request_status' => 'pending', // always pending on request
                'purpose'        => $validated['purpose'],
                'issued_at'      => null,
                'issued_by'      => null,
                'docx_path'      => null,
                'pdf_path'       => null,
                'control_number' => null,
                'dynamic_values' => json_encode($validated['placeholders'] ?? []),
            ]);

            return redirect()
                ->route('resident_account.certificates')
                ->with('success', 'Certificate request submitted successfully.');
        } catch (\Exception $e) {
            Log::error('Certificate request failed: ' . $e->getMessage());

            return back()->with(
                'error',
                'Certificate request could not be submitted: ' . $e->getMessage()
            );
        }
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

class CertificateController extends Controller
{
    //
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

    public function store(Document $template, Resident $resident, array $data)
    {
        if (!isset($data['purpose'])) {
            throw new \InvalidArgumentException('Purpose is required.');
        }

        try {
            $templatePath = storage_path("app/public/{$template->template_path}");

            if (!file_exists($templatePath)) {
                throw new \Exception('Template file not found.');
            }

            $templateProcessor = new TemplateProcessor($templatePath);

            $placeholders = $templateProcessor->getVariables();

            // Format resident name
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");

            $ctrlNo = 'CSA-' . now()->format('YmdHis');

            // System-defined placeholders
            $systemValues = collect([
                'fullname' => $fullName,
                'day' => now()->format('j'),
                'month' => now()->format('F'),
                'year' => now()->format('Y'),
                'civil_status' => $resident->civil_status,
                'gender' => $resident->gender,
                'purpose' => $data['purpose'],
                'ctrl_no' => $ctrlNo,
            ]);

            // User-provided dynamic values (excluding known system keys)
            $customValues = collect($data)->except([
                'document_id',
                'resident_id',
                'purpose',
            ]);

            // Final merged placeholder values
            $values = $systemValues->merge($customValues);

            // Fill the placeholders in the template
            foreach ($placeholders as $placeholder) {
                $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
            }

            // Save the generated file
            $filename = 'certificate_' . Str::slug($fullName) . '_' . now()->format('Ymd_His') . '.docx';
            $outputPath = storage_path("app/temp/{$filename}");

            $templateProcessor->saveAs($outputPath);

            \Log::info('Certificate generated manually for:', [
                'resident_id' => $resident->id,
                'document_id' => $template->id,
                'placeholders' => $placeholders,
                'values' => $values->only($placeholders),
            ]);

            return response()->download($outputPath, $filename)->deleteFileAfterSend(true);

        } catch (\Throwable $e) {
            \Log::error('Manual certificate generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Generation failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}

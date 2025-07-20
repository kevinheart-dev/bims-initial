<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\TemplateProcessor;

class DocumentGenerationController extends Controller
{
    public function generateFilledDocument(Resident $resident, $templateId)
    {
        // try {
        //     $template = Document::findOrFail($templateId);
        //     $templatePath = storage_path("app/public/{$template->template_path}");

        //     if (!file_exists($templatePath)) {
        //         return response()->json(['error' => 'Template file not found.'], 404);
        //     }

        //     $templateProcessor = new TemplateProcessor($templatePath);

        //     $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");

        //     $templateProcessor->setValue('fullname', $fullName);
        //     $templateProcessor->setValue('day', now()->format('j'));
        //     $templateProcessor->setValue('month', now()->format('F'));
        //     $templateProcessor->setValue('year', now()->format('Y'));

        //     $filename = 'filled_' . Str::slug($fullName) . '_' . time() . '.docx';
        //     $outputPath = storage_path("app/temp/{$filename}");
        //     $templateProcessor->saveAs($outputPath);

        //     return response()->download($outputPath)->deleteFileAfterSend(true);

        // } catch (\Throwable $e) {
        //     \Log::error('Document fill failed', ['error' => $e->getMessage()]);
        //     return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        // }

        // GETS PLACEHOLDERS
        try {
            // Get template
            $template = Document::findOrFail($templateId);
            $templatePath = storage_path("app/public/{$template->template_path}");

            if (!file_exists($templatePath)) {
                return response()->json(['error' => 'Template file not found.'], 404);
            }

            $templateProcessor = new TemplateProcessor($templatePath);

            // Extract available placeholders
            $placeholders = $templateProcessor->getVariables();

            // Prepare values for placeholders
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            $values = [
                'fullname' => $fullName,
                'day' => now()->format('j'),
                'month' => now()->format('F'),
                'year' => now()->format('Y'),
                'civil_status' => $resident->civil_status,
                'gender' => $resident->gender,
                'purpose' => 'nada, wala na',
                'ctrl_no' => 'CSA-1990123'
            ];

            // Set placeholders
            foreach ($placeholders as $placeholder) {
                $templateProcessor->setValue($placeholder, $values[$placeholder] ?? '');
            }

            // Save output
            $filename = 'filled_' . Str::slug($fullName) . '_' . date('Y-m-d') . '.docx';
            $outputPath = storage_path("app/temp/{$filename}");
            $templateProcessor->saveAs($outputPath);

            \Log::info('Placeholders found in template:', $placeholders);



            return response()->download($outputPath)->deleteFileAfterSend(true);

        } catch (\Throwable $e) {
            \Log::error('Document fill failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


}

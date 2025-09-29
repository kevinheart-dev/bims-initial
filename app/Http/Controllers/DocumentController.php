<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Resident;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barangay_id = Auth()->user()->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        if ($search = trim(request('name', ''))) {
            $query->where('name', 'like', "%{$search}%");
        }
        $documents = $query->get();
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayDocument', [
            'documents' => $documents,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    // axios
    // public function index()
    // {
    //     $barangay_id = Auth()->user()->barangay_id;
    //     $query = Document::where('barangay_id',  $barangay_id);
    //     $documents = $query->get();
    //     return Inertia::render('BarangayOfficer/Document/PracticeAxios');
    // }

    public function fetchDocuments()
    {
        $barangay_id = Auth()->user()->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        $documents = $query->get();
        return response()->json([
            'documents' => $documents
        ]);
    }
    public function fetchDocumentPath($id)
    {
        $document = Document::find($id);

        if (!$document) {
            return response()->json(['message' => 'Document not found.'], 404);
        }

        return response()->json([
            'document' => $document->file_path, // or actual path field
        ]);
    }
    public function fetchPlaceholders($id)
    {
        $template = Document::findOrFail($id);
        $templatePath = storage_path("app/public/{$template->file_path}");

        if (!file_exists($templatePath)) {
            abort(404, 'Template file not found.');
        }

        $templateProcessor = new TemplateProcessor($templatePath);
        $placeholders = $templateProcessor->getVariables();

        return response()->json([
            'placeholders' => $placeholders,
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
    public function store(Request $request)
    {
        try {


            $barangay = auth()->user()->resident->barangay;
            $data = $request->validate([
                'file' => 'required|file|mimes:docx,doc,pdf,txt|max:10240', // 10MB max
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:255',
                'specific_purpose' => 'nullable|string|max:55',
            ]);
            $file = $data['file'];
            $originalName = $file->getClientOriginalName();
            $barangayName = $barangay->barangay_name;
            $barangaySlug = Str::slug($barangayName);
            $path = $file->storeAs("documents/templates/{$barangaySlug}", $originalName, 'public');
            Document::create([
                'barangay_id' =>  $barangay->id,
                'name' => $data['name'] ?? $originalName,
                'file_path' => $path,
                'description' => $data['description'] ?? null,
                'specific_purpose' => $data['specific_purpose'] ?? null,
            ]);
            return back()->with('success', "{$data['name']} Document uploaded.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to add document: ' . $e->getMessage());
        }
    }

    public function preview($id)
    {
        $document = Document::findOrFail($id);

        if (!$document->template_path) {
            abort(404, 'No file path found for this document.');
        }

        // Sanitize the file path
        $relativePath = str_replace('\\', '/', $document->file_path);
        $filePath = storage_path('app/' . $relativePath);
        dd($filePath);
        if (!file_exists($filePath)) {
            \Log::error("File not found at: {$filePath}");
            abort(404, 'File not found.');
        }

        return response()->file($filePath);
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        DB::beginTransaction();
        try {
            // Delete the file if it exists
            if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
                Storage::disk('public')->delete($document->file_path);
            }

            // Delete the record
            $document->delete();

            DB::commit();

            return redirect()->route('document.index')
                ->with('success', "Document '{$document->name}' deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Record could not be deleted: ' . $e->getMessage());
        }
    }
}

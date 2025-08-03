<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Resident;
use Illuminate\Http\Request;
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
        $barangay_id = auth()->user()->resident->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        if ($search = trim(request('name', ''))) {
            $query->where('name', 'like', "%{$search}%");
        }
        $documents = $query->get();
        return Inertia::render('BarangayOfficer/Document/Index', [
            'documents' => $documents,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    // axios
    // public function index()
    // {
    //     $barangay_id = auth()->user()->resident->barangay_id;
    //     $query = Document::where('barangay_id',  $barangay_id);
    //     $documents = $query->get();
    //     return Inertia::render('BarangayOfficer/Document/PracticeAxios');
    // }

    public function fetchDocuments()
    {
        $barangay_id = auth()->user()->resident->barangay_id;
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
            return response()->json(['error' => 'Template file not found.'], 404);
        }

        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($templatePath);
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
        $barangay = auth()->user()->resident->barangay;
        $data = $request->validate([
            'file' => 'required|file|mimes:docx,doc,pdf,txt|max:10240', // 10MB max
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
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
        ]);
        return back()->with('success', "{$data['name']} Document uploaded.");
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
    public function show(Document $document)
    {

    }

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
        //
    }
}

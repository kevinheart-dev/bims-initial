<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBarangayProjectRequest;
use App\Http\Requests\UpdateBarangayProjectRequest;
use App\Models\Barangay;
use App\Models\BarangayInstitution;
use App\Models\BarangayProject;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Str;

class BarangayProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Base query with eager loading
        $query = BarangayProject::with('institution')
            ->where('barangay_id', $brgy_id)
            ->orderBy('start_date', 'desc');

        // === Apply Filters ===
        if ($status = request('project_status')) {
            if ($status !== 'All') {
                $query->where('status', $status);
            }
        }

        if ($category = request('project_category')) {
            if ($category !== 'All') {
                $query->where('category', $category);
            }
        }

        if ($responsible = request('responsible_inti')) {
            if ($responsible !== 'All') {
                $query->whereHas('institution', function ($q) use ($responsible) {
                    $q->where('name', $responsible);
                });
            }
        }

        if ($startDate = request('start_date')) {
            $query->whereDate('start_date', '>=', $startDate);
        }

        if ($endDate = request('end_date')) {
            $query->whereDate('end_date', '<=', $endDate);
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('title', 'like', '%' . request('name') . '%')
                ->orWhere('description', 'like', '%' . request('name') . '%');
            });
        }

        // Paginate and preserve query string
        $projects = $query->paginate(10)->withQueryString();

        // Distinct dropdown filters
        $institutions = BarangayInstitution::where('barangay_id', $brgy_id)
            ->select('id', 'name')
            ->distinct()
            ->get();

        $categories = BarangayProject::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('category');

        // Return Inertia page
        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayProjects/ProjectIndex', [
            'projects' => $projects,
            'institutions' => $institutions,
            'categories' => $categories,
            'queryParams' => request()->query() ?: null,
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
    public function store(StoreBarangayProjectRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['projects']) && is_array($data['projects'])) {
                foreach ($data['projects'] as $project) {
                    $imagePath = $project['project_image'] ?? null;

                    // If it's a file upload, store it
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'projects/' . $barangaySlug . '/' . Str::slug($project['title']) . '-' . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    BarangayProject::create([
                        'barangay_id'             => $brgy_id,
                        'project_image'           => $imagePath, // stored file or null
                        'title'                   => $project['title'],
                        'description'             => $project['description'],
                        'status'                  => $project['status'],
                        'category'                => $project['category'],
                        'responsible_institution' => $project['responsible_institution'] ?? null,
                        'budget'                  => $project['budget'],
                        'funding_source'          => $project['funding_source'],
                        'start_date'              => $project['start_date'],
                        'end_date'                => $project['end_date'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_project.index')
                ->with('success' ,'Project(s) saved successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Project(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayProject $barangayProject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayProject $barangayProject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayProjectRequest $request, BarangayProject $barangayProject)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = Barangay::find($brgy_id)->barangay_name;
        $barangaySlug = Str::slug($barangayName);
        $data = $request->validated();

        try {
            if (!empty($data['projects']) && is_array($data['projects'])) {
                foreach ($data['projects'] as $proj) {

                    $imagePath = $barangayProject->project_image; // default to old image

                    // Case 1: New file uploaded
                    if (!empty($proj['project_image']) && $proj['project_image'] instanceof \Illuminate\Http\UploadedFile) {
                        // Delete old image if exists
                        if ($barangayProject->project_image && Storage::disk('public')->exists($barangayProject->project_image)) {
                            Storage::disk('public')->delete($barangayProject->project_image);

                            // Delete folder if empty
                            $folder = dirname($barangayProject->project_image);
                            if (Storage::disk('public')->exists($folder) && empty(Storage::disk('public')->files($folder))) {
                                Storage::disk('public')->deleteDirectory($folder);
                            }
                        }

                        // Store new file
                        $folder = "projects/{$barangaySlug}/" . Str::slug($proj['title']) . '-' . Str::random(10);
                        $imagePath = $proj['project_image']->store($folder, 'public');
                    }
                    // Case 2: Keep existing image if provided
                    elseif (!empty($proj['existing_image'])) {
                        $imagePath = $proj['existing_image'];
                    }

                    $barangayProject->update([
                        'title'                   => $proj['title'] ?? $barangayProject->title,
                        'project_image'           => $imagePath,
                        'description'             => $proj['description'] ?? $barangayProject->description,
                        'status'                  => $proj['status'] ?? $barangayProject->status,
                        'category'                => $proj['category'] ?? $barangayProject->category,
                        'responsible_institution' => $proj['responsible_institution'] ?? $barangayProject->responsible_institution,
                        'budget'                  => $proj['budget'] ?? $barangayProject->budget,
                        'funding_source'          => $proj['funding_source'] ?? $barangayProject->funding_source,
                        'start_date'              => $proj['start_date'] ?? $barangayProject->start_date,
                        'end_date'                => $proj['end_date'] ?? $barangayProject->end_date,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_project.index')
                ->with('success','Project updated successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Project could not be updated: ' . $e->getMessage()
            );
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayProject $barangayProject)
    {
        DB::beginTransaction();

        try {
            // Delete the project image from storage if it exists
            if ($barangayProject->project_image && Storage::disk('public')->exists($barangayProject->project_image)) {
                Storage::disk('public')->delete($barangayProject->project_image);
                // Delete the folder if empty
                $folder = dirname($barangayProject->project_image);
                if (empty(Storage::disk('public')->files($folder))) {
                    Storage::disk('public')->deleteDirectory($folder);
                }
            }

            // Delete the project record
            $barangayProject->delete();

            DB::commit();

            return redirect()
                ->route('barangay_project.index')
                ->with('success' , 'Project deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with(
                'error',
                'Project could not be deleted: ' . $e->getMessage()
            );
        }
    }
    public function projectDetails($id){
        $project = BarangayProject::findOrFail($id);
        return response()->json([
            'project' => $project,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBarangayProjectRequest;
use App\Http\Requests\UpdateBarangayProjectRequest;
use App\Models\BarangayInstitution;
use App\Models\BarangayProject;
use DB;
use Illuminate\Http\Request;

class BarangayProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;

        // Base query with eager loading
        $query = BarangayProject::with('institution')
            ->where('barangay_id', $brgy_id)
            ->orderBy('start_date', 'desc');

        // === Apply Filters ===

        // Status filter
        if ($status = request('project_status')) {
            if ($status !== 'All') {
                $query->where('status', $status);
            }
        }

        // Category filter
        if ($category = request('project_category')) {
            if ($category !== 'All') {
                $query->where('category', $category);
            }
        }

        // Responsible institution filter
        if ($responsible = request('responsible_inti')) {
            if ($responsible !== 'All') {
                $query->whereHas('institution', function ($q) use ($responsible) {
                    $q->where('name', $responsible);
                });
            }
        }

        // Date filters
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
        // Paginate and keep query string
        $projects = $query->paginate(10)->withQueryString();

        // For dropdowns
        $institutions = BarangayInstitution::query()
            ->where('barangay_id', $brgy_id)
            ->select('id', 'name')
            ->distinct()
            ->get();

        $categories = BarangayProject::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('category');

        return response()->json([
            'projects' => $projects,
            'institutions' => $institutions,
            'categories' => $categories
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
        $data = $request->validated();

        try {
            if (!empty($data['projects']) && is_array($data['projects'])) {
                foreach ($data['projects'] as $proj) {
                    BarangayProject::create([
                        'barangay_id'               => $brgy_id,
                        'title'                     => $proj['title'],
                        'description'               => $proj['description'],
                        'status'                    => $proj['status'],
                        'category'                  => $proj['category'],
                        'responsible_institution'   => $proj['responsible_institution'] ?? null,
                        'budget'                     => $proj['budget'],
                        'funding_source'             => $proj['funding_source'],
                        'start_date'                 => $proj['start_date'],
                        'end_date'                   => $proj['end_date'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success'   => 'Project(s) saved successfully.',
                    'activeTab' => 'projects'
                ]);
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
        $data = $request->validated();

        try {
            if (!empty($data['projects']) && is_array($data['projects'])) {
                foreach ($data['projects'] as $proj) {
                    $barangayProject->update([
                        'title'                  => $proj['title'],
                        'description'            => $proj['description'],
                        'status'                 => $proj['status'],
                        'category'               => $proj['category'],
                        'responsible_institution'=> $proj['responsible_institution'] ?? null,
                        'budget'                 => $proj['budget'],
                        'funding_source'         => $proj['funding_source'],
                        'start_date'             => $proj['start_date'],
                        'end_date'               => $proj['end_date'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Project updated successfully.',
                    'activeTab' => 'projects'
                ]);
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
            $barangayProject->delete();
            DB::commit();

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Project deleted successfully!',
                    'activeTab' => 'projects'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Project could not be deleted: ' . $e->getMessage());
        }
    }
    public function projectDetails($id){
        $project = BarangayProject::findOrFail($id);
        return response()->json([
            'project' => $project,
        ]);
    }
}

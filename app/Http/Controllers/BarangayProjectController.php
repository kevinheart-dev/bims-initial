<?php

namespace App\Http\Controllers;

use App\Models\BarangayInstitution;
use App\Models\BarangayProject;
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
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, BarangayProject $barangayProject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayProject $barangayProject)
    {
        //
    }
}

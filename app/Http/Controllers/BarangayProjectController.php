<?php

namespace App\Http\Controllers;

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

        // Optional filters
        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($category = request('category')) {
            $query->where('category', $category);
        }

        if ($title = request('title')) {
            $query->where('title', 'like', "%{$title}%");
        }

        // Paginate and keep query string
        $projects = $query->paginate(10)->withQueryString();

        return response()->json([
            'projects' => $projects,
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

<?php

namespace App\Http\Controllers;

use App\Models\BarangayInfrastructure;
use App\Http\Requests\StoreBarangayInfrastructureRequest;
use App\Http\Requests\UpdateBarangayInfrastructureRequest;
use Inertia\Inertia;

class BarangayInfrastructureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;

        // Base query
        $query = BarangayInfrastructure::query()
            ->where('barangay_id', $brgy_id)
            ->orderBy('created_at', 'desc');

        // Optional filters
        if ($type = request('infrastructure_type')) {
            $query->where('infrastructure_type', $type);
        }

        if ($category = request('infrastructure_category')) {
            $query->where('infrastructure_category', $category);
        }

        if ($search = request('search')) {
            $query->where('infrastructure_type', 'like', "%{$search}%")
                ->orWhere('infrastructure_category', 'like', "%{$search}%");
        }
        // Paginate and keep query string
        $infrastructure = $query->paginate(10)->withQueryString();

        return response()->json([
            'infrastructure' => $infrastructure,
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
    public function store(StoreBarangayInfrastructureRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayInfrastructureRequest $request, BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayInfrastructure $barangayInfrastructure)
    {
        //
    }
}

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
        if (request()->filled('infra_type') && request('infra_type') !== 'All') {
            $query->where('infrastructure_type', request('infra_type'));
        }

        if (request()->filled('infra_category') && request('infra_category') !== 'All') {
            $query->where('infrastructure_category', request('infra_category'));
        }


        if (request('name')) {
            $query->where(function ($q) {
                $q->where('infrastructure_type', 'like', '%' . request('name') . '%')
                    ->orWhere('infrastructure_category', 'like', '%' . request('name') . '%');
            });
        }
        // Paginate and keep query string
        $infrastructure = $query->paginate(10)->withQueryString();
        $types = BarangayInfrastructure::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('infrastructure_type');

        $categories = BarangayInfrastructure::where('barangay_id', $brgy_id)
            ->distinct()
            ->pluck('infrastructure_category');

        return response()->json([
            'infrastructure' => $infrastructure,
            'types' => $types,
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

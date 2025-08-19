<?php

namespace App\Http\Controllers;

use App\Models\BarangayRoad;
use App\Http\Requests\StoreBarangayRoadRequest;
use App\Http\Requests\UpdateBarangayRoadRequest;

class BarangayRoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = BarangayRoad::query()->where('barangay_id', $brgy_id);

        if ($status = request('road_type')) {
            if ($status !== 'All') {
                $query->where('road_type', $status);
            }
        }

        if ($status = request('maintained_by')) {
            if ($status !== 'All') {
                $query->where('maintained_by', $status);
            }
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('length', 'like', '%' . request('name') . '%');
            });
        }

        $roads = $query->paginate(10)->withQueryString();
        $types = BarangayRoad::where('barangay_id', $brgy_id)->distinct()->pluck('road_type');
        $maintains = BarangayRoad::where('barangay_id', $brgy_id)->distinct()->pluck('maintained_by');
        return response()->json([
            'roads' => $roads,
            'types' => $types,
            'maintains' => $maintains
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
    public function store(StoreBarangayRoadRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRoadRequest $request, BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayRoad $barangayRoad)
    {
        //
    }
}

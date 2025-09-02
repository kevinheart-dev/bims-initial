<?php

namespace App\Http\Controllers;

use App\Models\BlotterReport;
use App\Http\Requests\StoreBlotterReportRequest;
use App\Http\Requests\UpdateBlotterReportRequest;
use Inertia\Inertia;

class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;
        $query = BlotterReport::query()->where("barangay_id", $brgy_id);

        $blotters = $query->get();

        return Inertia::render("BarangayOfficer/KatarungangPambarangay/Blotter/Index", [
            "blotters" => $blotters,
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
    public function store(StoreBlotterReportRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BlotterReport $blotterReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlotterReport $blotterReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlotterReportRequest $request, BlotterReport $blotterReport)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlotterReport $blotterReport)
    {
        //
    }
}

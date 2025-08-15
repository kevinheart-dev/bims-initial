<?php

namespace App\Http\Controllers;

use App\Models\BarangayInstitution;
use App\Http\Requests\StoreBarangayInstitutionRequest;
use App\Http\Requests\UpdateBarangayInstitutionRequest;

class BarangayInstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = BarangayInstitution::query()->where('barangay_id', $brgy_id);

        //dd($query->get());
        // Paginate and keep query string
        $institutions = $query->paginate(10)->withQueryString();

        return response()->json([
            'institutions' => $institutions,
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
    public function store(StoreBarangayInstitutionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayInstitutionRequest $request, BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayInstitution $barangayInstitution)
    {
        //
    }
}

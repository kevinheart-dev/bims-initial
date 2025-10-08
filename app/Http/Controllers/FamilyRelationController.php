<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\FamilyRelation;
use App\Http\Requests\StoreFamilyRelationRequest;
use App\Http\Requests\UpdateFamilyRelationRequest;
use App\Models\Purok;
use App\Models\Resident;
use Inertia\Inertia;

class FamilyRelationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFamilyRelationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFamilyRelationRequest $request, FamilyRelation $familyRelation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FamilyRelation $familyRelation)
    {
        //
    }
}

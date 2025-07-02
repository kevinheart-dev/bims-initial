<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\HouseholdResident;
use App\Models\MedicalInformation;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;



class HouseholdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        dd('hello');
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

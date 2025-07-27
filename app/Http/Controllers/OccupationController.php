<?php

namespace App\Http\Controllers;

use App\Models\Occupation;
use App\Http\Requests\StoreOccupationRequest;
use App\Http\Requests\UpdateOccupationRequest;
use App\Models\Purok;
use Inertia\Inertia;

class OccupationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->resident->barangay_id;
        $query = Occupation::with([
        'resident:id,firstname,lastname,middlename,suffix,purok_number,employment_status,barangay_id'
            ])
            ->select(
                'id',
                'resident_id',
                'occupation',
                'employment_type',
                'work_arrangement',
                'employer',
                'occupation_status',
                'is_ofw',
                'started_at',
                'ended_at'
            )
        ->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id);
        });

        if (request()->filled('name')) {
            $search = request()->input('name');

            $query->where(function ($q) use ($search) {
                $q->where('occupation', 'like', "%{$search}%")
                ->orWhereHas('resident', function ($subQuery) use ($search) {
                    $subQuery->whereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$search}%"]);
                });
            });
        }

        // Filter by employment_type
        if (request()->filled('employment_type')) {
            $query->where('employment_type', request('employment_type'));
        }

        // Filter by work_arrangement
        if (request()->filled('work_arrangement')) {
            $query->where('work_arrangement', request('work_arrangement'));
        }

        // Filter by occupation_status
        if (request()->filled('occupation_status')) {
            $query->where('occupation_status', request('occupation_status'));
        }

        // Filter by is_ofw (cast to boolean)
        if (request()->filled('is_ofw')) {
            $query->where('is_ofw', request('is_ofw'));
        }

        // Filter by started_at
        if (request()->filled('year_started')) {
            $query->where('started_at', request('year_started'));
        }

        // Filter by ended_at
        if (request()->filled('year_ended')) {
            $query->where('ended_at', request('year_ended'));
        }

        // Filter by employment_status (from resident relationship)
        if (request()->filled('employment_status')) {
            $query->whereHas('resident', function ($q) {
                $q->where('employment_status', request('employment_status'));
            });
        }

        // Filter by purok_number (from resident relationship)
        if (request()->filled('purok_number')) {
            $query->whereHas('resident', function ($q) {
                $q->where('purok_number', request('purok_number'));
            });
        }

        $puroks = Purok::where('barangay_id', operator: $brgy_id)
        ->orderBy('purok_number', 'asc')
        ->pluck('purok_number');

        $occupations = $query->get();

        return Inertia::render('BarangayOfficer/Occupation/Index', [
            'occupations' => $occupations,
            'puroks' => $puroks,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
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
    public function store(StoreOccupationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Occupation $occupation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Occupation $occupation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOccupationRequest $request, Occupation $occupation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Occupation $occupation)
    {
        //
    }
}

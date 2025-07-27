<?php

namespace App\Http\Controllers;

use App\Models\EducationalHistory;
use App\Http\Requests\StoreEducationalHistoryRequest;
use App\Http\Requests\UpdateEducationalHistoryRequest;
use App\Models\Purok;
use App\Models\Resident;
use Inertia\Inertia;

class EducationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->resident->barangay_id;
        $query = EducationalHistory::with([
        'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
        ])
        ->select(
            'id',
            'resident_id',
            'school_name',
            'school_type',
            'educational_attainment',
            'education_status',
            'year_started',
            'year_ended',
            'program'
        )
        ->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id);
        });

        if (request()->filled('name')) {
            $search = request()->input('namemarcel');
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                })
                ->orWhere('school_name', 'like', "%{$search}%")
                ->orWhere('program', 'like', "%{$search}%");
            });
        }

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('purok_number', request('purok'));
            });
        }
        if (request()->filled('educational_attainment') && request('educational_attainment') !== 'All') {
            $query->where('educational_attainment', request('educational_attainment'));
        }

        if (request()->filled('education_status') && request('education_status') !== 'All') {
            $query->where('education_status', request('education_status'));
        }

        if (request()->filled('school_type') && request('school_type') !== 'All') {
            $query->where('school_type', request('school_type'));
        }

        if (request()->filled('year_started') && request('year_started') !== 'All') {
            $query->where('year_started', request('year_started'));
        }

        if (request()->filled('year_ended') && request('year_ended') !== 'All') {
            $query->where('year_ended', request('year_ended'));
        }

        $puroks = Purok::where('barangay_id', operator: $brgy_id)
        ->orderBy('purok_number', 'asc')
        ->pluck('purok_number');

        $educations = $query->get();

        return Inertia::render('BarangayOfficer/Education/Index', [
            'educations' => $educations,
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
    public function store(StoreEducationalHistoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EducationalHistory $educationalHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EducationalHistory $educationalHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEducationalHistoryRequest $request, EducationalHistory $educationalHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EducationalHistory $educationalHistory)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Occupation;
use App\Http\Requests\StoreOccupationRequest;
use App\Http\Requests\UpdateOccupationRequest;
use App\Models\OccupationType;
use App\Models\Purok;
use App\Models\Resident;
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
        if (request()->filled('employment_type') && request('employment_type') !== 'All') {
            $query->where('employment_type', request('employment_type'));
        }

        // Filter by work_arrangement
        if (request()->filled('work_arrangement') && request('work_arrangement') !== 'All') {
            $query->where('work_arrangement', request('work_arrangement'));
        }

        // Filter by occupation_status
        if (request()->filled('occupation_status') && request('occupation_status') !== 'All') {
            $query->where('occupation_status', request('occupation_status'));
        }

        // Filter by is_ofw (cast to boolean)
        if (request()->filled('is_ofw') && request('is_ofw') !== 'All') {
            $query->where('is_ofw', request('is_ofw'));
        }

        // Filter by started_at
        if (request()->filled('year_started') && request('year_started') !== 'All') {
            $query->where('started_at', request('year_started'));
        }

        // Filter by ended_at
        if (request()->filled('year_ended') && request('year_ended') !== 'All') {
            $query->where('ended_at', request('year_ended'));
        }

        // Filter by employment_status (from resident relationship)
        if (request()->filled('employment_status') && request('employment_status') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('employment_status', request('employment_status'));
            });
        }

        // Filter by purok_number (from resident relationship)
        if (request()->filled('purok_number') && request('purok_number') !== 'All') {
            $query->whereHas('resident', function ($q) {
                $q->where('purok_number', request('purok_number'));
            });
        }

        $puroks = Purok::where('barangay_id', operator: $brgy_id)
        ->orderBy('purok_number', 'asc')
        ->pluck('purok_number');

        $occupations = $query->get();
        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate')->get();
        $occupationTypes = OccupationType::all()->pluck('name');


        return Inertia::render('BarangayOfficer/Occupation/Index', [
            'occupations' => $occupations,
            'puroks' => $puroks,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'residents' => $residents,
            'occupationTypes' => $occupationTypes,
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
        $data = $request->validated();

        $resident = Resident::findOrFail($data['resident_id']);

        try{
            $family = Family::with(['members.occupations'])->findOrFail($resident->family_id);

            $newOccupations = [];

            if (!empty($data['occupations']) && is_array($data['occupations'])) {
                foreach ($data['occupations'] as $occupationData) {
                    // Normalize income based on frequency
                    $income = match ($occupationData['income_frequency']) {
                        'monthly' => $occupationData['income'] ?? 0,
                        'weekly' => ($occupationData['income'] ?? 0) * 4,
                        'bi-weekly' => ($occupationData['income'] ?? 0) * 2,
                        'daily' => ($occupationData['income'] ?? 0) * 30,
                        'annually' => ($occupationData['income'] ?? 0) / 12,
                        default => $occupationData['income'] ?? null,
                    };

                    $newOccupations[] = [
                        'occupation' => $occupationData['occupation'] ?? null,
                        'employment_type' => $occupationData['employment_type'] ?? null,
                        'occupation_status' => $occupationData['occupation_status'] ?? null,
                        'work_arrangement' => $occupationData['work_arrangement'] ?? null,
                        'employer' => $occupationData['employer'] ?? null,
                        'is_ofw' => $occupationData['is_ofw'] ?? false,
                        'started_at' => $occupationData['started_at'],
                        'ended_at' => $occupationData['ended_at'] ?? null,
                        'monthly_income' => $income,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }

                // Save all new occupations in one go
                $resident->occupations()->createMany($newOccupations);

                // Re-fetch occupations including newly created ones
                $family->load(['members.occupations']);

                // Sum total monthly income from all members’ occupations
                $allIncomes = $family->members
                        ->flatMap(fn($m) =>
                            // Filter only active occupations
                            $m->occupations->filter(fn($occupation) =>
                                is_null($occupation->ended_at) || $occupation->ended_at >= now()
                            )
                        )
                        // Extract income values
                        ->pluck('monthly_income')
                        // Remove nulls
                        ->filter();

                $totalIncome = $allIncomes->avg();

                // Bracket classification
                $incomeBracket = match (true) {
                    $totalIncome < 5000 => 'below_5000',
                    $totalIncome <= 10000 => '5001_10000',
                    $totalIncome <= 20000 => '10001_20000',
                    $totalIncome <= 40000 => '20001_40000',
                    $totalIncome <= 70000 => '40001_70000',
                    $totalIncome <= 120000 => '70001_120000',
                    default => 'above_120001',
                };

                $incomeCategory = match (true) {
                    $totalIncome <= 10000 => 'survival',
                    $totalIncome <= 20000 => 'poor',
                    $totalIncome <= 40000 => 'low_income',
                    $totalIncome <= 70000 => 'lower_middle_income',
                    $totalIncome <= 120000 => 'middle_income',
                    $totalIncome <= 200000 => 'upper_middle_income',
                    default => 'above_high_income',
                };

                // Update family classification
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                ]);
            }

            return redirect()->route('occupation.index')->with('success', 'Occupation(s) saved and family income updated.');
        }catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Occupation(s) could not be saved: ' . $e->getMessage()]);
        }

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

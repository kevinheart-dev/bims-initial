<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use App\Http\Requests\StoreSeniorCitizenRequest;
use App\Http\Requests\UpdateSeniorCitizenRequest;
use Carbon\Carbon;
use Inertia\Inertia;

class SeniorCitizenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->resident->barangay_id;
        $today = Carbon::today();
        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');
        $query = Resident::query()
            ->select([
                'residents.id',
                'residents.firstname',
                'residents.lastname',
                'residents.middlename',
                'residents.suffix',
                'residents.birthdate',
                'residents.purok_number',
                'resident_picture_path',
            ])
            ->where('residents.barangay_id', $brgy_id)
            ->whereDate('residents.birthdate', '<=', now()->subYears(60))
            ->with(['seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone'])
            ->leftJoin('senior_citizens', 'residents.id', '=', 'senior_citizens.resident_id');

        if ($name = request('name')) {
            $query->where(function ($q) use ($name) {
                $q->where('firstname', 'like', "%{$name}%")
                    ->orWhere('lastname', 'like', "%{$name}%")
                    ->orWhere('middlename', 'like', "%{$name}%")
                    ->orWhere('suffix', 'like', "%{$name}%")
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
            });

}



        // Filters
        if (request()->filled('is_pensioner') && request('is_pensioner') !== 'All') {
            $query->where('senior_citizens.is_pensioner', request('is_pensioner'));
        }

        if (request()->filled('pension_type') && request('pension_type') !== 'All') {
            $query->where('senior_citizens.pension_type', request('pension_type'));
        }

        if (request()->filled('living_alone') && request('living_alone') !== 'All') {
            $query->where('senior_citizens.living_alone', request('living_alone'));
        }
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }
        // $seniorCitizens = $query->get();
        $seniorCitizens = $query->paginate(10)->withQueryString();
        return Inertia::render('BarangayOfficer/SeniorCitizen/Index', [
            'seniorCitizens' => $seniorCitizens,
            'puroks' => $puroks,
            'queryParams' => request()->query() ?: null,
            'success' => session('success') ?? null,
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
    public function store(StoreSeniorCitizenRequest $request)
    {
        $data = $request->validated();
        try {
            SeniorCitizen::create([
                'resident_id' => $data['resident_id'],
                'is_pensioner' => $data['is_pensioner'],
                'living_alone' => $data['living_alone'],
                'osca_id_number' => $data['is_pensioner'] === 'yes' ? $data['osca_id_number'] : null,
                'pension_type' => $data['is_pensioner'] === 'yes' ? $data['pension_type'] : null,
            ]);
            return redirect()->route('senior_citizen.index')->with('success', 'Resident registered successfully!');
        } catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Resident could not be registered: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(SeniorCitizen $seniorCitizen)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SeniorCitizen $seniorCitizen)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSeniorCitizenRequest $request, SeniorCitizen $seniorCitizen)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SeniorCitizen $seniorCitizen)
    {
        //
    }
}

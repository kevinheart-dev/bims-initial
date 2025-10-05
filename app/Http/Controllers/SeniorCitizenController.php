<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use App\Http\Requests\StoreSeniorCitizenRequest;
use App\Http\Requests\UpdateSeniorCitizenRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SeniorCitizenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        $query = Resident::query()
            ->select([
                'id',
                'firstname',
                'lastname',
                'middlename',
                'suffix',
                'birthdate',
                'purok_number',
                'resident_picture_path',
                'sex',
            ])
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->whereDate('birthdate', '<=', now()->subYears(60))
            ->with(['seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone']);

        // 🔎 Search filter
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

        // 🔎 Registered filter
        if (request()->filled('is_registered') && request('is_registered') !== 'All') {
            if (request('is_registered') === 'yes') {
                $query->whereHas('seniorcitizen');
            } elseif (request('is_registered') === 'no') {
                $query->whereDoesntHave('seniorcitizen');
            }
        }

        // 🔎 Birth month filter
        if (request()->filled('birth_month') && request('birth_month') !== 'All') {
            $month = intval(request('birth_month')); // expects 1-12
            $query->whereMonth('birthdate', $month);
        }

        // 🔎 Pensioner filter
        if (request()->filled('is_pensioner') && request('is_pensioner') !== 'All') {
            $query->whereHas('seniorcitizen', function ($q) {
                $q->where('is_pensioner', request('is_pensioner'));
            });
        }

        // 🔎 Sex filter
        if (request()->filled('sex') && request('sex') !== 'All') {
            $query->where('sex', request('sex'));
        }

        // 🔎 Pension type filter
        if (request()->filled('pension_type') && request('pension_type') !== 'All') {
            $query->whereHas('seniorcitizen', function ($q) {
                $q->where('pension_type', request('pension_type'));
            });
        }

        // 🔎 Living alone filter
        if (request()->filled('living_alone') && request('living_alone') !== 'All') {
            $query->whereHas('seniorcitizen', function ($q) {
                $q->where('living_alone', request('living_alone'));
            });
        }

        // 🔎 Purok filter
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        $seniorCitizens = $query->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/SeniorCitizen/Index', [
            'seniorCitizens' => $seniorCitizens,
            'puroks' => $puroks,
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
            return redirect()->route('senior_citizen.index')->with('success', 'Resident registered as Senior Citizen successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Resident could not be registered: ' . $e->getMessage());
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
        $data = $request->validated();
        try {
            $seniorCitizen->update([
                'resident_id' => $data['resident_id'],
                'is_pensioner' => $data['is_pensioner'],
                'living_alone' => $data['living_alone'],
                'osca_id_number' => $data['is_pensioner'] === 'yes' ? $data['osca_id_number'] : null,
                'pension_type' => $data['is_pensioner'] === 'yes' ? $data['pension_type'] : null,
            ]);
            return redirect()->route('senior_citizen.index')->with('success', 'Resident Senior Citizen details updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Resident Deatils could not be updated: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SeniorCitizen $seniorCitizen)
    {
        DB::beginTransaction();
        try {
            $seniorCitizen->delete();
            DB::commit();
            return redirect()->route('senior_citizen.index')
                ->with('success', "Record deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Record could not be deleted: ' . $e->getMessage());
        }
    }

    public function seniordetails($id)
    {
        $resident = Resident::query()
            ->select([
                'residents.id',
                'residents.firstname',
                'residents.lastname',
                'residents.middlename',
                'residents.suffix',
                'residents.birthdate',
                'residents.purok_number',
                'residents.resident_picture_path',
            ])
            ->where('residents.id', $id)
            ->with([
                'seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone'
            ])
            ->first(); // Single result

        return response()->json([
            'seniordetails' => $resident,
        ]);
    }
}

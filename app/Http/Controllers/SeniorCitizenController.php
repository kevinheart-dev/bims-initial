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
        $barangayId = auth()->user()->barangay_id;
        $request = request();

        // 🟢 Preload puroks for filters
        $puroks = Purok::where('barangay_id', $barangayId)
            ->orderBy('purok_number')
            ->pluck('purok_number');

        // 🟢 Base query for senior citizens
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
            ->where('barangay_id', $barangayId)
            ->where('is_deceased', false)
            ->whereDate('birthdate', '<=', now()->subYears(60))
            ->with(['seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone']);

        // 🟡 Search filter
        if ($name = $request->get('name')) {
            $query->where(function ($q) use ($name) {
                $like = "%{$name}%";
                $q->where('firstname', 'like', $like)
                    ->orWhere('lastname', 'like', $like)
                    ->orWhere('middlename', 'like', $like)
                    ->orWhere('suffix', 'like', $like)
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", [$like]);
            });
        }

        // 🟡 Registered filter
        $isRegistered = $request->get('is_registered');
        if ($isRegistered && $isRegistered !== 'All') {
            $method = $isRegistered === 'yes' ? 'whereHas' : 'whereDoesntHave';
            $query->{$method}('seniorcitizen');
        }

        // 🟡 Birth month filter
        if ($month = $request->integer('birth_month')) {
            $query->whereMonth('birthdate', $month);
        }

        // 🟡 Senior citizen relationship filters
        $filterMap = [
            'is_pensioner' => 'is_pensioner',
            'pension_type' => 'pension_type',
            'living_alone' => 'living_alone',
        ];

        foreach ($filterMap as $param => $column) {
            $value = $request->get($param);
            if ($value && $value !== 'All') {
                $query->whereHas('seniorcitizen', fn($q) => $q->where($column, $value));
            }
        }

        // 🟡 Sex filter
        if (($sex = $request->get('sex')) && $sex !== 'All') {
            $query->where('sex', $sex);
        }

        // 🟡 Purok filter
        if (($purok = $request->get('purok')) && $purok !== 'All') {
            $query->where('purok_number', $purok);
        }

        // 🟢 Paginate and return
        $seniorCitizens = $query->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/SeniorCitizen/Index', [
            'seniorCitizens' => $seniorCitizens,
            'puroks' => $puroks,
            'queryParams' => $request->query() ?: null,
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

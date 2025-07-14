<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Models\SeniorCitizen;
use App\Http\Requests\StoreSeniorCitizenRequest;
use App\Http\Requests\UpdateSeniorCitizenRequest;
use Inertia\Inertia;

class SeniorCitizenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = SeniorCitizen::query()
            ->whereHas('resident', function ($q) use ($brgy_id) {
                $q->where('barangay_id', $brgy_id);
                if (request()->filled('purok') && request('purok') !== 'All') {
                    $q->where('purok_number', request('purok'));
                }
                if (request('name')) {
                        $q->where('firstname', 'like', '%' . request('name') . '%')
                            ->orWhere('lastname', 'like', '%' . request('name') . '%')
                            ->orWhere('middlename', 'like', '%' . request('name') . '%')
                            ->orWhere('suffix', 'like', '%' . request('name') . '%')
                            ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, suffix) LIKE ?", ['%' . request('name') . '%']);
                            $q->where('osca_id_number', 'like', '%' . request('name') . '%');
                }
                if (request()->filled('birth_month') && request('birth_month') !== 'All') {
                    $q->whereMonth('birthdate', '=', request('birth_month'));
                }


            })
            ->with(['resident' => function ($query) use ($brgy_id) {
                $query->where('barangay_id', $brgy_id)
                    ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'birthdate', 'purok_number');
            }]);

        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');

        if (request()->filled('is_pensioner') && request('is_pensioner') !== 'All') {
            $query->where('is_pensioner', request('is_pensioner'));
        }
        if (request()->filled('pension_type') && request('pension_type') !== 'All') {
            $query->where('pension_type', request('pension_type'));
        }

        if (request()->filled('living_alone') && request('living_alone') !== 'All') {
            $query->where('living_alone', request('living_alone'));
        }

        $seniorCitizens = $query->get();
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
        //
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

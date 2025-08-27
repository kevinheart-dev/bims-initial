<?php

namespace App\Http\Controllers;

use App\Models\PregnancyRecords;
use App\Http\Requests\StorePregnancyRecordsRequest;
use App\Http\Requests\UpdatePregnancyRecordsRequest;
use App\Models\Purok;
use DB;
use Inertia\Inertia;

class PregnancyRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;
        $filters = request()->all();

        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');


        $query = PregnancyRecords::query()
            ->with([
                'resident:id,firstname,lastname,suffix,birthdate,purok_number,sex',
                'resident.medicalInformation:id,resident_id'
            ])
            ->whereHas('resident', function ($q) use ($brgy_id, $filters) {
                $q->where('barangay_id', $brgy_id);

                // ✅ Filter by Purok
                if (!empty($filters['purok']) && $filters['purok'] !== "All") {
                    $q->where('purok_number', $filters['purok']);
                }

                // ✅ Filter by Sex
                if (!empty($filters['sex']) && $filters['sex'] !== "All") {
                    $q->where('sex', $filters['sex']);
                }

                // ✅ Filter by Age Group
                if (!empty($filters['age_group']) && $filters['age_group'] !== "All") {
                    $today = now();

                    switch ($filters['age_group']) {
                        case '0_6_months':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subMonths(6),
                                $today,
                            ]);
                            break;

                        case '7mos_2yrs':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subYears(2),
                                $today->copy()->subMonths(7),
                            ]);
                            break;

                        case '3_5yrs':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subYears(5),
                                $today->copy()->subYears(3),
                            ]);
                            break;

                        case '6_12yrs':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subYears(12),
                                $today->copy()->subYears(6),
                            ]);
                            break;

                        case '13_17yrs':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subYears(17),
                                $today->copy()->subYears(13),
                            ]);
                            break;

                        case '18_59yrs':
                            $q->whereBetween('birthdate', [
                                $today->copy()->subYears(59),
                                $today->copy()->subYears(18),
                            ]);
                            break;

                        case '60_above':
                            $q->where('birthdate', '<=', $today->copy()->subYears(60));
                            break;
                    }
                }
            });

        if (request('name')) {
            $search = request('name');
            $query->where(function ($q) use ($search) {
                // Search resident fields
                $q->whereHas('resident', function ($sub) use ($search) {
                    $sub->where(function ($r) use ($search) {
                        $r->where('firstname', 'like', '%' . $search . '%')
                            ->orWhere('lastname', 'like', '%' . $search . '%')
                            ->orWhere('middlename', 'like', '%' . $search . '%')
                            ->orWhere('suffix', 'like', '%' . $search . '%')
                            ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . $search . '%'])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . $search . '%'])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ['%' . $search . '%']);
                    });
                });
            });
        }

        // ✅ Filter by Pregnancy Status
        if (!empty($filters['pregnancy_status']) && $filters['pregnancy_status'] !== "All") {
            $query->where('status', $filters['pregnancy_status']);
        }

        // ✅ Filter by Expected Due Date
        if (!empty($filters['expected_due_date'])) {
            $query->whereDate('expected_due_date', $filters['expected_due_date']);
        }

        // ✅ Filter by Delivery Date
        if (!empty($filters['delivery_date'])) {
            $query->whereDate('delivery_date', $filters['delivery_date']);
        }

        $pregnancy_records = $query->paginate(10)->withQueryString();

        return Inertia::render("BarangayOfficer/MedicalInformation/Pregnancy/Index", [
            "pregnancy_records" => $pregnancy_records,
            "puroks" => $puroks,
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
    public function store(StorePregnancyRecordsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PregnancyRecords $pregnancyRecords)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PregnancyRecords $pregnancyRecords)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePregnancyRecordsRequest $request, PregnancyRecords $pregnancyRecords)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $record = PregnancyRecords::findOrFail($id);
            $record->delete();
            DB::commit();

            return redirect()
                ->route('pregnancy.index')
                ->with(
                    'success', 'Pregnancy Record deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Pregnancy Record could not be deleted: ' . $e->getMessage());
        }
    }
}

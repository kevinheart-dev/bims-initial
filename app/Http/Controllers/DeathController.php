<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeathController extends Controller
{
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = Resident::query()
            ->select([
                'id',
                'firstname',
                'lastname',
                'middlename',
                'suffix',
                'date_of_death',
                'birthdate',
                'purok_number',
                'sex',
            ])
            ->where('barangay_id', $brgy_id)
            ->whereNotNull("date_of_death");

        if (request('name')) {
            $search = request('name');
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhere('middlename', 'like', "%{$search}%")
                    ->orWhere('suffix', 'like', "%{$search}%")
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$search}%"]);
            });
        }

        // ✅ Filters
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        if (request()->filled('sex') && request('sex') !== 'All') {
            $query->where('sex', request('sex'));
        }

        if (request()->filled('date_of_death')) {
            $query->whereDate('date_of_death', request()->date_of_death);
        }

        if (request()->filled('age_group') && request('age_group') !== 'All') {
            $ageGroup = request('age_group');

            $query->whereRaw("
                TIMESTAMPDIFF(YEAR, birthdate, date_of_death)
                BETWEEN ? AND ?
            ", $this->getAgeRange($ageGroup));
        }

        $puroks = Purok::where('barangay_id', $brgy_id)
            ->orderBy('purok_number', 'asc')
            ->pluck('purok_number');

        $deaths = $query->orderBy('date_of_death', 'desc')->paginate(10)->withQueryString();

        $residents = Resident::where('barangay_id', $brgy_id)
            ->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate')
            ->get();

        return Inertia::render("BarangayOfficer/Death/Index", [
            'deaths' => $deaths,
            'queryParams' => request()->query() ?: null,
            'puroks' => $puroks,
            'residents' => $residents
        ]);
    }

    /**
     * Return min and max values for age group filters
     */
    private function getAgeRange($group)
    {
        return match ($group) {
            '0_6_months' => [0, 0], // handle separately in query (age < 1 year but > 0 months)
            '7mos_2yrs'  => [0, 2],
            '3_5yrs'     => [3, 5],
            '6_12yrs'    => [6, 12],
            '13_17yrs'   => [13, 17],
            '18_59yrs'   => [18, 59],
            '60_above'   => [60, 200],
            default      => [0, 200],
        };
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'resident_id'   => ['required', 'exists:residents,id'],
            'date_of_death' => ['required', 'date'],
        ], [
            'resident_id.required'   => 'Please select a resident.',
            'resident_id.exists'     => 'The selected resident does not exist.',
            'date_of_death.required' => 'Please provide the date of death.',
            'date_of_death.date'     => 'The date of death must be a valid date.',
        ]);

        try {
            $resident = Resident::findOrFail($data['resident_id']);

            // Manually validate against DB birthdate
            if ($resident->birthdate && $data['date_of_death'] < $resident->birthdate) {
                return back()->withErrors([
                    'date_of_death' => 'Date of death cannot be before the birthdate.',
                ])->withInput();
            }

            $resident->update(['date_of_death' => $data['date_of_death']]);

            return redirect()
                ->route('death.index')
                ->with('success', 'Death Record saved successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Death Record could not be saved: ' . $e->getMessage()
            );
        }
    }


    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'date_of_death' => ['required', 'date'],
        ], [
            'date_of_death.required' => 'Please provide the date of death.',
            'date_of_death.date'     => 'The date of death must be a valid date.',
        ]);

        try {
            $resident = Resident::findOrFail($id);

            if ($resident->birthdate && $data['date_of_death'] < $resident->birthdate) {
                return back()->withErrors([
                    'date_of_death' => 'Date of death cannot be before the birthdate.',
                ])->withInput();
            }

            $resident->update(['date_of_death' => $data['date_of_death']]);

            return redirect()
                ->route('death.index')
                ->with('success', 'Death Record updated successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Death Record could not be updated: ' . $e->getMessage()
            );
        }
    }

    public function deathDetails($id){
        $details = Resident::query()
            ->select(['id', 'firstname', 'lastname', 'middlename', 'suffix', 'date_of_death', 'birthdate', 'purok_number', 'sex', 'resident_picture_path'])
            ->findOrFail($id);

        return response()->json([
            'details' => $details,
        ]);
    }

    public function destroy($id){
        try {
            $resident = Resident::findOrFail($id);
            $resident->update(['date_of_death' => null]);

            return redirect()
                ->route('death.index')
                ->with('success', 'Death Record deleted successfully.');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Death Record could not be deleted: ' . $e->getMessage()
            );
        }
    }

}

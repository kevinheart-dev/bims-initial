<?php

namespace App\Http\Controllers;

use App\Models\CommunityRiskAssessment;
use App\Models\CRAGeneralPopulation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CRADataController extends Controller
{
    public function population(Request $request)
    {
        // Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Check if CRA data exists for the given year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        // If CRA does not exist, clear the session and return empty data
        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/PopulationTable', [
                'populationData' => [],
            ]);
        }

        // Store or refresh CRA year in session
        session(['cra_year' => $cra->year]);

        // ✅ Get all population records linked to this CRA year
        $populationData = CRAGeneralPopulation::select(
                'c_r_a_general_populations.id',
                'c_r_a_general_populations.barangay_id',
                'c_r_a_general_populations.total_population',
                'c_r_a_general_populations.total_households',
                'c_r_a_general_populations.total_families',
                'barangays.barangay_name'
            )
            ->join('barangays', 'c_r_a_general_populations.barangay_id', '=', 'barangays.id')
            ->where('c_r_a_general_populations.cra_id', $cra->id)
            ->orderByDesc('c_r_a_general_populations.total_population') // ✅ sort descending
            ->get()
            ->map(function ($item, $index) {
                $item->number = $index + 1; // add row number
                return $item;
            });

        // Return to Inertia view
        return Inertia::render('CDRRMO/CRA/PopulationTable', [
            'populationData' => $populationData,
        ]);
    }
}

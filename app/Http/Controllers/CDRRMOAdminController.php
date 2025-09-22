<?php

namespace App\Http\Controllers;

use App\Models\CRAPopulationGender;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAPopulationAgeGroup;
use App\Models\Barangay;
use Inertia\Inertia;
use Illuminate\Http\Request;
use DB;

class CDRRMOAdminController extends Controller
{
    public function index(Request $request)
    {
        $barangayId = $request->query('barangay_id'); // ✅ optional filter

        if ($barangayId) {
            // 📌 Filter by specific barangay
            $totalPopulation = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('gender')
                ->get();
        } else {
            // 📌 Default → Ilagan City (sum of all barangays)
            $totalPopulation = CRAGeneralPopulation::sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->groupBy('gender')
                ->get();
        }

        // ✅ Barangays list for dropdown
        $barangays = Barangay::select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/Dashboard', [
            'totalPopulation' => $totalPopulation,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies'   => $totalFamilies,
            'ageDistribution' => $ageDistribution,
            'genderData'      => $genderData,
            'barangays'       => $barangays,
            'selectedBarangay' => $barangayId, // send selected
        ]);
    }
}

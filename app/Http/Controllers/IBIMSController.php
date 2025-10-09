<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Barangay;
use App\Models\Resident;
use App\Models\Family;

class IBIMSController extends Controller
{
    public function welcome()
    {

        // Base query for residents (alive only)
        $residentBaseQuery = Resident::where('is_deceased', false);
        $familyBaseQuery = new Family();

        $totalFamilies = $familyBaseQuery->count();

        $populationPerBarangay = Barangay::select(
            'barangays.barangay_name',
            DB::raw('COUNT(residents.id) as population')
        )
            ->leftJoin('residents', function ($join) {
                $join->on('barangays.id', '=', 'residents.barangay_id')
                    ->where(function ($q) {
                        $q->where('residents.is_deceased', false)
                            ->orWhereNull('residents.is_deceased');
                    });
            })
            ->groupBy('barangays.barangay_name')
            ->orderBy('barangays.barangay_name')
            ->get();


        // Population per barangay
        $populationPerBarangay = Barangay::select(
            'barangays.barangay_name',
            DB::raw('COUNT(residents.id) as population')
        )
            ->leftJoin('residents', function ($join) {
                $join->on('barangays.id', '=', 'residents.barangay_id')
                    ->where(function ($q) {
                        $q->where('residents.is_deceased', false)
                            ->orWhereNull('residents.is_deceased');
                    });
            })
            ->groupBy('barangays.barangay_name')
            ->orderBy('barangays.barangay_name')
            ->get();

        // Define age groups (for distribution)
        $ageGroups = [
            '0-6 months' => [0, 0.5],
            '7 mos. to 2 years old' => [0.6, 2],
            '3-5 years old' => [3, 5],
            '6-12 years old' => [6, 12],
            '13-17 years old' => [13, 17],
            '18-59 years old' => [18, 59],
            '60 years old and above' => [60, 200],
        ];

        // Compute age group distribution
        $ageDistributionData = [];
        foreach ($ageGroups as $label => [$min, $max]) {
            $ageDistributionData[$label] = (clone $residentBaseQuery)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        // Define age categories
        $ageCategories = [
            'Child' => [0, 14],
            'Youth' => [15, 30],
            'Adult' => [31, 59],
            'Senior' => [60, 200],
        ];

        // Compute age category distribution
        $ageCategoryData = [];
        foreach ($ageCategories as $label => [$min, $max]) {
            $ageCategoryData[$label] = (clone $residentBaseQuery)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        $familyIncomeData = (clone $familyBaseQuery)
            ->select('income_bracket', DB::raw('COUNT(*) as total'))
            ->groupBy('income_bracket')
            ->get()
            ->map(function ($item) {
                $labels = [
                    'below_5000' => 'Survival',
                    '5001_10000' => 'Poor',
                    '10001_20000' => 'Low Income',
                    '20001_40000' => 'Lower Middle Income',
                    '40001_70000' => 'Middle Income',
                    '70001_120000' => 'Upper Middle Income',
                    'above_120001' => 'High Income',
                ];
                return [
                    'income_bracket' => $item->income_bracket,
                    'income_category' => $labels[$item->income_bracket] ?? 'Unknown',
                    'total' => $item->total,
                ];
            });

        // Employment Status
        $employmentStatusData = (clone $residentBaseQuery)
            ->selectRaw('employment_status, COUNT(*) as count')
            ->groupBy('employment_status')
            ->pluck('count', 'employment_status');


        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,

            'populationPerBarangay' => $populationPerBarangay,
            'ageCategoryData' => $ageCategoryData,
            'ageDistributionData' => $ageDistributionData,
            'familyIncomeData' => $familyIncomeData,
            'employmentStatusData' => $employmentStatusData,
        ]);
    }
}

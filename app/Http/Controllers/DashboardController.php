<?php

namespace App\Http\Controllers;

use App\Models\EducationalHistory;
use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class DashboardController extends Controller
{
    public function dashboard()
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangayName = auth()->user()->barangay
            ? auth()->user()->barangay->barangay_name
            : 'Barangay Name';

        // ✅ exclude dead residents
        $residentCount = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->count();

        // ✅ count senior citizens by age, not by SeniorCitizen table (keeps data consistent)
        $seniorCitizenCount = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 60")
            ->count();

        $totalHouseholds = Household::where('barangay_id', $brgy_id)->count();
        $totalFamilies = Family::where('barangay_id', $brgy_id)->count();

        $genderDistribution = Resident::select('gender')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        $sexDistibution = Resident::select('sex')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('sex, COUNT(*) as count')
            ->groupBy('sex')
            ->pluck('count', 'sex');

        $populationPerPurok = Resident::selectRaw('purok_number, COUNT(*) as count')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->groupBy('purok_number')
            ->pluck('count', 'purok_number');

        $civilStatusDistribution = Resident::select('civil_status')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('civil_status, COUNT(*) as count')
            ->groupBy('civil_status')
            ->pluck('count', 'civil_status');


        $ageGroups = [
            '0-6 months' => [0, 0.5],
            '7 mos. to 2 years old' => [0.6, 2],
            '3-5 years old' => [3, 5],
            '6-12 years old' => [6, 12],
            '13-17 years old' => [13, 17],
            '18-59 years old' => [18, 59],
            '60 years old and above' => [60, 200],
        ];

        $ageDistribution = [];
        foreach ($ageGroups as $label => [$min, $max]) {
            $ageDistribution[$label] = Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        $ageCategories = [
            'Child' => [0, 14],
            'Youth' => [15, 30],
            'Adult' => [31, 59],
            'Senior' => [60, 200],
        ];

        $ageCategory = [];
        foreach ($ageCategories as $label => [$min, $max]) {
            $ageCategory[$label] = Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        $pwdDistribution = [
            'PWD' => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->whereHas('disabilities')
                ->count(),
            'nonPWD' => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->whereDoesntHave('disabilities')
                ->count(),
        ];

        $employmentStatusDistribution = Resident::select('employment_status')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('employment_status, COUNT(*) as count')
            ->groupBy('employment_status')
            ->pluck('count', 'employment_status');

        $voterDistribution = [
            'Registered Voters' => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->where('registered_voter', 1)
                ->count(),

            'Unregistered Voters' => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', false)
                ->where('registered_voter', 0)
                ->count(),
        ];

        $familyIncome = Family::where('barangay_id', $brgy_id)
            ->select('income_bracket', DB::raw('COUNT(*) as family_count'))
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
                $item->income_category = $labels[$item->income_bracket] ?? 'Unknown';
                return $item;
            });

        $educationData = EducationalHistory::join('residents', 'educational_histories.resident_id', '=', 'residents.id')
            ->where('residents.barangay_id', $brgy_id)
            ->select('educational_attainment', 'education_status', DB::raw('COUNT(*) as total_count'))
            ->groupBy('educational_attainment', 'education_status')
            ->get()
            ->map(function ($item) {
                $educationLabels = [
                    'no_formal_education' => 'No Formal Education',
                    'no_education_yet' => 'No Education Yet',
                    'prep_school' => 'Prep School',
                    'kindergarten' => 'Kindergarten',
                    'tesda' => 'TESDA',
                    'junior_high_school' => 'Junior High School',
                    'senior_high_school' => 'Senior High School',
                    'elementary' => 'Elementary',
                    'high_school' => 'High School',
                    'college' => 'College',
                    'post_graduate' => 'Post Graduate',
                    'vocational' => 'Vocational',
                    'als' => 'ALS (Alternative Learning System)',
                ];

                $statusLabels = [
                    'graduated' => 'Graduated',
                    'enrolled' => 'Currently Enrolled',
                    'incomplete' => 'Incomplete',
                    'dropped_out' => 'Dropped Out',
                ];

                $item->educational_attainment_label = $educationLabels[$item->educational_attainment] ?? 'Unknown';
                $item->education_status_label = $statusLabels[$item->education_status] ?? 'Unknown';

                return $item;
            });

        $ethnicityDistribution = DB::table('residents')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->selectRaw('IFNULL(NULLIF(ethnicity, ""), "Unknown") AS ethnicity, COUNT(*) AS total')
            ->groupBy('ethnicity')
            ->orderByDesc('total')
            ->pluck('total', 'ethnicity');


        $fourPsDistribution = DB::table('social_welfare_profiles as swp')
            ->join('residents as r', 'swp.resident_id', '=', 'r.id')
            ->where('swp.barangay_id', $brgy_id)
            ->whereNull('r.date_of_death')
            ->select('swp.is_4ps_beneficiary', DB::raw('COUNT(*) as total'))
            ->groupBy('swp.is_4ps_beneficiary')
            ->pluck('total', 'swp.is_4ps_beneficiary');

        $fourPsDistribution = [
            1 => $fourPsDistribution[1] ?? 0,
            0 => $fourPsDistribution[0] ?? 0,
        ];

        $soloParentDistribution = DB::table('social_welfare_profiles as swp')
            ->join('residents as r', 'swp.resident_id', '=', 'r.id')
            ->where('swp.barangay_id', $brgy_id)
            ->whereNull('r.date_of_death')
            ->select('swp.is_solo_parent', DB::raw('COUNT(*) as total'))
            ->groupBy('swp.is_solo_parent')
            ->pluck('total', 'swp.is_solo_parent');

        $soloParentDistribution = [
            1 => $soloParentDistribution[1] ?? 0, // Solo Parents
            0 => $soloParentDistribution[0] ?? 0, // Non-Solo Parents
        ];



        return Inertia::render('BarangayOfficer/Dashboard', [
            'barangayName' => $barangayName,
            'residentCount' => $residentCount,
            'seniorCitizenCount' => $seniorCitizenCount,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies' => $totalFamilies,
            'genderDistribution' => $genderDistribution,
            'sexDistribution' => $sexDistibution,
            'populationPerPurok' => $populationPerPurok,
            'ageDistribution' => $ageDistribution,
            'ageCategory' => $ageCategory,
            'pwdDistribution' => $pwdDistribution,
            'employmentStatusDistribution' => $employmentStatusDistribution,
            'civilStatusDistribution' => $civilStatusDistribution,
            'voterDistribution' => $voterDistribution,
            'familyIncome' => $familyIncome,
            'educationData' => $educationData,
            'ethnicityDistribution' => $ethnicityDistribution,
            'fourPsDistribution' => $fourPsDistribution,
            'soloParentDistribution' => $soloParentDistribution,
        ]);
    }
}

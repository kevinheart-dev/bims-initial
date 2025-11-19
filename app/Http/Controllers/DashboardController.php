<?php

namespace App\Http\Controllers;

use App\Models\EducationalHistory;
use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
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

        // ✅ All counts exclude deceased
        $residentCount = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->count();

        $seniorCitizenCount = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 60")
            ->count();

        $totalHouseholds = Household::where('barangay_id', $brgy_id)->count();
        $totalFamilies = Family::where('barangay_id', $brgy_id)->count();

        $genderDistribution = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        $sexDistibution = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('sex, COUNT(*) as count')
            ->groupBy('sex')
            ->pluck('count', 'sex');

        $populationPerPurok = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('purok_number, COUNT(*) as count')
            ->groupBy('purok_number')
            ->pluck('count', 'purok_number');

        $civilStatusDistribution = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('civil_status, COUNT(*) as count')
            ->groupBy('civil_status')
            ->pluck('count', 'civil_status');

        // ✅ Age groups exclude deceased
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
            1 => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', 0)
                ->where('is_pwd', 1)
                ->count(),


            0 => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', 0)
                ->where('is_pwd', 0)
                ->count(),
        ];
        $employmentStatusDistribution = Resident::where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->selectRaw('employment_status, COUNT(*) as count')
            ->groupBy('employment_status')
            ->pluck('count', 'employment_status');

        $voterDistribution = [
            1 => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', 0)
                ->where('registered_voter', 1)
                ->count(),

            0 => Resident::where('barangay_id', $brgy_id)
                ->where('is_deceased', 0)
                ->where('registered_voter', 0)
                ->count(),
        ];

        $familyIncome = Family::where('barangay_id', $brgy_id)
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


        $educationData = EducationalHistory::join('residents', 'educational_histories.resident_id', '=', 'residents.id')
            ->where('residents.barangay_id', $brgy_id)
            ->where('residents.is_deceased', false)
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
                    'senior_high_school' => 'Senior HS',
                    'elementary' => 'Elementary',
                    'high_school' => 'High School',
                    'college' => 'College',
                    'post_graduate' => 'Post Graduate',
                    'vocational' => 'Vocational',
                    'als' => 'ALS',
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
            ->where('is_deceased', false)
            ->selectRaw('IFNULL(NULLIF(ethnicity, ""), "Unknown") AS ethnicity, COUNT(*) AS total')
            ->groupBy('ethnicity')
            ->orderByDesc('total')
            ->pluck('total', 'ethnicity');



        $soloParents = DB::table('social_welfare_profiles as swp')
            ->join('residents as r', 'swp.resident_id', '=', 'r.id')
            ->where('r.barangay_id', $brgy_id)
            ->where('r.is_deceased', false)
            ->where('swp.is_solo_parent', true)
            ->count();

        $totalResidents = DB::table('residents')
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->count();

        $soloParentCount = $soloParents;
        $nonSoloParentCount = $totalResidents - $soloParents;

        $soloParentDistribution = [
            1 => $soloParentCount,
            0 => $nonSoloParentCount,
        ];

        $fourPsBeneficiaries = DB::table('social_welfare_profiles as swp')
            ->join('residents as r', 'swp.resident_id', '=', 'r.id')
            ->where('r.barangay_id', $brgy_id)
            ->where('r.is_deceased', false)
            ->where('swp.is_4ps_beneficiary', true)
            ->count();


        $nonFourPsBeneficiaries = $totalResidents - $fourPsBeneficiaries;

        $fourPsDistribution = [
            1 => $fourPsBeneficiaries,
            0 => $nonFourPsBeneficiaries,
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

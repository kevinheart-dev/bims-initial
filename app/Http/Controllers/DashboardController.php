<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            ->whereNull('date_of_death')
            ->count();

        // ✅ count senior citizens by age, not by SeniorCitizen table (keeps data consistent)
        $seniorCitizenCount = Resident::where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 60")
            ->count();

        $totalHouseholds = Household::where('barangay_id', $brgy_id)->count();
        $totalFamilies = Family::where('barangay_id', $brgy_id)->count();

        $genderDistribution = Resident::select('gender')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        $sexDistibution = Resident::select('sex')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->selectRaw('sex, COUNT(*) as count')
            ->groupBy('sex')
            ->pluck('count', 'sex');

        $populationPerPurok = Resident::selectRaw('purok_number, COUNT(*) as count')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->groupBy('purok_number')
            ->pluck('count', 'purok_number');

        $civilStatusDistribution = Resident::select('civil_status')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
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
                ->whereNull('date_of_death')
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
                ->whereNull('date_of_death')
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        $pwdDistribution = [
            'PWD' => Resident::where('barangay_id', $brgy_id)
                ->whereNull('date_of_death')
                ->whereHas('disabilities')
                ->count(),
            'nonPWD' => Resident::where('barangay_id', $brgy_id)
                ->whereNull('date_of_death')
                ->whereDoesntHave('disabilities')
                ->count(),
        ];

        $employmentStatusDistribution = Resident::select('employment_status')
            ->where('barangay_id', $brgy_id)
            ->whereNull('date_of_death')
            ->selectRaw('employment_status, COUNT(*) as count')
            ->groupBy('employment_status')
            ->pluck('count', 'employment_status');

        $voterDistribution = [
            'Registered Voters' => Resident::where('barangay_id', $brgy_id)
                ->whereNull('date_of_death')
                ->where('registered_voter', 1)
                ->count(),

            'Unregistered Voters' => Resident::where('barangay_id', $brgy_id)
                ->whereNull('date_of_death')
                ->where('registered_voter', 0)
                ->count(),
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
        ]);
    }
}

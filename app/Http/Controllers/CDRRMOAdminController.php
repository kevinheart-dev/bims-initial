<?php

namespace App\Http\Controllers;

use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CDRRMOAdminController extends Controller
{
    public function index()
    {
        $residentCount = Resident::query()->count();
        $seniorCitizenCount = SeniorCitizen::whereHas('resident')->count();
        $totalHouseholds = Household::query()->count();
        $totalFamilies = Family::query()->count();

        $genderDistribution = Resident::select('gender')
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        $populationPerPurok = Resident::selectRaw('purok_number, COUNT(*) as count')
            ->groupBy('purok_number')
            ->pluck('count', 'purok_number');

        // 🎯 Age group distribution
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
            $ageDistribution[$label] = Resident::whereRaw(
                "TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?",
                [$min, $max]
            )->count();
        }

        $pwdDistribution = [
            'PWD' => Resident::whereHas('disabilities')->count(),
            'nonPWD' => Resident::whereDoesntHave('disabilities')->count(),
        ];

        return Inertia::render('CDRRMO/Dashboard', [
            'residentCount' => $residentCount,
            'seniorCitizenCount' => $seniorCitizenCount,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies' => $totalFamilies,
            'genderDistribution' => $genderDistribution,
            'populationPerPurok' => $populationPerPurok,
            'ageDistribution' => $ageDistribution,
            'pwdDistribution' => $pwdDistribution,
        ]);
    }
}

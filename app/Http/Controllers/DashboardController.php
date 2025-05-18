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
        $residentCount = Resident::where('barangay_id', auth()->user()->barangay_id)->count();
        $seniorCitizenCount = SeniorCitizen::whereHas('resident', function ($query) {
            $query->where('barangay_id', auth()->user()->barangay_id);
        })->count();
        $totalHouseholds = Household::query()->where('barangay_id', auth()->user()->barangay_id)->count();
        $totalFamilies = Family::query()->where('barangay_id', auth()->user()->barangay_id)->count();

        return Inertia::render('BarangayOfficer/Dashboard', [
            'residentCount' => $residentCount,
            'seniorCitizenCount' => $seniorCitizenCount,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies' => $totalFamilies,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayProfileController extends Controller
{
    public function index()
    {
        return Inertia::render("BarangayOfficer/BarangayProfile/BarangayProfileMain");
    }
    // public function barangayDetails()
    // {
    //     $barangayId = Auth()->user()->barangay_id;
    //     $barangay = Barangay::findOrFail($barangayId);

    //     return response()->json([
    //         'data' => $barangay,
    //     ]);
    // }
}

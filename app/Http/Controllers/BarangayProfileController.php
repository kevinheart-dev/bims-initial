<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayProfileController extends Controller
{
    public function index()
    {
        $bid = auth()->user()->barangay_id;
        $data = Barangay::findOrFail($bid);
        return Inertia::render('BarangayOfficer/BarangayProfile/Index', [
            'barangay' => $data
        ]);
    }

    public function update()
    {
        dd('yes');
    }
}

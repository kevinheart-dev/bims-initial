<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;

class BarangayProfileController extends Controller
{
    public function barangayDetails()
    {
        $barangayId = auth()->user()->resident->barangay_id;
        $barangay = Barangay::findOrFail($barangayId);

        return response()->json([
            'data' => $barangay,
        ]);
    }
}

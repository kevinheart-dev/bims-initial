<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Http\Requests\StoreBarangayRequest;
use App\Http\Requests\UpdateBarangayRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Barangay::query();

        // Filter by name (partial match)
        if ($request->filled('name')) {
            $query->where('barangay_name', 'like', '%' . $request->name . '%');
        }

        // Filter by type
        if ($request->filled('brgy_type') && $request->brgy_type !== 'All') {
            $query->where('barangay_type', $request->brgy_type);
        }

        // You can add more filters here as needed

        // Paginate results
        $barangays = $query->orderBy('barangay_name')->get(); // or ->paginate(10);

        return Inertia::render('SuperAdmin/Barangay/Index', [
            'queryParams' => $request->query(),
            'barangays' => $barangays,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBarangayRequest $request)
    {
        dd($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Barangay $barangay)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Barangay $barangay)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRequest $request, Barangay $barangay)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barangay $barangay)
    {
        //
    }
}

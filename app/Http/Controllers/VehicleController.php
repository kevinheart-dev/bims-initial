<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Models\Resident;
use App\Models\Vehicle;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->resident->barangay_id;
        $puroks = Purok::where('barangay_id', $brgy_id)->orderBy('purok_number', 'asc')->pluck('purok_number');

        $query = Resident::where('barangay_id', $brgy_id)
            ->whereHas('vehicles')
            ->with(['vehicles' => function ($query) {
                $query->select('id', 'resident_id', 'vehicle_type', 'vehicle_class', 'usage_status', 'is_registered');

                if (request()->filled('v_type') && request('v_type') !== 'All') {
                    $query->where('vehicle_type', request('v_type'));
                }
                if (request()->filled('v_class') && request('v_class') !== 'All') {
                    $query->where('vehicle_class', request('v_class'));
                }
                if (request()->filled('usage') && request('usage') !== 'All') {
                    $query->where('usage_status', request('usage'));
                }
            }])
            ->select('id', 'barangay_id', 'firstname', 'lastname', 'middlename', 'suffix', 'purok_number');

        // handles purok filtering
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->where('purok_number', request('purok'));
        }

        // handle search bar
        if (request('name')) {
            $query->where(function ($q) {
                $q->where('firstname', 'like', '%' . request('name') . '%')
                    ->orWhere('lastname', 'like', '%' . request('name') . '%')
                    ->orWhere('middlename', 'like', '%' . request('name') . '%')
                    ->orWhere('suffix', 'like', '%' . request('name') . '%')
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ['%' . request('name') . '%'])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, suffix) LIKE ?", ['%' . request('name') . '%']);
            });
        }

        $residentsWithVehicles = $query->get();
        // convert to single array
        $vehicles = [];
        $vehicle_types = [];

        foreach ($residentsWithVehicles as $resident) {
            foreach ($resident->vehicles as $vehicle) {
                $vehicles[] = [
                    'vehicle_id'    => $vehicle->id,
                    'resident_id'   => $resident->id,
                    'barangay_id'   => $resident->barangay_id,
                    'firstname'     => $resident->firstname,
                    'middlename'    => $resident->middlename,
                    'lastname'      => $resident->lastname,
                    'suffix'        => $resident->suffix,
                    'purok_number'  => $resident->purok_number,
                    'vehicle_type'  => $vehicle->vehicle_type,
                    'vehicle_class' => $vehicle->vehicle_class,
                    'usage_status'  => $vehicle->usage_status,
                    'quantity'      => $vehicle->quantity,
                ];
                if(!in_array($vehicle->vehicle_type, $vehicle_types)){
                    $vehicle_types[] = $vehicle->vehicle_type;
                }
            }
        }

        $residents = Resident::where('barangay_id', $brgy_id)->select('id', 'firstname', 'lastname', 'middlename', 'suffix', 'resident_picture_path', 'purok_number', 'birthdate')->get();
        return Inertia::render("BarangayOfficer/Vehicle/Index", [
            'puroks' => $puroks,
            'vehicles' => $vehicles,
            'vehicle_types' => $vehicle_types,
            'queryParams' => request()->query() ?: null,
            'residents' => $residents,
            'success' => session('success') ?? null,
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
    public function store(StoreVehicleRequest $request)
    {
        $data = $request->validated();
        try{
            foreach ($data['vehicles'] as $vehicle) {
                Vehicle::create([
                    'resident_id'    => $data['resident_id'],
                    'vehicle_type'   => $vehicle['vehicle_type'],
                    'vehicle_class'  => $vehicle['vehicle_class'],
                    'usage_status'   => $vehicle['usage_status'],
                    'is_registered'       => $vehicle['is_registered'],
                ]);
            }
            return redirect()->route('vehicle.index')->with('success', 'Vehicle addded successfully!');
        }catch (\Exception $e) {
            dd($e->getMessage());
            return back()->withErrors(['error' => 'Residents Household could not be created: ' . $e->getMessage()]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        //
    }
}

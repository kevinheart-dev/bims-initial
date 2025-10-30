<?php

namespace App\Http\Controllers;

use App\Models\BodiesOFWater;
use App\Http\Requests\StoreBodiesOFWaterRequest;
use App\Http\Requests\UpdateBodiesOFWaterRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WaterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = BodiesOfWater::where('barangay_id', $brgy_id);

        // ✅ Pagination with query string preservation
        $bodiesOfWater = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/Water/Index', [
            'bodiesOfWater' => $bodiesOfWater,
            'queryParams' => request()->query() ?: null,
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
    public function store(StoreBodiesOFWaterRequest $request)
    {
        $data = $request->validated();

        try {
            foreach ($data['bodiesOfWater'] as $water) {
                BodiesOFWater::create([
                    'barangay_id' => $data['barangay_id'] ?? auth()->user()->barangay_id, // optional if barangay-based
                    'name' => $water['name'],
                    'type' => $water['type'],
                    'exists' => true,
                ]);
            }

            return redirect()
                ->route('water.index')
                ->with('success', 'Bodies of Water added successfully!');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Bodies of Water could not be added: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BodiesOFWater $bodiesOFWater)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BodiesOFWater $bodiesOFWater)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBodiesOFWaterRequest $request)
    {
        $data = $request->validated();
        try {
            foreach ($data['bodiesOfWater'] as $water) {
                $body = BodiesOfWater::find($data['water_id']); // make sure 'id' is sent in the array
                if ($body) {
                    $body->update([
                        'name' => $water['name'],
                        'type' => $water['type'],
                    ]);
                }
            }

            return redirect()->route('water.index')->with('success', 'Bodies of Water updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Could not update Bodies of Water: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $bodiesOFWater = BodiesOfWater::where('id', $id)
        ->first();
        DB::beginTransaction();
        try {
            $bodiesOFWater->delete();
            DB::commit();
            return redirect()->route('water.index')
                ->with('success', "Body of Water record deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Record could not be deleted: ' . $e->getMessage());
        }
    }

    public function waterDetails($id)
    {
        $water = BodiesOfWater::where('id', $id)
        ->first();

        return response()->json([
            'water' => $water,
        ]);
    }
}

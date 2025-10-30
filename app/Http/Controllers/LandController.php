<?php

namespace App\Http\Controllers;

use App\Models\BodiesOFLand;
use App\Http\Requests\StoreBodiesOFLandRequest;
use App\Http\Requests\UpdateBodiesOFLandRequest;
use App\Models\BodiesOfWater;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = BodiesOFLand::where('barangay_id', $brgy_id);

        // ✅ Pagination with query string preservation
        $bodiesOfLand = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/Land/Index', [
            'bodiesOfLand' => $bodiesOfLand,
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
    public function store(StoreBodiesOFLandRequest $request)
    {
        $data = $request->validated();
        try {
            foreach ($data['bodiesOfLand'] as $water) {
                BodiesOfLand::create([
                    'barangay_id' => $data['barangay_id'] ?? auth()->user()->barangay_id, // optional if barangay-based
                    'name' => $water['name'],
                    'type' => $water['type'],
                    'exists' => true,
                ]);
            }

            return redirect()
                ->route('land.index')
                ->with('success', 'Bodies of Land added successfully!');
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Bodies of Land could not be added: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BodiesOFLand $bodiesOFLand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BodiesOFLand $bodiesOFLand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBodiesOFLandRequest $request)
    {
        $data = $request->validated();
        try {
            foreach ($data['bodiesOfLand'] as $land) {
                $body = BodiesOfLand::find($data['land_id']); // make sure 'id' is sent in the array
                if ($body) {
                    $body->update([
                        'name' => $land['name'],
                        'type' => $land['type'],
                    ]);
                }
            }

            return redirect()->route('land.index')->with('success', 'Bodies of Water updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Could not update Bodies of Water: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $bodiesOFWater = BodiesOFLand::where('id', $id)
        ->first();
        DB::beginTransaction();
        try {
            $bodiesOFWater->delete();
            DB::commit();
            return redirect()->route('land.index')
                ->with('success', "Body of Land record deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Record could not be deleted: ' . $e->getMessage());
        }
    }

    public function landDetails($id)
    {
        $land = BodiesOfLand::where('id', $id)
        ->first();

        return response()->json([
            'land' => $land,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\BarangayRoad;
use App\Http\Requests\StoreBarangayRoadRequest;
use App\Http\Requests\UpdateBarangayRoadRequest;
use DB;
use Str;

class BarangayRoadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = BarangayRoad::query()->where('barangay_id', $brgy_id);

        if ($status = request('road_type')) {
            if ($status !== 'All') {
                $query->where('road_type', $status);
            }
        }
        if ($status = request('maintained_by')) {
            if ($status !== 'All') {
                $query->where('maintained_by', $status);
            }
        }
        if ($status = request('status')) {
            if ($status !== 'All') {
                $query->where('status', $status);
            }
        }
        if ($condition = request('condition')) {
            if ($condition !== 'All') {
                $query->where('condition', $condition);
            }
        }
        if (request('name')) {
            $query->where(function ($q) {
                $q->where('length', 'like', '%' . request('name') . '%');
            });
        }

        $roads = $query->paginate(10)->withQueryString();
        $types = BarangayRoad::where('barangay_id', $brgy_id)->distinct()->pluck('road_type');
        $maintains = BarangayRoad::where('barangay_id', $brgy_id)->distinct()->pluck('maintained_by');
        return response()->json([
            'roads' => $roads,
            'types' => $types,
            'maintains' => $maintains
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
    public function store(StoreBarangayRoadRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $data = $request->validated();

        try {
            if (!empty($data['roads']) && is_array($data['roads'])) {
                foreach ($data['roads'] as $road) {

                    $imagePath = $road['road_image'] ?? null;

                    // If it's a file upload, store it
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'road/' . Str::slug($road['road_type']) . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    BarangayRoad::create([
                        'barangay_id'   => $brgy_id,
                        'road_image'    => $imagePath,
                        'road_type'     => $road['road_type'],
                        'length'        => $road['length'],
                        'condition'     => $road['condition'],
                        'status'        => $road['status'],
                        'maintained_by' => $road['maintained_by'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Road(s) saved successfully.',
                    'activeTab' => 'roads'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Road(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayRoad $barangayRoad)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayRoadRequest $request, BarangayRoad $barangayRoad)
    {
        $data = $request->validated();

        try {
            if (!empty($data['roads']) && is_array($data['roads'])) {
                foreach ($data['roads'] as $road) {

                    $imagePath = $road['road_image'] ?? $barangayRoad->road_image;

                    // If it's a file upload, store it
                    if ($imagePath instanceof \Illuminate\Http\UploadedFile) {
                        $folder = 'road/' . Str::slug($road['road_type']) . Str::random(10);
                        $imagePath = $imagePath->store($folder, 'public');
                    }

                    $barangayRoad->update([
                        'road_type'     => $road['road_type'],
                        'road_image'    => $imagePath,
                        'length'        => $road['length'],
                        'condition'     => $road['condition'],
                        'status'        => $road['status'],
                        'maintained_by' => $road['maintained_by'] ?? null,
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Road updated successfully.',
                    'activeTab' => 'roads'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Road could not be updated: ' . $e->getMessage()
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayRoad $barangayRoad)
    {
        DB::beginTransaction();
        try {
            $barangayRoad->delete();
            DB::commit();
            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Road deleted successfully!',
                    'activeTab' => 'roads'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Road could not be deleted: ' . $e->getMessage());
        }
    }
    public function roadDetails($id){
        $road = BarangayRoad::findOrFail($id);
        return response()->json([
            'road' => $road,
        ]);
    }
}

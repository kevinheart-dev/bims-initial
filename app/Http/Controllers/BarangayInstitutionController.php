<?php

namespace App\Http\Controllers;

use App\Models\BarangayInstitution;
use App\Http\Requests\StoreBarangayInstitutionRequest;
use App\Http\Requests\UpdateBarangayInstitutionRequest;
use Illuminate\Support\Facades\DB;

class BarangayInstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;
        $query = BarangayInstitution::query()->where('barangay_id', $brgy_id)->distinct();



        if (request()->filled('institution') && request('institution') !== 'All') {
            $query->where('name', request('institution'));
        }

        if (request('name')) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . request('name') . '%');
            });
        }

        $institutions = $query->paginate(10)->withQueryString();

        return response()->json([
            'institutions' => $institutions,
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
    public function store(StoreBarangayInstitutionRequest $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $data = $request->validated();
        try {
            if (!empty($data['institutions']) && is_array($data['institutions'])) {
                foreach ($data['institutions'] as $insti) {
                    BarangayInstitution::create([
                        'barangay_id'        => $brgy_id,
                        'name'               => $insti['name'],
                        'type'               => $insti['type'],
                        'year_established'   => $insti['year_established'],
                        'status'             => $insti['status'],
                        'description'        => $insti['description'],
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Institution(s) saved successfully.',
                    'activeTab' => 'institutions'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Institution(s) could not be saved: ' . $e->getMessage()
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BarangayInstitution $barangayInstitution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBarangayInstitutionRequest $request, BarangayInstitution $barangayInstitution)
    {
        $data = $request->validated();
        try {
            if (!empty($data['institutions']) && is_array($data['institutions'])) {
                foreach ($data['institutions'] as $insti) {
                    $barangayInstitution->update([
                        'name'             => $insti['name'],
                        'type'             => $insti['type'],
                        'year_established' => $insti['year_established'],
                        'status'           => $insti['status'],
                        'description'      => $insti['description'],
                    ]);
                }
            }

            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Institution updated successfully.',
                    'activeTab' => 'institutions'
                ]);
        } catch (\Exception $e) {
            return back()->with(
                'error',
                'Institution could not be updated: ' . $e->getMessage()
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayInstitution $barangayInstitution)
    {
        DB::beginTransaction();
        try {
            $barangayInstitution->delete();
            DB::commit();
            return redirect()
                ->route('barangay_profile.index')
                ->with([
                    'success' => 'Institution deleted successfully!',
                    'activeTab' => 'institutions'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Institution could not be deleted: ' . $e->getMessage());
        }
    }

    public function institutionDetails($id){
        $institution = BarangayInstitution::findOrFail($id);
        return response()->json([
            'institution' => $institution,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\BarangayProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BarangayInfrastructure;

class BarangayProfileController extends Controller
{
    public function index()
    {
        $brgy_id = Auth()->user()->barangay_id;

        // Base query
        $query = BarangayProject::query()->where('barangay_id', $brgy_id)
            ->orderBy('start_date', 'desc');

        // Optional filters
        if ($status = request('status')) {
            $query->where('status', $status);
        }

        if ($category = request('category')) {
            $query->where('category', $category);
        }

        if ($title = request('title')) {
            $query->where('title', 'like', "%{$title}%");
        }
        //dd($query->get());
        // Paginate and keep query string
        $projects = $query->paginate(10)->withQueryString();

        //infrastructure
        $query = BarangayInfrastructure::query()
            ->where('barangay_id', $brgy_id)
            ->orderBy('created_at', 'desc');

        // Optional filters
        if ($type = request('infrastructure_type')) {
            $query->where('infrastructure_type', $type);
        }

        if ($category = request('infrastructure_category')) {
            $query->where('infrastructure_category', $category);
        }

        if ($search = request('search')) {
            $query->where('infrastructure_type', 'like', "%{$search}%")
                ->orWhere('infrastructure_category', 'like', "%{$search}%");
        }

        // Paginate and keep query string
        $infrastructure = $query->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/BarangayProfile/BarangayProfileMain', [
            'projects' => $projects,
            'infrastructure' => $infrastructure,
            'queryParams' => request()->query() ?: null,
        ]);
    }
    public function barangayDetails()
    {
        $barangayId = Auth()->user()->barangay_id;
        $barangay = Barangay::findOrFail($barangayId);

        return response()->json([
            'data' => $barangay,
        ]);
    }
}

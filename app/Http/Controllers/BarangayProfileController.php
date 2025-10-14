<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateBarangayProfileRequest;
use App\Models\Barangay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    public function update(UpdateBarangayProfileRequest $request, Barangay $barangay)
    {
        $data = $request->validated();

        try {
            // Handle Barangay Logo Upload
            if ($request->hasFile('logo_path')) {
                $image = $request->file('logo_path');

                // Define folder path: barangay_name/logos/
                $folder = 'barangay/' . Str::slug($data['barangay_name']) . '/logos';

                // Delete existing logo if it exists
                if ($barangay->logo_path && Storage::disk('public')->exists($barangay->logo_path)) {
                    Storage::disk('public')->delete($barangay->logo_path);
                }

                // Store new logo
                $filename = 'logo_' . time() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs($folder, $filename, 'public');

                // Update logo path
                $data['logo_path'] = $path;
            } else {
                // Keep the existing logo if none uploaded
                $data['logo_path'] = $barangay->logo_path;
            }

            // Update Barangay Information
            $barangay->update([
                'barangay_name'   => $data['barangay_name'],
                'contact_number'  => $data['contact_number'] ?? null,
                'city'            => 'City of Ilagan', // fixed
                'province'        => 'Isabela',       // fixed
                'zip_code'        => '3300',          // fixed
                'area_sq_km'      => $data['area_sq_km'] ?? null,
                'email'           => $data['email'] ?? null,
                'logo_path'       => $data['logo_path'],
                'founded_year'    => $data['founded_year'] ?? null,
                'barangay_code'   => $data['barangay_code'] ?? null,
                'barangay_type'   => $data['barangay_type'],
            ]);

            return redirect()
                ->route('barangay_profile.index')
                ->with('success', 'Barangay profile updated successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Barangay could not be updated: ' . $e->getMessage());
        }
    }
}

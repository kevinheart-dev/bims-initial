<?php

namespace Database\Seeders;

use App\Models\BarangayFacility;
use App\Models\BarangayInfrastructure;
use App\Models\BarangayInstitution;
use App\Models\BarangayInstitutionMember;
use App\Models\BarangayOfficial;
use App\Models\BarangayOfficialTerm;
use App\Models\BarangayProject;
use App\Models\BarangayRoad;
use App\Models\Designation;
use App\Models\Inventory;
use App\Models\Purok;
use App\Models\Resident;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangayInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BarangayOfficialTerm::factory(4)->create();
        $positionsLimits = [
            'barangay_captain' => 1,
            'barangay_treasurer' => 1,
            'barangay_kagawad' => 7, // less than 8
            'sk_chairman' => 1,
            'sk_kagawad' => 7, // less than 8
            'health_worker' => 4, // less than 5
            'tanod' => 4,        // less than 5
        ];

        foreach ($positionsLimits as $position => $limit) {
            BarangayOfficial::factory()
                ->count($limit)
                ->state(function () use ($position) {
                    $term = BarangayOfficialTerm::inRandomOrder()->first()
                        ?? BarangayOfficialTerm::factory()->create();

                    return [
                        'position' => $position,
                        'status' => 'active',
                        'term_id' => $term->id,
                    ];
                })
                ->create();
        }

        // Get all puroks grouped by barangay for quick lookup
        $puroksByBarangay = Purok::all()->groupBy('barangay_id');

        // Get barangay kagawad officials grouped by barangay
        $barangayKagawadsByBarangay = BarangayOfficial::where('position', 'barangay_kagawad')
            ->with('resident')
            ->get()
            ->groupBy(fn($official) => $official->resident->barangay_id ?? null);

        // Get sk kagawad officials grouped by barangay
        $skKagawadsByBarangay = BarangayOfficial::where('position', 'sk_kagawad')
            ->with('resident')
            ->get()
            ->groupBy(fn($official) => $official->resident->barangay_id ?? null);

        // Helper function to assign designations to kagawads with unique puroks per barangay
        function assignDesignations($kagawadsByBarangay, $puroksByBarangay) {
            foreach ($kagawadsByBarangay as $barangayId => $kagawads) {
                $puroks = $puroksByBarangay[$barangayId] ?? collect();
                $puroks = $puroks->shuffle();

                $usedPurokIds = collect();

                foreach ($kagawads as $kagawad) {
                    // Find a purok not used yet
                    $purok = $puroks->first(fn($p) => !$usedPurokIds->contains($p->id));

                    if (!$purok) {
                        // No more puroks available for this barangay
                        break;
                    }

                    Designation::create([
                        'official_id' => $kagawad->id,
                        'purok_id' => $purok->id,
                        'started_at' => now()->subYears(rand(1, 5))->year,
                        'ended_at' => null,
                    ]);

                    $usedPurokIds->push($purok->id);
                }
            }
        }

        // Assign barangay kagawad designations
        assignDesignations($barangayKagawadsByBarangay, $puroksByBarangay);

        // Assign sk kagawad designations
        assignDesignations($skKagawadsByBarangay, $puroksByBarangay);

        BarangayInstitution::factory(4)->create();
        $institutions = BarangayInstitution::all();
        $residents = Resident::all();

        foreach ($institutions as $institution) {
            // Pick a random head for this institution
            $head = $residents->random();

            BarangayInstitutionMember::factory()->create([
                'institution_id' => $institution->id,
                'resident_id'    => $head->id,
                'is_head'        => true,
            ]);

            // Create other members (non-head)
            $memberCount      = rand(5, 10);
            $availableMembers = $residents->where('id', '!=', $head->id);

            // Clamp member count to avoid "requested X but only Y available"
            $memberCount   = min($memberCount, $availableMembers->count());
            $otherMembers  = $availableMembers->random($memberCount);

            foreach ($otherMembers as $member) {
                BarangayInstitutionMember::factory()->create([
                    'institution_id' => $institution->id,
                    'resident_id'    => $member->id,
                    'is_head'        => false,
                ]);
            }
        }

        BarangayProject::factory(10)->create();
        BarangayInfrastructure::factory(10)->create();
        BarangayRoad::factory(10)->create();
        BarangayFacility::factory(10)->create();

        BarangayInstitution::all()->each(function ($institution) use ($residents) {
            // Requested 8–16, but clamp to available residents
            $memberCount      = rand(8, 16);
            $availableMembers = $residents;

            $memberCount  = min($memberCount, $availableMembers->count());
            $members      = BarangayInstitutionMember::factory()
                ->count($memberCount)
                ->create([
                    'institution_id' => $institution->id,
                ]);

            // Randomly pick one of them as head if members exist
            if ($members->count() > 0) {
                $head = $members->random();
                $head->update(['is_head' => true]);
            }
        });
        Inventory::factory(50)->create();
    }

}

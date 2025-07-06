<?php

namespace Database\Seeders;

use App\Models\HouseholdResident;
use App\Models\Resident;
use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FixHouseholdResidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $relationshipOptions = ['spouse', 'child', 'sibling', 'parent', 'grandparent', 'other'];

        // Get all residents with household_id
        $residents = Resident::whereNotNull('household_id')->get();

        foreach ($residents as $resident) {
            // Skip if already added to their own household
            $alreadyExists = HouseholdResident::where('resident_id', $resident->id)
                ->where('household_id', $resident->household_id)
                ->exists();

            if ($alreadyExists) {
                continue;
            }

            // Assign 'self' if household head
            if ($resident->is_household_head) {
                $relationship = 'self';
            } else {
                // Get used relationships in this household
                $used = HouseholdResident::where('household_id', $resident->household_id)
                    ->pluck('relationship_to_head')
                    ->toArray();

                // Exclude 'self' and already used ones (except 'other')
                $available = collect($relationshipOptions)
                    ->reject(fn ($r) => in_array($r, $used) && $r !== 'other')
                    ->values();

                $relationship = $available->first();
            }

            HouseholdResident::create([
                'resident_id' => $resident->id,
                'household_id' => $resident->household_id,
                'relationship_to_head' => $relationship,
                'household_position' => fake()->randomElement(['primary', 'extended', 'boarder']),
            ]);
        }
    }
}

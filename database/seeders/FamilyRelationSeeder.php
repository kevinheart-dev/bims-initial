<?php

namespace Database\Seeders;

use App\Models\FamilyRelation;
use App\Models\Resident;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FamilyRelationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Relationship map for inverse generation
        $inverseMap = [
            'parent' => 'child',
            'child' => 'parent',
            'sibling' => 'sibling',
            'spouse' => 'spouse',
        ];

        // Get all households with at least 2 residents
        $householdGroups = Resident::whereNotNull('household_id')
            ->get()
            ->groupBy('household_id')
            ->filter(fn ($group) => $group->count() >= 2);

        foreach ($householdGroups as $householdId => $residents) {
            // Shuffle residents and get random pairs
            $residentIds = $residents->pluck('id')->shuffle()->values();

            // Make up to 5 random unique pairs per household
            for ($i = 0; $i < min(5, $residentIds->count() - 1); $i++) {
                $residentA = $residentIds[$i];
                $residentB = $residentIds[$i + 1];

                // Prevent self-association
                if ($residentA === $residentB) {
                    continue;
                }

                $relationship = fake()->randomElement(['parent', 'child', 'spouse', 'sibling']);
                $inverse = $inverseMap[$relationship];

                // Prevent duplicates
                $exists = FamilyRelation::where('resident_id', $residentA)
                    ->where('related_to', $residentB)
                    ->where('relationship', $relationship)
                    ->exists();

                if ($exists) continue;

                // Insert both directions
                FamilyRelation::create([
                    'resident_id' => $residentA,
                    'related_to' => $residentB,
                    'relationship' => $relationship,
                ]);

                FamilyRelation::create([
                    'resident_id' => $residentB,
                    'related_to' => $residentA,
                    'relationship' => $inverse,
                ]);
            }
        }

        echo "Family relationships seeded.\n";
    }

}

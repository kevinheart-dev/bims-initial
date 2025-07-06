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
        $families = Resident::with('family')
            ->whereNotNull('family_id')
            ->get()
            ->groupBy('family_id')
            ->filter(fn ($residents) => $residents->count() >= 2);

        foreach ($families as $residents) {
            $residents = $residents->shuffle()->values();
            $count = $residents->count();

            foreach ($residents as $resident) {
                $spouseAssigned = FamilyRelation::where('resident_id', $resident->id)
                    ->where('relationship', 'spouse')
                    ->exists();

                $parentCount = FamilyRelation::where('resident_id', $resident->id)
                    ->where('relationship', 'parent')
                    ->count();

                $childCount = FamilyRelation::where('resident_id', $resident->id)
                    ->where('relationship', 'child')
                    ->count();

                foreach ($residents->where('id', '!=', $resident->id) as $other) {
                    if (FamilyRelation::where('resident_id', $resident->id)
                        ->where('related_to', $other->id)->exists()) {
                        continue;
                    }

                    $relationship = null;

                    // Assign only 1 spouse
                    if (!$spouseAssigned && fake()->boolean(20)) {
                        $relationship = 'spouse';
                        $spouseAssigned = true;
                    }
                    // Assign up to 2 parents
                    elseif ($parentCount < 2 && fake()->boolean(30)) {
                        $relationship = 'parent';
                        $parentCount++;
                    }
                    // Assign multiple children
                    elseif (fake()->boolean(40)) {
                        $relationship = 'child';
                        $childCount++;
                    }
                    // Else maybe assign sibling
                    elseif (fake()->boolean(25)) {
                        $relationship = 'sibling';
                    }

                    if (!$relationship) {
                        continue;
                    }

                    $inverse = match ($relationship) {
                        'child' => 'parent',
                        'parent' => 'child',
                        'spouse' => 'spouse',
                        'sibling' => 'sibling',
                    };

                    FamilyRelation::create([
                        'resident_id' => $resident->id,
                        'related_to' => $other->id,
                        'relationship' => $relationship,
                    ]);

                    FamilyRelation::create([
                        'resident_id' => $other->id,
                        'related_to' => $resident->id,
                        'relationship' => $inverse,
                    ]);
                }
            }
        }
    }

}

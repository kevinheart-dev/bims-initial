<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\HouseholdResident;
use App\Models\Resident;
use DB;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HouseholdResident>
 */
class HouseholdResidentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        // Get a resident with household_id and not yet in household_residents
        $resident = Resident::whereNotNull('household_id')
            ->whereDoesntHave('householdResidents', function ($query) {
                $query->whereColumn('resident_id', 'residents.id')
                    ->whereColumn('household_id', 'residents.household_id');
            })
            ->inRandomOrder()
            ->first();

        if (!$resident) {
            throw new \Exception('No eligible resident found.');
        }

        $householdId = $resident->household_id;

        // Determine relationship
        if ($resident->is_household_head) {
            $relationship = 'self';
        } else {
            // Get already-used relationships in this household
            $usedRelationships = DB::table('household_residents')
                ->where('household_id', $householdId)
                ->pluck('relationship_to_head')
                ->toArray();

            // Choose a unique relationship not already used
            $options = collect(['spouse', 'child', 'sibling', 'parent', 'grandparent'])
                ->diff($usedRelationships)
                ->values();

            // Fallback if all are used
            $relationship = $options->isNotEmpty()
                ? $options->random()
                : 'child';
        }

        return [
            'resident_id' => $resident->id,
            'household_id' => $householdId,
            'relationship_to_head' => $relationship,
            'household_position' => $this->faker->randomElement(['primary', 'extended', 'boarder']),
        ];
    }

}

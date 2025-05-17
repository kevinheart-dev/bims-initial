<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\Resident;
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
        $relationship = $this->faker->randomElement(['self', 'spouse', 'child', 'sibling', 'parent', 'grandparent', 'other']);
        return [
            'resident_id' => Resident::factory()->create(),
            'household_id' => Household::inRandomOrder()->first()?->id,
            'relationship_to_head' => $relationship,
            'household_position' => $this->faker->randomElement(['primary', 'extended', 'boarder']),
            'other_relationship' => $relationship === 'other' ? $this->faker->word : null,
        ];
    }
}

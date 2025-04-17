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
        return [
            'resident_id' => Resident::inRandomOrder()->first()?->resident_id ?? 1,
            'household_id' => Household::inRandomOrder()->first()?->id ?? 1,
            'is_household_head' => $this->faker->boolean(20),
            'is_family_member' => true,
            'relationship_to_head' => $this->faker->randomElement([
                'Father', 'Mother', 'Son', 'Daughter', 'Grandparent', 'Uncle', 'Aunt', 'Sibling', 'Cousin', 'Niece', 'Nephew', 'Other'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

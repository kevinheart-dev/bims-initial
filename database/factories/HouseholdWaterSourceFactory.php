<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HouseholdWaterSource>
 */
class HouseholdWaterSourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $household = Household::inRandomOrder()->first();

        return [
            'household_id' => $household ? $household->id : Household::factory(),
            'water_source_type' => $this->faker->randomElement([
                'level_ii_water_system', 'level_iii_water_system', 'deep_well_level_i', 'artesian_well_level_i',
                'shallow_well_level_i', 'commercial_water_refill_source',
            ]),
        ];
    }
}

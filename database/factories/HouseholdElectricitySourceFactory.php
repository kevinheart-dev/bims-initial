<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HouseholdElectricitySource>
 */
class HouseholdElectricitySourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $electricityTypes = [
            'distribution_company_iselco_ii',
            'generator',
            'solar_renewable_energy_source',
            'battery',
        ];

        return [
            'household_id' => Household::inRandomOrder()->value('id') ?? Household::factory(),
            'electricity_type' => $this->faker->randomElement($electricityTypes),
        ];
    }
}

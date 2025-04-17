<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Household>
 */
class HouseholdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_id' => 1,
            'purok' => $this->faker->numberBetween(1, 7),
            'internet_access' => $this->faker->boolean,
            'household_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'house_ownership' => $this->faker->randomElement(['owned', 'rented', 'shared', 'others']),
            'owned' => $this->faker->randomElement(['land', 'house', 'both', '']),
            'shared_with' => $this->faker->randomElement(['owner', 'renter', '']),
            'house_structure' => $this->faker->randomElement(['concrete', 'semi-concrete', 'wood', 'makeshift']),
            'toilet_type' => $this->faker->randomElement([
                'water sealed',
                'compost pit toilet',
                'shared or communal toilet/public toilet',
                'no latrine',
                'not mentioned above (specify)'
            ]),
            'toilet_other' => $this->faker->optional()->word,
            'electricity_source' => $this->faker->randomElement([
                'distribution company (iselco-ii)',
                'generator',
                'solar (renewable energy source)',
                'battery',
                'not mentioned above (specify)',
                'none'
            ]),
            'electricity_source_other' => $this->faker->optional()->word,
            'water_source' => $this->faker->randomElement([
                'level ii water system',
                'level iii water system',
                'deep well (level i)',
                'artesian well (level i)',
                'shallow well (level i)',
                'commercial water refill source',
                'not mentioned above (specify)'
            ]),
            'water_source_other' => $this->faker->optional()->word,
            'bath_and_wash_area' => $this->faker->randomElement([
                'with own sink and bath',
                'shared or communal',
                'not mentioned above (specify)'
            ]),
            'bath_and_wash_area_other' => $this->faker->optional()->word,
            'waste_management' => $this->faker->randomElement([
                'open dump site',
                'sanitary landfill',
                'compost pits',
                'material recovery facility (mrf)',
                'garbage is collected',
                'not mentioned above (specify)'
            ]),
            'waste_management_other' => $this->faker->optional()->word,
        ];
    }
}

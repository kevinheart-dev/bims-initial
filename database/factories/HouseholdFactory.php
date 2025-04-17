<?php

namespace Database\Factories;

use App\Models\Purok;
use App\Models\Street;
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
            'purok_id' => Purok::inRandomOrder()->first()?->id,
            'street_id' => Street::inRandomOrder()->first()?->id,
            'internet_access' => $this->faker->boolean,
            'house_number' => $this->faker->numberBetween(1, 999),
            'ownership_type' => $this->faker->randomElement(['owned', 'rented', 'shared', 'government-provided', 'inherited', 'others']),
            'ownership_details' => $this->faker->optional()->sentence(3),
            'housing_condition' => $this->faker->randomElement(['good', 'needs repair', 'dilapidated']),
            'year_established' => $this->faker->optional()->year,
            'house_structure' => $this->faker->randomElement(['concrete', 'semi-concrete', 'wood', 'makeshift']),
            'toilet_type' => $this->faker->randomElement([
                'water sealed',
                'compost pit toilet',
                'shared or communal toilet/public toilet',
                'no latrine',
                'not mentioned above (specify)'
            ]),
            'toilet_other' => $this->faker->optional()->words(3, true),
            'electricity_source' => $this->faker->randomElement([
                'distribution company (iselco-ii)',
                'generator',
                'solar (renewable energy source)',
                'battery',
                'not mentioned above (specify)',
                'none'
            ]),
            'electricity_source_other' => $this->faker->optional()->words(3, true),
            'water_source' => $this->faker->randomElement([
                'level ii water system',
                'level iii water system',
                'deep well (level i)',
                'artesian well (level i)',
                'shallow well (level i)',
                'commercial water refill source',
                'not mentioned above (specify)'
            ]),
            'water_source_other' => $this->faker->optional()->words(3, true),
            'bath_and_wash_area' => $this->faker->randomElement([
                'with own sink and bath',
                'shared or communal',
                'not mentioned above (specify)'
            ]),
            'bath_and_wash_area_other' => $this->faker->optional()->words(3, true),
            'waste_management' => $this->faker->randomElement([
                'open dump site',
                'sanitary landfill',
                'compost pits',
                'material recovery facility (mrf)',
                'garbage is collected',
                'not mentioned above (specify)'
            ]),
            'waste_management_other' => $this->faker->optional()->words(3, true),
            'number_of_rooms' => $this->faker->numberBetween(1, 9),
            'number_of_floors' => $this->faker->numberBetween(1, 3),
        ];
    }
}

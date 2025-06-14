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
            'purok_id' => Purok::inRandomOrder()->first()?->id ?? Purok::factory(),
            'street_id' => Street::inRandomOrder()->first()?->id ?? Street::factory(),
            'house_number' => $this->faker->numberBetween(1, 9999),
            'ownership_type' => $this->faker->randomElement(['owned', 'rented', 'shared', 'government-provided', 'inherited', 'others']),
            'ownership_details' => $this->faker->optional()->sentence(3),
            'housing_condition' => $this->faker->randomElement(['good', 'needs repair', 'dilapidated']),
            'year_established' => $this->faker->optional()->year(),
            'house_structure' => $this->faker->randomElement(['concrete', 'semi-concrete', 'wood', 'makeshift']),
            'bath_and_wash_area' => $this->faker->randomElement([
                'with own sink and bath',
                'shared or communal',
                'none available'
            ]),
            'number_of_rooms' => $this->faker->numberBetween(1, 10),
            'number_of_floors' => $this->faker->numberBetween(1, 3),
            'latitude' => $this->faker->latitude(5, 15),
            'longitude' => $this->faker->longitude(120, 130),
        ];
    }
}

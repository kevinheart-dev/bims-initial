<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Livestock>
 */
class LivestockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Random household_id from the existing households table
            'household_id' => Household::inRandomOrder()->first()->id,

            // Random livestock type
            'livestock_type' => $this->faker->randomElement([
                'chicken', 'cow', 'carabao', 'goat', 'pig', 'duck', 'others'
            ]),

            // Optional 'other' field for other livestock types
            'other' => $this->faker->optional()->word(),

            // Random quantity of livestock
            'quantity' => $this->faker->numberBetween(1, 100),

            // Created and updated timestamps
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

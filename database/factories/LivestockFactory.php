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
            'household_id' => Household::inRandomOrder()->first()->id,
            'livestock_type' => $this->faker->randomElement(['chicken', 'cow', 'carabao', 'goat', 'pig', 'duck', 'others']),
            'other' => $this->faker->optional()->word(),
            'quantity' => $this->faker->numberBetween(1, 20),
            'purpose' => $this->faker->randomElement(['personal consumption', 'commercial', 'both']),
        ];
    }
}

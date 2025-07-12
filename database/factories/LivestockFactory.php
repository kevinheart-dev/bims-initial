<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\Resident;
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
        $livestockTypes = ['chicken', 'cow', 'carabao', 'goat', 'pig', 'duck', 'others'];
        $purposes = ['personal_consumption', 'commercial', 'both'];

        $selectedType = $this->faker->randomElement($livestockTypes);

        return [
            'household_id' => Household::inRandomOrder()->value('id') ?? 1,
            'livestock_type' => $selectedType,
            'quantity' => $this->faker->numberBetween(1, 100),
            'purpose' => $this->faker->randomElement($purposes),
        ];
    }
}

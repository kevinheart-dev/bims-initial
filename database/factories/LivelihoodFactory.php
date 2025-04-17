<?php

namespace Database\Factories;

use App\Models\LivelihoodType;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Livelihood>
 */
class LivelihoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()->id,

            'livelihood_type_id' => LivelihoodType::factory(),

            // Use `optional()` for the `other` field, so it's not always required
            'other' => $this->faker->optional()->word(),

            // Timestamps for creation and updates
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

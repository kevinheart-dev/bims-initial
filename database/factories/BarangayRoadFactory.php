<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayRoad>
 */
class BarangayRoadFactory extends Factory
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
            'road_type' => $this->faker->randomElement(['asphalt', 'concrete', 'grave', 'natural earth surface']),
            'length' => $this->faker->randomFloat(2, 1, 100),
            'maintained_by' => $this->faker->company(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

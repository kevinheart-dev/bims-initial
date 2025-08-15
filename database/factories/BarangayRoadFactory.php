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
            'road_type' => $this->faker->randomElement(['asphalt', 'concrete', 'gravel', 'natural_earth_surface']),
            'length' => $this->faker->randomFloat(2, 0.10, 15.00), // 0.10 km to 15 km
            'maintained_by' => $this->faker->randomElement([
                'Barangay Government',
                'Municipal Government',
                'City Government',
                'Provincial Government',
                'Private Entity',
                'Community Volunteers'
            ]),
        ];
    }
}

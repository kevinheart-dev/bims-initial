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
            'road_image' => null,
            'road_type' => $this->faker->randomElement([
                'asphalt',
                'concrete',
                'gravel',
                'natural_earth_surface'
            ]),
            'length' => $this->faker->randomFloat(2, 0.10, 50.00), // 0.10 km to 50 km

            'condition' => $this->faker->randomElement([
                'good',
                'fair',
                'poor',
                'under_construction',
                'impassable'
            ]),

            'status' => $this->faker->randomElement([
                'active',
                'inactive',
            ]),

            'maintained_by' => $this->faker->randomElement([
                'Barangay Government',
                'Municipal Government',
                'City Government',
                'Provincial Government',
                'DPWH',
                'Private Entity',
                'Community Volunteers'
            ]),
        ];
    }
}

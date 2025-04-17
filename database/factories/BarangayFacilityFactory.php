<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayFacility>
 */
class BarangayFacilityFactory extends Factory
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
            'name' => $this->faker->word(),
            'facility_type' => $this->faker->randomElement(['health center', 'multipurpose hall', 'daycare', 'others']),
            'other' => $this->faker->word(),
            'quantity' => rand(1, 10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

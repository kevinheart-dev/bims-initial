<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
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
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'vehicle_type' => $this->faker->randomElement(['motorcycle', 'tricycle', 'car', 'truck', 'bicycle', 'other']),
            'vehicle_class' => $this->faker->randomElement(['private', 'public']),
            'usage_status' => $this->faker->randomElement(['owned', 'work']),
            'other' => $this->faker->optional()->word(),
            'quantity' => $this->faker->numberBetween(1, 3),
        ];
    }
}

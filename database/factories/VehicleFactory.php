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
            // Random resident_id from the existing residents table
            'resident_id' => Resident::inRandomOrder()->first()->id,

            // Random vehicle type
            'vehicle_type' => $this->faker->randomElement([
                'motorcycle', 'tricycle', 'car', 'truck', 'bicycle', 'other'
            ]),

            // Random vehicle class (private or public)
            'vehicle_class' => $this->faker->randomElement(['private', 'public']),

            // Random usage status (owned or work)
            'usage_status' => $this->faker->randomElement(['owned', 'work']),

            // Optional 'other' field for vehicle type
            'other' => $this->faker->optional()->word(),

            // Random quantity of vehicles
            'quantity' => $this->faker->numberBetween(1, 10),

            // Created and updated timestamps
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

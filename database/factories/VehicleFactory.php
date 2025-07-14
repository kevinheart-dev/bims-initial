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
        $vehicleTypes = ['motorcycle', 'tricycle', 'car', 'truck', 'bicycle', 'other'];
        $vehicleClasses = ['private', 'public'];
        $usageStatuses = ['personal', 'public_transport', 'business_use'];

        $selectedType = $this->faker->randomElement($vehicleTypes);
        $resident = Resident::inRandomOrder()->first();

        if (!$resident) {
            throw new \Exception('No resident found to assign a vehicle.');
        }

        return [
            'resident_id' => $resident->id,
            'vehicle_type' => $selectedType,
            'vehicle_class' => $this->faker->randomElement($vehicleClasses),
            'usage_status' => $this->faker->randomElement($usageStatuses),
            'quantity' => $this->faker->numberBetween(1, 5),
        ];
    }
}

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
        // Common barangay facility types and sample names
        $facilityTypes = [
            'Health' => ['Barangay Health Center', 'Birthing Clinic'],
            'Education' => ['Day Care Center', 'Elementary School', 'High School'],
            'Sports & Recreation' => ['Covered Court', 'Gymnasium', 'Playground'],
            'Government' => ['Barangay Hall', 'Police Outpost', 'Fire Substation'],
            'Utilities' => ['Water Tank', 'Multipurpose Hall']
        ];

        // Randomly pick a facility type and corresponding name
        $type = $this->faker->randomElement(array_keys($facilityTypes));
        $name = $this->faker->randomElement($facilityTypes[$type]);

        return [
            'barangay_id' => 1,
            'name' => $name,
            'facility_type' => $type,
            'quantity' => $this->faker->numberBetween(1, 5), // realistic number of facilities
        ];
    }
}

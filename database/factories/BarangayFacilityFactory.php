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
        // Fixed set of common barangay facilities with lowercase types
        $facilities = [
            ['name' => 'Multi-Purpose Hall', 'facility_type' => 'government'],
            ['name' => 'Barangay Women and Children Protection Desk', 'facility_type' => 'protection'],
            ['name' => 'Barangay Tanods and Barangay Peacekeeping Action Team Post', 'facility_type' => 'security'],
            ['name' => 'Bureau of Jail Management and Penology', 'facility_type' => 'security'],
            ['name' => 'Philippine National Police Outpost', 'facility_type' => 'security'],
            ['name' => 'Bank', 'facility_type' => 'finance'],
            ['name' => 'Post Office', 'facility_type' => 'service'],
            ['name' => 'Market', 'facility_type' => 'commerce'],
        ];

        static $index = 0; // keep track of sequential assignment
        $facility = $facilities[$index % count($facilities)];
        $index++;

        // realistic quantity based on type
        $quantity = match($facility['facility_type']) {
            'government', 'protection', 'security' => $this->faker->numberBetween(0, 1),
            'finance', 'service', 'commerce' => $this->faker->numberBetween(0, 2),
            default => 1,
        };

        return [
            'barangay_id' => 1,
            'name' => $facility['name'],
            'facility_type' => $facility['facility_type'],
            'quantity' => $quantity,
        ];
    }
}

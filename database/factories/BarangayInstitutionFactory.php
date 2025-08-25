<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayInstitution>
 */
class BarangayInstitutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $localInstitutions = [
            [
                'name' => 'ILAW — Ilaw ng Tahanan (Mothers\' Association)',
                'type' => 'coop', // Cooperative
            ],
            [
                'name' => 'HALIGI — Haligi ng Tahanan (Fathers\' Association)',
                'type' => 'coop', // Cooperative
            ],
            [
                'name' => 'Fisherfolk Association',
                'type' => 'farmers', // Farmers Association
            ],
            [
                'name' => 'Tricycle Operators and Drivers Association (TODA)',
                'type' => 'transport', // Transport Group
            ],
            [
                'name' => 'Public Utility Drivers Association',
                'type' => 'transport', // Transport Group
            ],
            [
                'name' => 'Organic Farmers Association',
                'type' => 'farmers', // Farmers Association
            ],
        ];

        static $index = 0;
        $institution = $localInstitutions[$index % count($localInstitutions)];
        $index++;

        return [
            'barangay_id' => 1, // or use factory relation later
            'name' => $institution['name'],
            'type' => $institution['type'],
            'description' => $this->faker->sentence(10),
            'year_established' => $this->faker->year(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'dissolved']),
        ];
    }
}

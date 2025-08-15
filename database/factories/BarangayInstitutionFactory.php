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
            'ILAW — Ilaw ng Tahanan (Mothers\' Association)',
            'HALIGI — Haligi ng Tahanan (Fathers\' Association)',
            'Fisherfolk Association',
            'Tricycle Operators and Drivers Association (TODA)',
            'Public Utility Drivers Association',
            'Organic Farmers Association',
        ];
        return [
            'barangay_id' => 1,
            'name' => $this->faker->randomElement($localInstitutions),
        ];
    }
}

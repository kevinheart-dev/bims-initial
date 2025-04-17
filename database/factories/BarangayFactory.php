<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Barangay>
 */
class BarangayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_name'   => 'Centro San Antonio',
            'city'            => 'City of Ilagan',
            'province'        => 'Isabela',
            'zip_code'        => 3300,
            'contact_number'  => $this->faker->phoneNumber(),
            'email'           => $this->faker->unique()->safeEmail(),
            'logo'            => null,
            'created_at'      => now(),
            'updated_at'      => now(),
        ];
    }
}

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
            'barangay_name' => 'centro san antonio',
            'city' => 'city of ilagan',
            'province' => 'isabela',
            'zip_code' => '3300',
            'contact_number' => '093423423',
            'area_sq_km' => $this->faker->randomFloat(2, 0.5, 99.99),
            'email' => $this->faker->safeEmail,
            'logo_path' => $this->faker->optional()->imageUrl(300, 300, 'barangay', true, 'logo'),
            'founded_year' => 1960,
            'barangay_code' => '012-312332',
            'barangay_type' => 'urban',
            'updated_at' => now(),
            'created_at' => now(),
        ];
    }
}

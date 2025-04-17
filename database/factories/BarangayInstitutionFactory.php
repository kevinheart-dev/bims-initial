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
        return [
            'barangay_id' => 1,
            'institution_head' => rand(1, 100),
            'name' => $this->faker->company(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

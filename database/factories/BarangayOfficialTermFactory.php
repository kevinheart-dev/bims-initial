<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayOfficialTerm>
 */
class BarangayOfficialTermFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startYear = $this->faker->numberBetween(2015, 2025);
        $endYear = $startYear + 3; // assuming a 3-year term

        return [
            'barangay_id' => 1,
            'term_start' => $startYear,
            'term_end' => $endYear,
            'status' => $this->faker->randomElement(['active', 'inactive', 'ended']),
        ];
    }
}

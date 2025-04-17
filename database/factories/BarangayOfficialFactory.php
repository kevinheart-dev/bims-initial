<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayOfficial>
 */
class BarangayOfficialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $termStart = $this->faker->dateTimeBetween('-5 years', 'now');
        $termEnd = $this->faker->dateTimeBetween($termStart, '+3 years');
        return [
            'resident_id' => Resident::inRandomOrder()->first()->id ?? 1,
            'position' => $this->faker->randomElement([
                'barangay captain', 'barangay secretary', 'barangay treasurer',
                'councilor', 'sk chairman', 'sk member', 'health worker', 'tanod'
            ]),
            'term_start' => $termStart->format('Y-m-d'),
            'term_end' => $termEnd->format('Y-m-d'),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }
}

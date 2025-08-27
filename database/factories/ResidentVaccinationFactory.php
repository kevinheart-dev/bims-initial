<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResidentVaccination>
 */
class ResidentVaccinationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $vaccines = [
            'COVID-19 (Pfizer)',
            'COVID-19 (Moderna)',
            'COVID-19 (Sinovac)',
            'Influenza',
            'Hepatitis B',
            'Measles',
            'Tetanus',
            'Polio',
            'Chickenpox',
            'HPV',
            'Anti-Rabies',
            'Dengue',
            'Typhoid',
            'Pneumococcal',
            'Meningococcal',
            'Tuberculosis (BCG)',
        ];

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? Resident::factory(),
            'vaccine' => $this->faker->randomElement($vaccines),
            'vaccination_date' => $this->faker->dateTimeBetween('-15 years', 'now')->format('Y-m-d'),
        ];
    }
}

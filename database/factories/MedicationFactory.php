<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medication>
 */
class MedicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'medication_name' => $this->faker->word,
            'dosage' => $this->faker->randomNumber(2) . 'mg',
            'frequency' => $this->faker->randomElement(['Once a day', 'Twice a day', 'As needed']),
        ];
    }
}

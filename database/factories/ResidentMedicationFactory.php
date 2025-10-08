<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResidentMedication>
 */
class ResidentMedicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        // sample medications
        $medications = [
            'Paracetamol',
            'Amoxicillin',
            'Metformin',
            'Losartan',
            'Atorvastatin',
            'Omeprazole',
            'Aspirin',
            'Ibuprofen',
            'Cetirizine',
            'Salbutamol',
        ];

        // generate realistic start/end date (sometimes ongoing, so end_date can be null)
        $startDate = $this->faker->dateTimeBetween('-2 years', 'now');
        $endDate = $this->faker->boolean(20) // 60% chance medication has ended
            ? $this->faker->dateTimeBetween($startDate, 'now')
            : null;

        return [
            'resident_id' => Resident::inRandomOrder()->first()->id ?? Resident::factory(),
            'medication'  => $this->faker->randomElement($medications),
            'start_date'  => $startDate->format('Y-m-d'),
            'end_date'    => $endDate ? $endDate->format('Y-m-d') : null,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PregnancyRecords>
 */
class PregnancyRecordsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
        public function definition()
    {
        // Find eligible female residents (18–49 y/o)
        $resident = Resident::where('sex', 'female')
            ->whereBetween('birthdate', [
                Carbon::now()->subYears(49), // max 49 y/o
                Carbon::now()->subYears(18), // min 18 y/o
            ])
            ->inRandomOrder()
            ->first();

        // If no eligible resident found, skip record creation
        if (!$resident) {
            return [];
        }

        $status = $this->faker->randomElement(['ongoing', 'delivered', 'miscarried', 'aborted']);

        return [
            'resident_id' => $resident->id,
            'status' => $status,
            'expected_due_date' => $status === 'ongoing'
                ? $this->faker->dateTimeBetween('+1 month', '+9 months')->format('Y-m-d')
                : null,
            'delivery_date' => in_array($status, ['delivered', 'miscarried', 'aborted'])
                ? $this->faker->dateTimeBetween('-9 months', 'now')->format('Y-m-d')
                : null,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SeniorCitizen>
 */
class SeniorCitizenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $senior = Resident::whereDate('birthdate', '<=', now()->subYears(60))
            ->whereDoesntHave('seniorCitizen') // Prevent duplicate senior records
            ->inRandomOrder()
            ->first();

        if (!$senior) {
            throw new \Exception('No eligible senior residents found (60+ years old and not already added).');
        }

        return [
            'resident_id' => $senior->id,
            'osca_id_number' => $this->faker->unique()->numberBetween(100000, 999999),
            'is_pensioner' => $this->faker->randomElement(['yes', 'no', 'pending']),
            'pension_type' => $this->faker->randomElement(['SSS', 'GSIS', 'DSWD', 'private', 'none']),
            'living_alone' => $this->faker->boolean(),
        ];
    }
}

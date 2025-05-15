<?php

namespace Database\Factories;

use App\Models\LivelihoodType;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Livelihood>
 */
class LivelihoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-10 years', 'now');
        $hasEnded = $this->faker->boolean(25); // 25% chance of ended livelihood

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? 1,
            'livelihood_type_id' => LivelihoodType::inRandomOrder()->value('id') ?? 1,
            'monthly_income' => $this->faker->randomFloat(2, 3000, 60000),
            'other' => $this->faker->optional()->word(),
            'is_main_livelihood' => $this->faker->boolean(80), // 80% chance it's the main livelihood
            'started_at' => $startDate->format('Y-m-d'),
            'ended_at' => $hasEnded ? $this->faker->dateTimeBetween($startDate, 'now')->format('Y-m-d') : null,
        ];
    }
}

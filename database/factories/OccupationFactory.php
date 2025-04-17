<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Occupation>
 */
class OccupationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-10 years', '-1 year');
        $endDate = $this->faker->optional()->dateTimeBetween($startDate, 'now');

        return [
            'resident_id' => Resident::inRandomOrder()->first()?->resident_id ?? 1,
            'occupation' => $this->faker->jobTitle(),
            'employment_type' => $this->faker->randomElement(['full-time', 'part-time', 'seasonal', 'contractual', 'self-employed', 'others']),
            'occupation_other' => null,
            'employer' => $this->faker->company(),
            'started_at' => $startDate->format('Y-m-d'),
            'ended_at' => $endDate ? $endDate->format('Y-m-d') : null,
            'monthly_income' => $this->faker->randomFloat(2, 5000, 50000),
        ];
    }
}

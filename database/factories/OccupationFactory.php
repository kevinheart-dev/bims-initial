<?php

namespace Database\Factories;

use App\Models\OccupationType;
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
            'resident_id' => Resident::inRandomOrder()->first()?->resident_id ?? Resident::factory(),
            'occupation_type_id' => OccupationType::inRandomOrder()->first()?->occupation_type_id ?? OccupationType::factory(),
            'employment_type' => $this->faker->randomElement(['full-time', 'part-time', 'seasonal', 'contractual', 'self-employed', 'others']),
            'work_arrangement' => $this->faker->randomElement(['remote', 'on-site', 'hybrid']),
            'occupation_other' => $this->faker->optional()->jobTitle,
            'employer' => $this->faker->company,
            'job_sector' => $this->faker->randomElement(['agriculture', 'services', 'manufacturing', 'government', 'other']),
            'occupation_status' => $this->faker->randomElement(['active', 'inactive', 'ended', 'retired']),
            'is_ofw' => $this->faker->boolean(10),
            'started_at' => $startDate,
            'ended_at' => $endDate,
            'monthly_income' => $this->faker->numberBetween(5000, 50000),
        ];
    }
}

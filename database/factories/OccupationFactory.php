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
        $employmentTypes = ['full-time', 'part-time', 'seasonal', 'contractual', 'self-employed', 'others'];
        $workArrangements = ['remote', 'on-site', 'hybrid'];
        $occupationStatuses = ['active', 'inactive', 'ended', 'retired'];

        $startDate = $this->faker->dateTimeBetween('-10 years', 'now');
        $isEnded = $this->faker->boolean(30); // 30% chance occupation has ended

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? 1, // fallback to ID 1 if none exist
            'occupation_type_id' => OccupationType::inRandomOrder()->value('id') ?? 1,
            'employment_type' => $this->faker->randomElement($employmentTypes),
            'work_arrangement' => $this->faker->randomElement($workArrangements),
            'occupation_other' => $this->faker->optional()->jobTitle(),
            'employer' => $this->faker->company(),
            'job_sector' => $this->faker->word(),
            'occupation_status' => $this->faker->randomElement($occupationStatuses),
            'is_ofw' => $this->faker->boolean(),
            'started_at' => $startDate->format('Y-m-d'),
            'ended_at' => $isEnded ? $this->faker->dateTimeBetween($startDate, 'now')->format('Y-m-d') : null,
            'monthly_income' => $this->faker->randomFloat(2, 5000, 100000),
        ];
    }
}

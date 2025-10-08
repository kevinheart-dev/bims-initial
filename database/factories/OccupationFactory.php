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
        $employmentTypes = ['full_time', 'part_time', 'seasonal', 'contractual', 'self_employed'];
        $workArrangements = ['remote', 'on_site', 'hybrid'];
        $occupationStatuses = ['active', 'inactive', 'ended', 'retired'];

        $startYear = $this->faker->numberBetween(1990, now()->year - 1);
        $isEnded = $this->faker->boolean();

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? 1, // fallback to ID 1 if none exist
            'occupation' => $this->faker->jobTitle(),
            'employment_type' => $this->faker->randomElement($employmentTypes),
            'work_arrangement' => $this->faker->randomElement($workArrangements),
            'employer' => $this->faker->company(),
            'occupation_status' => $this->faker->randomElement($occupationStatuses),
            'is_ofw' => $this->faker->boolean(),
            'is_main_livelihood' => $this->faker->boolean(50),
            'started_at' => $startYear,
            'ended_at' => $isEnded ? $this->faker->numberBetween($startYear + 1, now()->year) : null,
            'monthly_income' => $this->faker->randomFloat(2, 5000, 100000),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EducationalHistory>
 */
class EducationalHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $schoolTypes = ['private', 'public'];
        $educationalAttainments = [
            'no_education_yet',
            'no_formal_education',
            'prep_school',
            'kindergarten',
            'elementary',
            'high_school',
            'senior_high_school',
            'college',
            'als',
            'tesda',
            'vocational',
            'post_graduate',
        ];

        // Pick a resident
        $resident = Resident::inRandomOrder()->first();
        if (!$resident) {
            throw new \Exception('No resident found to assign educational background.');
        }

        // Randomly choose an attainment level
        $attainment = $this->faker->randomElement($educationalAttainments);

        // Estimate typical durations
        $durationMap = [
            'prep_school' => 1,
            'kindergarten' => 1,
            'elementary' => 6,
            'high_school' => 4,
            'senior_high_school' => 2,
            'college' => 4,
            'vocational' => 2,
            'tesda' => 1,
            'post_graduate' => 2,
            'als' => 1,
        ];

        $duration = $durationMap[$attainment] ?? 1;
        $startYear = $this->faker->numberBetween(1980, now()->year - $duration);
        $endYear = $startYear + $duration;

        // Determine education status
        $statusOptions = [
            'enrolled','graduated','incomplete','dropped_out'
        ];

        $educationStatus = match ($attainment) {
            'no_education_yet', 'no_formal_education' => null,
            default => $this->faker->randomElement($statusOptions),
        };

        // Determine if program is applicable
        $program = in_array($attainment, ['college', 'post_graduate']) && $educationStatus === 'graduated'
            ? $this->faker->jobTitle()
            : null;

        return [
            'resident_id' => $resident->id,
            'school_name' => $this->faker->company . ' School',
            'school_type' => $this->faker->randomElement($schoolTypes),
            'educational_attainment' => $attainment,
            'education_status' => $educationStatus,
            'year_started' => $educationStatus === 'currently_enrolled' ? $startYear : ($attainment === 'no_education_yet' ? null : $startYear),
            'year_ended' => in_array($educationStatus, ['graduated', 'incomplete', 'dropped_out']) ? $endYear : null,
            'program' => $program,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

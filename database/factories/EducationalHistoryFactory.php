<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EducationalHistory>
 */
class EducationalHistoryFactory extends Factory
{
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

        $attainment = $this->faker->randomElement($educationalAttainments);

        // Duration per attainment
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

        // Status rules
        $statusOptions = [
            'enrolled', 'graduated', 'incomplete', 'dropped_out'
        ];

        $educationStatus = match ($attainment) {
            'no_education_yet', 'no_formal_education' => null,
            'prep_school', 'kindergarten' => $this->faker->boolean(90) ? 'graduated' : 'enrolled',
            'post_graduate' => $this->faker->boolean(80) ? 'graduated' : 'enrolled',
            default => $this->faker->randomElement($statusOptions),
        };

        // Program (more realistic courses)
        $collegePrograms = [
            'BS Information Technology', 'BS Computer Science',
            'BS Nursing', 'BS Education', 'BS Accountancy',
            'BS Criminology', 'BS Agriculture'
        ];
        $postGradPrograms = [
            'MBA', 'MPA', 'Master in IT', 'Master in Education', 'PhD in Development Studies'
        ];

        $program = match ($attainment) {
            'college' => $this->faker->randomElement($collegePrograms),
            'post_graduate' => $this->faker->randomElement($postGradPrograms),
            default => null,
        };

        return [
            // ❗ better to pass resident_id via seeder
            'resident_id' => Resident::inRandomOrder()->value('id'),
            'school_name' => $this->faker->city . ' ' . $this->faker->randomElement(['Elementary School','High School','Institute','University']),
            'school_type' => $this->faker->randomElement($schoolTypes),
            'educational_attainment' => $attainment,
            'education_status' => $educationStatus,
            'year_started' => in_array($attainment, ['no_education_yet','no_formal_education']) ? null : $startYear,
            'year_ended' => in_array($educationStatus, ['graduated','incomplete','dropped_out']) ? $endYear : null,
            'program' => $program,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

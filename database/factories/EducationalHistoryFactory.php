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
            'no_formal_education',
            'elementary',
            'high_school',
            'college',
            'vocational',
            'post_graduate',
        ];

        // Select a valid attainment
        $attainment = $this->faker->randomElement($educationalAttainments);
        $isGraduate = in_array($attainment, ['elementary', 'high_school', 'college', 'vocational', 'post_graduate']);

        // Ensure realistic academic years
        $startYear = $this->faker->numberBetween(1980, now()->year - 4);
        $endYear = $this->faker->numberBetween($startYear + 1, now()->year);
        $yearGraduated = $isGraduate ? $endYear : null;

        // Get a valid resident
        $resident = Resident::inRandomOrder()->first();
        if (!$resident) {
            throw new \Exception('No resident found to assign educational background.');
        }

        return [
            'resident_id' => $resident->id,
            'school_name' => $this->faker->company . ' School',
            'school_type' => $this->faker->randomElement($schoolTypes),
            'educational_attainment' => $attainment,
            'education_status' => $isGraduate ? 'graduate' : 'undergraduate',
            'start_year' => $startYear,
            'end_year' => $endYear,
            'year_graduated' => $yearGraduated,
            'program' => in_array($attainment, ['college', 'post_graduate']) ? $this->faker->jobTitle() : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

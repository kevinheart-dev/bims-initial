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

        $startYear = $this->faker->numberBetween(2000, now()->year - 4);
        $endYear = $this->faker->numberBetween($startYear + 1, now()->year);
        $attainment = $this->faker->randomElement($educationalAttainments);
        $isGraduate = in_array($attainment, ['elementary', 'high_school', 'college', 'vocational', 'post_graduate']);

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? 1,
            'school_name' => $this->faker->company . ' School',
            'school_type' => $this->faker->randomElement($schoolTypes),
            'educational_attainment' => $attainment,
            'education_status' => $isGraduate ? 'graduate' : 'undergraduate',
            'start_year' => $startYear,
            'end_year' => $endYear,
            'year_graduated' => $isGraduate ? $endYear : null,
            'program' => in_array($attainment, ['college', 'post_graduate']) ? $this->faker->jobTitle : null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

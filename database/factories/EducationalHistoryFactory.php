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
            'elementary_level',
            'elementary_graduate',
            'high_school_level',
            'high_school_graduate',
            'college_level',
            'college_graduate',
            'vocational',
            'post_graduate',
            'als_graduate'
        ];

        $startYear = $this->faker->numberBetween(2000, now()->year - 1);
        $endYear = $this->faker->numberBetween($startYear, now()->year);

        $attainment = $this->faker->randomElement($educationalAttainments);
        $isDropout = in_array($attainment, ['elementary_level', 'high_school_level', 'college_level']);

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? 1,
            'school_name' => $this->faker->company . ' School',
            'enrolled_now' => $this->faker->boolean(40), // 40% chance still enrolled
            'school_type' => $this->faker->randomElement($schoolTypes),
            'educational_attainment' => $attainment,
            'dropout_reason' => $isDropout ? $this->faker->sentence() : null,
            'als_participant' => $this->faker->boolean(20),
            'start_year' => $startYear,
            'end_year' => $endYear,
        ];
    }
}

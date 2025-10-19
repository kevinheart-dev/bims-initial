<?php

namespace Database\Factories;

use App\Models\Barangay;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityRiskAssessment>
 */
class CommunityRiskAssessmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'year' => $this->faker->year(),
        ];
    }
}

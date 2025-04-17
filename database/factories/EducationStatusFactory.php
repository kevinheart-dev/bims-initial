<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EducationStatus>
 */
class EducationStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'school_age' => $this->faker->boolean,
        'enrolled_in_school' => $this->faker->boolean,
        'educational_attainment' => $this->faker->randomElement([
            'Elementary Graduate', 'High School Graduate', 'College Graduate', 'Vocational', 'None'
        ]),
        'dropout_reason' => $this->faker->optional()->sentence,
        'als_participant' => $this->faker->boolean,
        ];
    }
}

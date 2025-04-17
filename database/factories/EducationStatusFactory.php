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
            'resident_id' => Resident::inRandomOrder()->first()?->id,
            'school_name' => $this->faker->boolean ? $this->faker->company : null,
            'enrolled_in_school' => $this->faker->boolean,
            'school_type' => $this->faker->randomElement(['private', 'public']),
            'educational_attainment' => $this->faker->randomElement([
                'No Formal Education', 'Elementary Level', 'Elementary Graduate',
                'High School Level', 'High School Graduate', 'College Level',
                'College Graduate', 'Vocational', 'Post Graduate', 'ALS Graduate'
            ]),
            'dropout_reason' => $this->faker->boolean ? $this->faker->sentence : null,
            'als_participant' => $this->faker->boolean,
        ];
    }
}

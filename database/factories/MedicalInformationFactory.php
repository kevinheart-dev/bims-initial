<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalInformation>
 */
class MedicalInformationFactory extends Factory
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
            'medical_condition' => $this->faker->optional()->sentence,
            'allergies' => $this->faker->optional()->words(2, true),
            'blood_type' => $this->faker->optional()->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'is_pwd' => $this->faker->boolean(20),
            'disability_type' => $this->faker->optional()->word,
            'pwd_verification' => $this->faker->optional()->paragraph,
        ];
    }
}

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
            'resident_id' => Resident::inRandomOrder()->first()?->id,
            'weight_kg' => $this->faker->randomFloat(2, 40, 150),
            'height_cm' => $this->faker->randomFloat(2, 120, 200),
            'bmi' => $this->faker->randomFloat(2, 120, 200),
            'nutrition_status' => $this->faker->randomElement(['normal', 'underweight', 'severly_underweight', 'overweight', 'obese']),
            'emergency_contact_number' => $this->faker->phoneNumber,
            'emergency_contact_name' => $this->faker->name,
            'emergency_contact_relationship' => $this->faker->word,
            'is_smoker' => $this->faker->boolean,
            'is_alcohol_user' => $this->faker->boolean,
            'blood_type' => $this->faker->randomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
            'has_philhealth' => $this->faker->boolean,
            'philhealth_id_number' => $this->faker->boolean ? $this->faker->numerify('############') : null,
            'pwd_id_number' => $this->faker->optional()->numerify('PWD-####-####'),
        ];
    }
}

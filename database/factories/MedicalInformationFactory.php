<?php

namespace Database\Factories;

use App\Models\Resident;
use DateTime;
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
        $resident = Resident::inRandomOrder()->first();

        if (!$resident) {
            return [];
        }

        // Calculate age in years
        $birthDate = new DateTime($resident->birthdate);
        $today = new DateTime();
        $age = $today->diff($birthDate)->y;
        $gender = strtolower($resident->sex ?? 'male');

        // Generate realistic height and weight based on age group
        if ($age < 1) {
            // Infants
            $heightCm = $this->faker->numberBetween(45, 75);   // newborn to 12mo
            $weightKg = $this->faker->randomFloat(2, 2.5, 11); // avg infant weight
        } elseif ($age < 5) {
            // Toddlers
            $heightCm = $this->faker->numberBetween(80, 110);
            $weightKg = $this->faker->randomFloat(2, 10, 20);
        } elseif ($age < 12) {
            // Children
            $heightCm = $this->faker->numberBetween(110, 150);
            $weightKg = $this->faker->randomFloat(2, 18, 45);
        } elseif ($age < 20) {
            // Adolescents
            $heightCm = $this->faker->numberBetween(140, 185);
            $weightKg = $this->faker->randomFloat(2, 35, 80);
        } elseif ($age < 60) {
            // Adults
            $heightCm = $this->faker->numberBetween(
                $gender === 'female' ? 145 : 155,
                $gender === 'female' ? 170 : 190
            );
            $weightKg = $this->faker->randomFloat(2, 45, 100);
        } else {
            // Seniors
            $heightCm = $this->faker->numberBetween(140, 175);
            $weightKg = $this->faker->randomFloat(2, 40, 85);
        }

        // Compute BMI
        $heightM = $heightCm / 100;
        $bmi = round($weightKg / ($heightM * $heightM), 2);

        // Nutrition status logic (simplified cutoffs)
        if ($age >= 20) {
            // Adults (WHO cutoffs)
            if ($bmi < 18.5) $nutritionStatus = 'underweight';
            elseif ($bmi < 25) $nutritionStatus = 'normal';
            elseif ($bmi < 30) $nutritionStatus = 'overweight';
            else $nutritionStatus = 'obese';
        } elseif ($age >= 5) {
            // Children/adolescents (approximate)
            if ($bmi < 14) $nutritionStatus = 'severely_underweight';
            elseif ($bmi < 18) $nutritionStatus = 'underweight';
            elseif ($bmi < 22) $nutritionStatus = 'normal';
            elseif ($bmi < 25) $nutritionStatus = 'overweight';
            else $nutritionStatus = 'obese';
        } else {
            // Under 5 years (Barangay health worker focus)
            if ($bmi < 13) $nutritionStatus = 'severely_underweight';
            elseif ($bmi < 14) $nutritionStatus = 'underweight';
            elseif ($bmi <= 18) $nutritionStatus = 'normal';
            elseif ($bmi <= 20) $nutritionStatus = 'overweight';
            else $nutritionStatus = 'obese';
        }

        return [
            'resident_id' => $resident->id,
            'weight_kg' => $weightKg,
            'height_cm' => $heightCm,
            'bmi' => $bmi,
            'nutrition_status' => $nutritionStatus,
            'emergency_contact_number' => $this->faker->phoneNumber,
            'emergency_contact_name' => $this->faker->name,
            'emergency_contact_relationship' => $this->faker->randomElement([
                'Parent', 'Sibling', 'Spouse', 'Relative', 'Guardian', 'Friend'
            ]),
            'is_smoker' => $this->faker->boolean(20),
            'is_alcohol_user' => $this->faker->boolean(25),
            'blood_type' => $this->faker->randomElement([
                'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
            ]),
            'has_philhealth' => $this->faker->boolean(70),
            'philhealth_id_number' => $this->faker->boolean(70)
                ? $this->faker->numerify('##########')
                : null,
            'pwd_id_number' => $this->faker->optional(0.15)->numerify('PWD-####-####'),
        ];
    }
}

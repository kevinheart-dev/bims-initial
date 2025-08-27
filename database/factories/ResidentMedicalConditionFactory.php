<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResidentMedicalCondition>
 */
class ResidentMedicalConditionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // sample pool of common conditions
        $conditions = [
            'Hypertension',
            'Diabetes',
            'Asthma',
            'Tuberculosis',
            'Heart Disease',
            'Kidney Disease',
            'Arthritis',
            'Pneumonia',
            'Migraine',
            'Allergy'
        ];

        // pick random condition
        $condition = $this->faker->randomElement($conditions);

        // status options
        $statuses = ['active', 'resolved', 'chronic'];

        $diagnosedDate = $this->faker->dateTimeBetween('-10 years', 'now');
        $resolvedDate = $this->faker->boolean(40) // 40% chance resolved
            ? $this->faker->dateTimeBetween($diagnosedDate, 'now')
            : null;

        return [
            'resident_id'   => Resident::inRandomOrder()->first(), // auto-create resident if none
            'condition'     => $condition,
            'status'        => $this->faker->randomElement($statuses),
            'diagnosed_date'=> $diagnosedDate,
            'resolved_date' => $resolvedDate,
        ];
    }
}

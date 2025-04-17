<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialWelfareProfile>
 */
class SocialWelfareProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_id' => 1,
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'is_4ps_beneficiary' => $this->faker->boolean,
            'is_indigent' => $this->faker->boolean,
            'is_solo_parent' => $this->faker->boolean,
            'solo_parent_id_number' => $this->faker->optional()->word,
            'orphan_status' => $this->faker->boolean,
            'dswd_case_number' => $this->faker->optional()->word,
            'assessment_date' => $this->faker->date,
            'assessed_by' => $this->faker->name,
        ];
    }
}

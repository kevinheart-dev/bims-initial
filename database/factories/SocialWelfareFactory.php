<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialWelfare>
 */
class SocialWelfareFactory extends Factory
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
            'is_4ps_beneficiary' => $this->faker->boolean(30),
            'is_indigent' => $this->faker->boolean(40),
            'is_solo_parent' => $this->faker->boolean(15),
            'orphan_status' => $this->faker->boolean(10),
            'financial_assistance' => $this->faker->boolean(20),
            'beneficiary_since' => $this->faker->optional()->date('Y-m-d')
        ];
    }
}

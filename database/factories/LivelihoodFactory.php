<?php

namespace Database\Factories;

use App\Models\LivelihoodType;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Livelihood>
 */
class LivelihoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()?->resident_id ?? Resident::factory(),
            'livelihood_type_id' => LivelihoodType::inRandomOrder()->first()?->livelihood_type_id ?? LivelihoodType::factory(),
            'monthly_income' => $this->faker->randomFloat(2, 1000, 50000),
            'other' => $this->faker->optional()->jobTitle,
            'is_main_livelihood' => $this->faker->boolean(60),
            'started_at' => $this->faker->date(),
            'ended_at' => $this->faker->optional(0.3)->date(),
        ];
    }
}

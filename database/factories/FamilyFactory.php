<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Family>
 */
class FamilyFactory extends Factory
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
            'household_id' => Household::inRandomOrder()->first()?->id,
            'income_bracket' => $this->faker->randomElement([
                'Below PHP 5,000 (Survival)',
                'PHP 5,001 - PHP 10,000 (Poor)',
                'PHP 10,001 - PHP 20,000 (Low Income)',
                'PHP 20,001 - PHP 40,000 (Lower Middle Income)',
                'PHP 40,001 - PHP 70,000 (Middle Income)',
                'PHP 70,001 - PHP 120,000 (Upper Middle Income)',
                'PHP 120,001 and above (High Income)',
            ]),
            'family_name' => $this->faker->lastName . ' Family',
            'family_type' => $this->faker->randomElement(['nuclear', 'extended', 'single-parent', 'other']),
        ];
    }
}

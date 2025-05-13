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
            'household_id' => Household::inRandomOrder()->first()?->id ?? Household::factory(),
            'income_bracket' => $this->faker->randomElement([
                'below_5000_survival',
                '5001_10000_poor',
                '10001_20000_low_income',
                '20001_40000_lower_middle_income',
                '40001_70000_middle_income',
                '70001_120000_upper_middle_income',
                '120001_above_high_income',
            ]),
            'family_name' => $this->faker->lastName . ' Family',
            'family_type' => $this->faker->randomElement(['nuclear', 'extended', 'single-parent', 'other']),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InternetAccessibility>
 */
class InternetAccessibilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'household_id' => Household::inRandomOrder()->first(),
            'type_of_internet' => $this->faker->randomElement(['mobile_data', 'wireless_fidelity', 'other']),
        ];
    }
}

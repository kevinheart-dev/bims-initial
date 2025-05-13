<?php

namespace Database\Factories;

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
            'resident_id' => \App\Models\Resident::factory(),
            'type_of_internet' => $this->faker->randomElement(['mobile_data', 'wireless_fidelity', 'other']),
            'isp' => $this->faker->company,
            'is_changed' => $this->faker->boolean(20), // 20% chance true
        ];
    }
}

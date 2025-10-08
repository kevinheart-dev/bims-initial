<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BathAndWash>
 */
class BathAndWashFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'household_id' => Household::inRandomOrder()->value('id') ?? Household::factory(),
            'bath_and_wash_area' => $this->faker->randomElement([
                'with_own_sink_and_bath',
                'communal_bath_area',
                'no_bath_area',
                'outdoor_bathing',
                'shared_with_another_household',
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

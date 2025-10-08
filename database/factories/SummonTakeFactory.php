<?php

namespace Database\Factories;

use App\Models\Summon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SummonTake>
 */
class SummonTakeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'summon_id'       => Summon::factory(),
            'session_number'  => 1, // will override in seeder
            'hearing_date'    => $this->faker->dateTimeBetween('-2 months', '+1 month')->format('Y-m-d'),
            'session_status'  => $this->faker->randomElement(['scheduled', 'in_progress', 'completed', 'adjourned', 'cancelled', 'no_show']),
            'session_remarks' => $this->faker->optional()->sentence(),
        ];
    }
}

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

        $livelihoods = [
            ['type' => 'Farming', 'desc' => 'Rice and vegetable farming'],
            ['type' => 'Fishing', 'desc' => 'Small-scale coastal fishing'],
            ['type' => 'Tricycle Driving', 'desc' => 'Public transport service'],
            ['type' => 'Sari-sari Store', 'desc' => 'Small retail shop at home'],
            ['type' => 'Carpentry', 'desc' => 'Woodworks and small-scale construction'],
            ['type' => 'Dressmaking', 'desc' => 'Tailoring and repair services'],
            ['type' => 'Street Vending', 'desc' => 'Food and goods selling'],
            ['type' => 'Online Selling', 'desc' => 'Clothes and gadgets'],
            ['type' => 'Handicrafts', 'desc' => 'Bamboo and rattan crafts'],
            ['type' => 'Poultry', 'desc' => 'Chicken and egg production'],
            ['type' => 'Livestock', 'desc' => 'Pig raising and goat keeping'],
        ];

        $livelihood = $this->faker->randomElement($livelihoods);

        $startedAt = $this->faker->dateTimeBetween('-10 years', '-1 year');
        $isActive = $this->faker->boolean(70);

        return [
            // Pick an existing resident instead of making a new one
            'resident_id' => Resident::inRandomOrder()->value('id'),

            'livelihood_type' => $livelihood['type'],
            'description' => $livelihood['desc'],
            'is_main_livelihood' => $this->faker->boolean(50),
            'started_at' => $startedAt,
            'ended_at' => $isActive ? null : $this->faker->dateTimeBetween($startedAt, 'now'),
            'average_monthly_income' => $this->faker->randomFloat(2, 2000, 15000),
            'status' => $isActive
                ? $this->faker->randomElement(['active', 'seasonal'])
                : $this->faker->randomElement(['inactive', 'ended']),
        ];
    }
}

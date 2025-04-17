<?php

namespace Database\Factories;

use App\Models\Purok;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DisasterRisk>
 */
class DisasterRiskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'purok_id' => Purok::inRandomOrder()->first()->id ?? 1,
            'risk_type' => $this->faker->randomElement(['flood', 'earthquake', 'landslide', 'fire', 'storm surge', 'typhoon', 'others']),
            'risk_level' => $this->faker->randomElement(['low', 'moderate', 'high', 'very high']),
        ];
    }
}

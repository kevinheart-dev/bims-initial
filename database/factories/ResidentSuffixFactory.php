<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResidentSuffix>
 */
class ResidentSuffixFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()?->id,
            'suffix' => $this->faker->optional()->randomElement(['sr', 'jr', 'II', 'III', 'IV', 'V']),
        ];
    }
}

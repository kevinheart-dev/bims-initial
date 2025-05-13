<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HouseholdToilet>
 */
class HouseholdToiletFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $toiletTypes = [
            'flush_toilet',
            'water_sealed',
            'compost_pit_toilet',
            'shared_communal_public_toilet',
            'no_latrine',
            'not_mentioned_specify'
        ];

        $toiletType = $this->faker->randomElement($toiletTypes);

        return [
            'household_id' => Household::inRandomOrder()->first()?->id,
            'toilet_type' => $toiletType,
            'other_type' => $toiletType === 'not_mentioned_specify' ? $this->faker->words(2, true) : null,
        ];
    }
}

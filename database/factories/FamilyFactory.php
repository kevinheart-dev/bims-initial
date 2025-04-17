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
            'household_id' => Household::inRandomOrder()->first()?->id ?? 1,
            'family_name' => $this->faker->lastName . ' Family',
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PregnancyRecords>
 */
class PregnancyRecordsFactory extends Factory
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
            'is_pregnant' => $this->faker->boolean,
            'expected_due_date' => $this->faker->date,
            'notes' => $this->faker->paragraph,
        ];
    }
}

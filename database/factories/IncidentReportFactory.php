<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IncidentReport>
 */
class IncidentReportFactory extends Factory
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
            'date_of_incident' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'type_of_incident' => $this->faker->sentence(3),
            'narrative_details' => $this->faker->paragraph,
            'actions_taken' => $this->faker->paragraph,
            'recommendations' => $this->faker->paragraph,
            'reported_by' => Resident::inRandomOrder()->first()?->id,
            'reviewed_by' => Resident::inRandomOrder()->first()?->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

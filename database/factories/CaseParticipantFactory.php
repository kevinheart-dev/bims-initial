<?php

namespace Database\Factories;

use App\Models\BlotterReport;
use App\Models\IncidentReport;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseParticipant>
 */
class CaseParticipantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'incident_id' => IncidentReport::inRandomOrder()->first()?->id,
            'blotter_id' => BlotterReport::inRandomOrder()->first()?->id,
            'resident_id' => Resident::inRandomOrder()->first()?->id,
            'name' => $this->faker->name,
            'role_type' => $this->faker->randomElement(['complainant', 'respondent', 'witness', 'victim', 'reporter', 'accomplice']),
            'notes' => $this->faker->paragraph,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

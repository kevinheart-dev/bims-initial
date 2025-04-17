<?php

namespace Database\Factories;

use App\Models\IncidentReport;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlotterReport>
 */
class BlotterReportFactory extends Factory
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
            'compliant_id' => Resident::inRandomOrder()->first()?->id,
            'compliant_name' => $this->faker->name,
            'barangay_id' => 1,
            'report_type' => $this->faker->randomElement(['summon', 'complaint']),
            'type_of_incident' => $this->faker->sentence(3),
            'narrative_details' => $this->faker->paragraph,
            'actions_taken' => $this->faker->paragraph,
            'report_status' => $this->faker->randomElement(['pending', 'under mediation', 'resolved', 'dismissed']),
            'resolution' => $this->faker->paragraph,
            'recorded_by' => Resident::inRandomOrder()->first()?->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

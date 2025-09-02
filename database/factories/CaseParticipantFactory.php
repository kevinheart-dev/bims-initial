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
        // realistic role distribution
        $role = $this->faker->randomElement(['complainant', 'respondent', 'witness']);

        // optional realistic notes
        $notesOptions = [
            'Alleged involvement in domestic dispute',
            'Reported theft of personal property',
            'Observed the incident',
            'Provided statement to barangay',
            'Neighbor involved in noise complaint',
            'Dispute over property boundary'
        ];

        // pick a random resident or leave null for outsider
        $residentId = $this->faker->optional(0.8)->randomElement(\App\Models\Resident::pluck('id')->toArray());

        // fallback name if no resident_id
        $name = $residentId ? null : $this->faker->name();

        return [
            'blotter_id' => BlotterReport::inRandomOrder()->first()?->id ?? 1,
            'resident_id' => $residentId,
            'name' => $name,
            'role_type' => $role,
            'notes' => $this->faker->optional()->randomElement($notesOptions),
        ];
    }
}

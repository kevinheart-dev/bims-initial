<?php

namespace Database\Factories;

use App\Models\BarangayOfficial;
use App\Models\BlotterReport;
use App\Models\CaseParticipant;
use App\Models\Resident;
use App\Models\Summon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Summon>
 */
class SummonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pick a random participant
        $participant = CaseParticipant::inRandomOrder()->first();

        // Determine the blotter ID
        $blotterId = $participant?->blotter_id ?? BlotterReport::first()?->blotter_id ?? 1;

        // Determine the hearing number for this participant (1 to 3)
        $lastHearingNumber = Summon::where('case_participant_id', $participant?->participant_id)
            ->max('hearing_number') ?? 0;

        $hearingNumber = min($lastHearingNumber + 1, 3); // max 3 hearings

        // realistic status based on hearing number
        $status = $hearingNumber < 3
            ? $this->faker->randomElement(['Pending', 'Attended', 'Ignored'])
            : 'Resolved';

        // realistic remarks
        $remarksOptions = [
            'Respondent attended the hearing',
            'No appearance from respondent',
            'Case postponed due to absence',
            'Mediated by barangay official',
            'Warning issued'
        ];

        return [
            'blotter_id' => $blotterId,
            'case_participant_id' => $participant?->participant_id ?? 1,
            'hearing_number' => $hearingNumber,
            'status' => $status,
            'remarks' => $this->faker->optional()->randomElement($remarksOptions),
            'hearing_date' => $this->faker->dateTimeBetween('-2 months', '+1 month'),
            'issued_by' => BarangayOfficial::inRandomOrder()->first()?->id ?? 1,
        ];
    }

}

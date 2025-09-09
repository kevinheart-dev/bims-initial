<?php

namespace Database\Factories;

use App\Models\CaseParticipant;
use App\Models\SummonTake;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SummonParticipantAttendance>
 */
class SummonParticipantAttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Pick a summon take
        $takeId = SummonTake::inRandomOrder()->first()?->id ?? SummonTake::factory()->create()->id;

        // Pick a random participant linked to the SAME blotter as the summon
        $summonTake = SummonTake::with('summon')->find($takeId);
        $participant = $summonTake
            ? CaseParticipant::where('blotter_id', $summonTake->summon->blotter_id)->inRandomOrder()->first()
            : CaseParticipant::factory()->create();

        return [
            'take_id'           => $takeId,
            'participant_id'    => $participant->id,
            'attendance_status' => $this->faker->randomElement(['pending', 'attended', 'missed', 'rescheduled']),
        ];
    }
}

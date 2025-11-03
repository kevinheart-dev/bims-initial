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
        // Pick a random blotter case
        $blotterId = BlotterReport::inRandomOrder()->first()?->id ?? 1;

        // Status is simpler now (case-level)
        $status = $this->faker->randomElement(['arbitration', 'medication','conciliation', 'issued_file_to_action', 'closed']);

        return [
            'blotter_id' => $blotterId,
            'status'     => $status,
            'issued_by'  => BarangayOfficial::inRandomOrder()->first()?->id ?? 1,
        ];
    }

}

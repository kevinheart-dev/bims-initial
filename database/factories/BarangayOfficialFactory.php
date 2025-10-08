<?php

namespace Database\Factories;

use App\Models\BarangayOfficial;
use App\Models\BarangayOfficialTerm;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayOfficial>
 */
class BarangayOfficialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = BarangayOfficial::class;

    public function definition(): array
    {
        // Pick a random resident ID from existing residents
        $residentId = Resident::inRandomOrder()->value('id');

        // Pick a random active term id
        $termId = BarangayOfficialTerm::where('status', 'active')->inRandomOrder()->value('id');

        // Random appointment types & status
        $appointmentTypes = ['elected', 'appointed', 'succession'];
        $statuses = ['active', 'inactive'];

        // Positions respecting your limits should be controlled in Seeder (recommended).
        $positions = [
            'barangay_captain',
            'barangay_secretary',
            'barangay_treasurer',
            'barangay_kagawad',
            'sk_chairman',
            'sk_kagawad',
            'health_worker',
            'tanod'
        ];

        return [
            'resident_id' => $residentId,
            'term_id' => $termId,
            'position' => $this->faker->randomElement($positions),
            'status' => $this->faker->randomElement($statuses),
            'appointment_type' => $this->faker->randomElement($appointmentTypes),
            'appointted_by' => Resident::inRandomOrder()->value('id'), // nullable, can add chance of null if needed
            'appointment_reason' => $this->faker->optional()->sentence(),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }
}

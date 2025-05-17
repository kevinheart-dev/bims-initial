<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResidentVoterInformation>
 */
class ResidentVoterInformationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->value('id'), // or 'resident_id' if that's the PK
            'registered_barangay_id' => 1, // or 'barangay_id'
            'voter_id_number' => $this->faker->optional()->regexify('[A-Z]{2}[0-9]{6}'),
            'voting_status' => $this->faker->randomElement([
                'active', 'inactive'
            ]),
        ];
    }
}

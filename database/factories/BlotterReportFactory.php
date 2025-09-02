<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\BarangayOfficial;
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
        // realistic types of incidents in a barangay
        $incidents = [
            'Petty Theft',
            'Domestic Dispute',
            'Noise Complaint',
            'Vandalism',
            'Assault',
            'Lost Property',
            'Traffic Violation',
            'Barangay Ordinance Violation'
        ];

        // realistic actions taken by barangay
        $actions = [
            'Advised parties to settle amicably',
            'Issued a summon',
            'Referred to police station',
            'Mediated the dispute',
            'Conducted community inspection',
            'Issued warning notice'
        ];

        // realistic resolutions
        $resolutions = [
            'Settled amicably',
            'Pending further investigation',
            'Referred to higher authorities',
            'Respondent complied with barangay directive',
            'Case elevated to Certificate to File Action'
        ];

        return [
            'barangay_id' => 1, // assuming 91 barangays
            'report_type' => $this->faker->randomElement(['Written', 'Verbal']),
            'type_of_incident' => $this->faker->randomElement($incidents),
            'narrative_details' => $this->faker->paragraphs(2, true),
            'actions_taken' => $this->faker->randomElement($actions),
            'report_status' => $this->faker->randomElement(['Pending', 'On-going', 'Resolved', 'Elevated']),
            'location' => $this->faker->streetName() . ', ' . $this->faker->city(), // realistic barangay streets
            'resolution' => $this->faker->optional()->randomElement($resolutions),
            'recommendations' => $this->faker->optional()->sentence(),
            'recorded_by' => BarangayOfficial::inRandomOrder()->first()?->id ?? 1,
            'incident_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'), // realistic incident date
        ];
    }
}

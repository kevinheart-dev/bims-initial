<?php

namespace Database\Factories;

use App\Models\Barangay;
use App\Models\BarangayInstitution;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayProject>
 */
class BarangayProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // Pick a random start date within the last 3 years
        $startDate = $this->faker->dateTimeBetween('-3 years', 'now');

        // Status options
        $statusOptions = ['planning', 'ongoing', 'completed', 'cancelled'];
        $status = $this->faker->randomElement($statusOptions);

        // Funding sources with realistic budget ranges
        $fundingSources = [
            'Barangay Fund' => [10000, 200000],
            'Municipal Grant' => [50000, 1000000],
            'NGO' => [20000, 500000],
            'Private Donor' => [10000, 300000],
            'Government Program' => [200000, 5000000],
        ];

        $fundingSource = $this->faker->randomElement(array_keys($fundingSources));
        [$minBudget, $maxBudget] = $fundingSources[$fundingSource];

        // End date rules
        $endDate = null;
        if ($status === 'completed') {
            $endDate = $this->faker->dateTimeBetween($startDate, 'now');
        } elseif ($status === 'ongoing') {
            $endDate = null; // still running
        } elseif ($status === 'planning') {
            $startDate = $this->faker->dateTimeBetween('now', '+6 months'); // future start
        }

        // Project categories
        $categories = [
            'Infrastructure',
            'Health',
            'Education',
            'Environment',
            'Livelihood',
            'Disaster Preparedness',
            'Community Services'
        ];

        // More realistic project titles
        $sampleTitles = [
            'Road Rehabilitation',
            'Drainage Improvement',
            'Barangay Health Mission',
            'Day Care Center Renovation',
            'Tree Planting Program',
            'Livelihood Training Workshop',
            'Disaster Response Equipment',
            'Feeding Program for Children',
            'Barangay Street Lighting'
        ];

        return [
            'barangay_id' => 1,
            'project_image' => null,
            'title' => $this->faker->randomElement($sampleTitles),
            'description' => $this->faker->sentence(15, true),
            'status' => $status,
            'category' => $this->faker->randomElement($categories),
            'responsible_institution' => BarangayInstitution::inRandomOrder()->value('name') ?? BarangayInstitution::factory(),
            'budget' => $this->faker->numberBetween($minBudget, $maxBudget),
            'funding_source' => $fundingSource,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}

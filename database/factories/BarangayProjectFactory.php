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
        // Pick a random start date within the last 5 years
        $startDate = $this->faker->dateTimeBetween('-5 years', 'now');

        // End date could be after start date or null if ongoing
        $endDate = $this->faker->boolean(70) // 70% chance to have an end date
            ? $this->faker->dateTimeBetween($startDate, '+1 year')
            : null;

        // Status options
        $statusOptions = ['planning', 'ongoing', 'completed', 'cancelled'];

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

        return [
            'barangay_id' => 1,
            'title' => $this->faker->words(3, true) . ' Project',
            'description' => $this->faker->paragraphs(2, true),
            'status' => $this->faker->randomElement($statusOptions),
            'category' => $this->faker->randomElement($categories),
            'responsible_institution_id' => BarangayInstitution::inRandomOrder()->value('id') ?? BarangayInstitution::factory(),
            'budget' => $this->faker->numberBetween(50000, 5000000),
            'funding_source' => $this->faker->randomElement(['Barangay Fund', 'Municipal Grant', 'NGO', 'Private Donor', 'Government Program']),
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}

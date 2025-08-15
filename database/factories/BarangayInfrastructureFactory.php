<?php

namespace Database\Factories;

use App\Models\BarangayInfrastructure;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayInfrastructure>
 */
class BarangayInfrastructureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = BarangayInfrastructure::class;

    public function definition()
    {
        $infrastructureTypes = [
            'Road', 'Bridge', 'Drainage System', 'Streetlight', 'Health Center',
            'Day Care Center', 'School Building', 'Multi-Purpose Hall', 'Covered Court',
            'Barangay Hall', 'Public Market', 'Waiting Shed', 'Water Supply System'
        ];

        $infrastructureCategories = [
            'Transportation', 'Utilities', 'Education', 'Health', 'Community Facility', 'Public Safety'
        ];

        return [
            'barangay_id' => 1,
            'infrastructure_type' => $this->faker->randomElement($infrastructureTypes),
            'infrastructure_category' => $this->faker->randomElement($infrastructureCategories),
            'quantity' => $this->faker->numberBetween(1, 20),
        ];
    }

}

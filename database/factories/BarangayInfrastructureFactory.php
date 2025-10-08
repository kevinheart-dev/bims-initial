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

    public function definition(): array
    {
        $infrastructures = [
            // Disaster & Community Facilities
            'Evacuation Center' => 'Disaster & Community Facility',
            'Flood Control' => 'Disaster & Community Facility',
            'Rain Water Harvester (Communal)' => 'Disaster & Community Facility',
            'Barangay Disaster Operation Center' => 'Disaster & Community Facility',
            'Public Comfort Room/Toilet' => 'Disaster & Community Facility',
            'Community Garden' => 'Disaster & Community Facility',

            // Health & Medical
            'Barangay Health Center' => 'Health & Medical',
            'Hospital' => 'Health & Medical',
            'Maternity Clinic' => 'Health & Medical',
            'Child Clinic' => 'Health & Medical',
            'Private Medical Clinic' => 'Health & Medical',
            'Barangay Drug Store' => 'Health & Medical',
            'City/Municipal Public Drug Store' => 'Health & Medical',
            'Private Drug Store' => 'Health & Medical',
            'Quarantine/Isolation Facility' => 'Health & Medical',

            // Education
            'Child Development Center' => 'Education',
            'Preschool' => 'Education',
            'Elementary' => 'Education',
            'Secondary' => 'Education',
            'Vocational' => 'Education',
            'College/University' => 'Education',
            'Islamic School' => 'Education',

            // Agricultural
            'Rice Mill' => 'Agricultural',
            'Corn Mill' => 'Agricultural',
            'Feed Mill' => 'Agricultural',
            'Agricultural Produce Market' => 'Agricultural',
        ];

        static $index = 0;
        $types = array_keys($infrastructures);

        $type = $types[$index % count($types)];
        $category = $infrastructures[$type];
        $index++;

        // realistic quantity based on category
        $quantity = match($category) {
            'Disaster & Community Facility' => $this->faker->numberBetween(0, 2),
            'Health & Medical' => $this->faker->numberBetween(1, 2),
            'Education' => $this->faker->numberBetween(1, 3),
            'Agricultural' => $this->faker->numberBetween(1, 5),
            default => 1,
        };

        return [
            'barangay_id' => 1,
            'infrastructure_image' => null,
            'infrastructure_type' => $type,
            'infrastructure_category' => $category,
            'quantity' => $quantity,
        ];
    }

}

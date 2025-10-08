<?php

namespace Database\Factories;

use App\Models\Household;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HouseholdWasteManagement>
 */
class HouseholdWasteManagementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        $wasteTypes = [
            'open_dump_site',
            'sanitary_landfill',
            'compost_pits',
            'material_recovery_facility',
            'garbage_is_collected',
        ];

        return [
            'household_id' => Household::inRandomOrder()->value('id') ?? Household::factory(),
            'waste_management_type' => $this->faker->randomElement($wasteTypes),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\BarangayInstitution;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayInstitutionMember>
 */
class BarangayInstitutionMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'institution_id' => BarangayInstitution::inRandomOrder()->first()->id,
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'member_since' => $this->faker->date(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

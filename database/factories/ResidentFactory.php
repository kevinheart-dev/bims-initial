<?php

namespace Database\Factories;

use App\Models\Family;
use App\Models\Household;
use App\Models\Purok;
use App\Models\Street;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Resident>
 */
class ResidentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $suffixes = ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'];
        return [
            'barangay_id' => 1,
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->firstName,
            'lastname' => $this->faker->lastName,
            'maiden_name' => $this->faker->optional()->lastName,
            'suffix' => $this->faker->optional()->randomElement($suffixes),
            'gender' => $this->faker->randomElement(['male', 'female', 'LGBTQ+']),
            'birthdate' => $this->faker->date(),
            'birthplace' => $this->faker->city . ', ' . $this->faker->state,
            'civil_status' => $this->faker->randomElement(['single', 'married', 'widowed', 'separated', 'divorced', 'single']),
            'civil_status_other' => $this->faker->optional()->word(),
            'registered_voter' => $this->faker->boolean(),
            'precint_number' => $this->faker->bothify('####??##'),
            'employment_status' => $this->faker->randomElement(['employed', 'unemployed', 'student', 'retired', 'student']),
            'nationality' => 'Filipino',
            'religion' => 'Roman Catholic',
            'contact_number' => $this->faker->numerify('09#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'purok_number' => $this->faker->numberBetween(1, 10),
            'street_id' => Street::inRandomOrder()->first()?->id ?? Street::factory(),
            'residency_date' => $this->faker->date(),
            'residency_type' => $this->faker->randomElement(['permanent', 'temporary', 'migrant']),
            'resident_picture_path' => 'images/csa-profile.png',
            'is_pwd' => $this->faker->boolean(10), // 10% chance
            'ethnicity' => $this->faker->optional()->word(),
            'date_of_death' => $this->faker->optional()->date(),
            'household_id' => Household::inRandomOrder()->first()?->id ?? Household::factory(),
            'is_household_head' => $this->faker->boolean(),
            'family_id' => Family::inRandomOrder()->first()?->id ?? Family::factory(),
            'is_family_head' => $this->faker->boolean(),
        ];
    }
}

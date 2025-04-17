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
        return [
            'barangay_id' => 1,
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->optional()->firstName,
            'lastname' => $this->faker->lastName,
            'suffix' => $this->faker->optional()->randomElement(['sr', 'jr', 'II', 'III', 'IV', 'V']),
            'maiden_name' => $this->faker->optional()->lastName,
            'gender' => $this->faker->randomElement(['male', 'female', 'LGBTQ+']),
            'birthdate' => $this->faker->date('Y-m-d', '-18 years'),
            'birthplace' => $this->faker->city,
            'civil_status' => $this->faker->randomElement(['single', 'married', 'widowed', 'separated', 'divorced', 'others']),
            'civil_status_other' => $this->faker->optional()->word,
            'registered_voter' => $this->faker->boolean,
            'precint_number' => $this->faker->optional()->numerify('####-####'),
            'employment_status' => $this->faker->randomElement(['employed', 'unemployed', 'student', 'retired', 'others']),
            'educational_attainment' => $this->faker->randomElement([
                'No Formal Education', 'Elementary Level', 'Elementary Graduate',
                'High School Level', 'High School Graduate', 'College Level',
                'College Graduate', 'Vocational', 'Post Graduate', 'ALS Graduate'
            ]),
            'nationality' => 'Filipino',
            'religion' => $this->faker->optional()->word,
            'contact_number' => '09234234342',
            'email' => $this->faker->optional()->safeEmail,
            'purok_id' => Purok::inRandomOrder()->first()?->id ?? null,
            'street_id' => Street::inRandomOrder()->first()?->id ?? null,
            'residency_date' => $this->faker->date(),
            'residency_type' => $this->faker->randomElement(['permanent', 'temporary', 'migrant']),
            'resident_picture_path' => $this->faker->optional()->imageUrl(),
            'is_disabled' => $this->faker->boolean(10),
            'ethnicity' => $this->faker->optional()->word,
            'status' => $this->faker->randomElement(['active', 'inactive', 'deceased']),
            'household_id' => null,
            'is_household_head' => $this->faker->boolean(15),
            'family_id' => Family::inRandomOrder()->first()?->id ?? null,
            'is_family_head' => $this->faker->boolean(20),
        ];
    }
}

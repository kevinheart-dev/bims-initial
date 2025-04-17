<?php

namespace Database\Factories;

use App\Models\Household;
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
        $birthdate = $this->faker->dateTimeBetween('-80 years', '-18 years');
        $age = now()->diff($birthdate)->y;
        return [
            'barangay_id' => 1, // or Barangay::factory()
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->firstName,
            'lastname' => $this->faker->lastName,
            'suffix' => $this->faker->optional()->randomElement(['Jr', 'Sr', 'III']),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birthdate' => $this->faker->date('Y-m-d', '-18 years'),
            'age' => $this->faker->numberBetween(1, 100),
            'birthplace' => $this->faker->city,
            'civil_status' => $this->faker->randomElement(['single', 'married', 'widowed', 'separated', 'divorced', 'others']),
            'civil_status_other' => null,
            'voter_status' => $this->faker->randomElement(['registered', 'not_registered', 'inactive', 'deceased']),
            'precint_no' => $this->faker->optional()->regexify('[A-Z]{3}-[0-9]{3}'),
            'employment_status' => $this->faker->randomElement(['employed', 'unemployed', 'student', 'retired', 'others']),
            'educational_attainment' => $this->faker->randomElement([
                'No Formal Education', 'Elementary Level', 'Elementary Graduate',
                'High School Level', 'High School Graduate',
                'College Level', 'College Graduate',
                'Vocational', 'Post Graduate', 'ALS Graduate'
            ]),
            'nationality' => 'Filipino',
            'religion' => $this->faker->randomElement(['Catholic', 'Christian', 'Muslim', 'None']),
            'contact_number' => $this->faker->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'purok' => $this->faker->numberBetween(1, 10),
            'residency_date' => $this->faker->date(),
            'resident_picture' => null,
            'is_disabled' => $this->faker->boolean(10),
            'ethnicity' => $this->faker->optional()->word,
            'status' => 'active',
            'household_id' => null,
            'family_id' => null,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Family;
use App\Models\Household;
use App\Models\Purok;
use App\Models\Resident;
use App\Models\Street;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


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

        // Get or create a family
        $randomFamily = Family::inRandomOrder()->first() ?? Family::factory()->create();

        // Resolve household model from family
        $household = $randomFamily->household_id
            ? Household::find($randomFamily->household_id)
            : Household::inRandomOrder()->first() ?? Household::factory()->create();

        // If family has no household assigned yet, update it
        if (!$randomFamily->household_id) {
            $randomFamily->update(['household_id' => $household->id]);
        }

        // Clean last name from family name
        $lname = preg_replace('/family/i', '', $randomFamily->family_name);

        // Get or create street
        $street = Street::inRandomOrder()->first() ?? Street::factory()->create();

        // Determine family head logic
        $familyType = $randomFamily->family_type ?? 'nuclear';
        $alreadyHasFamilyHead = Resident::where('family_id', $randomFamily->id)
            ->where('is_family_head', true)
            ->exists();

        $isFamilyHead = $familyType === 'extended'
            ? (bool) random_int(0, 1)
            : !$alreadyHasFamilyHead;

        // Determine household head logic
        $alreadyHasHouseholdHead = Resident::where('household_id', $household->id)
            ->where('is_household_head', true)
            ->exists();

        $isHouseholdHead = !$alreadyHasHouseholdHead;

        return [
            'barangay_id' => 1,
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->firstName,
            'lastname' => $lname,
            'maiden_name' => $this->faker->optional()->lastName,
            'suffix' => $this->faker->optional()->randomElement($suffixes),
            'gender' => $this->faker->randomElement(['male', 'female', 'LGBTQ']),
            'birthdate' => $this->faker->dateTimeBetween('-100 years', '-1 year')->format('Y-m-d'),
            'birthplace' => $this->faker->city . ', ' . $this->faker->state,
            'civil_status' => $this->faker->randomElement(['single', 'married', 'widowed', 'separated', 'divorced', 'annulled']),
            'registered_voter' => $this->faker->boolean(80),
            'voter_id_number' => $this->faker->optional()->numerify('############'),
            'employment_status' => $this->faker->randomElement(['employed', 'unemployed', 'self_employed', 'student', 'under_employed']),
            'citizenship' => 'Filipino',
            'religion' => 'Roman Catholic',
            'contact_number' => $this->faker->numerify('09#########'),
            'email' => $this->faker->unique()->safeEmail(),
            'purok_number' => $this->faker->numberBetween(1, 7),
            'street_id' => $street->id,
            'residency_date' => $this->faker->year(),
            'residency_type' => $this->faker->randomElement(['permanent', 'temporary', 'migrant']),
            'resident_picture_path' => $this->faker->optional()->imageUrl(300, 300, 'people') ??
                'https://ui-avatars.com/api/?name=' . urlencode($this->faker->name()) . '&size=300',
            'is_pwd' => $this->faker->boolean(10),
            'ethnicity' => $this->faker->optional()->word(),
            'date_of_death' => $this->faker->optional()->date(),
            'household_id' => $household->id,
            'is_household_head' => $isHouseholdHead,
            'family_id' => $randomFamily->id,
            'is_family_head' => $isFamilyHead,
            'verified' => true,
        ];
    }
}

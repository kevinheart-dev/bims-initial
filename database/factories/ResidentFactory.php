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

        $randomFamily = Family::inRandomOrder()->first() ?? Family::factory()->create();

        $household = $randomFamily->household_id
            ? Household::find($randomFamily->household_id)
            : Household::inRandomOrder()->first() ?? Household::factory()->create();

        if (!$randomFamily->household_id) {
            $randomFamily->update(['household_id' => $household->id]);
        }

        $lname = preg_replace('/family/i', '', $randomFamily->family_name);
        $lname = trim($lname); // Remove extra spaces

        $street = Street::inRandomOrder()->first() ?? Street::factory()->create();

        $familyType = $randomFamily->family_type ?? 'nuclear';
        $alreadyHasFamilyHead = Resident::where('family_id', $randomFamily->id)
            ->where('is_family_head', true)
            ->exists();
        $isFamilyHead = $familyType === 'extended'
            ? (bool) random_int(0, 1)
            : !$alreadyHasFamilyHead;

        $alreadyHasHouseholdHead = Resident::where('household_id', $household->id)
            ->where('is_household_head', true)
            ->exists();
        $isHouseholdHead = !$alreadyHasHouseholdHead;

        // Gender and names
        $gender = $this->faker->randomElement(array_merge(
            array_fill(0, 45, 'male'),
            array_fill(0, 45, 'female'),
            array_fill(0, 10, 'LGBTQ')
        ));

        $firstName = $gender === 'female' ? $this->faker->firstNameFemale() : $this->faker->firstNameMale();
        $middleName = $this->faker->firstName();
        $birthdate = $this->faker->dateTimeBetween('-100 years', '-1 year')->format('Y-m-d');

        return [
            'barangay_id' => 1,
            'firstname' => $firstName,
            'middlename' => $middleName,
            'lastname' => $lname,
            'maiden_name' => $gender === 'female' ? $this->faker->optional()->lastName : null,
            'suffix' => $this->faker->optional(0.1)->randomElement($suffixes),
            'gender' => $gender,
            'birthdate' => $birthdate,
            'birthplace' => $this->faker->city . ', ' . $this->faker->state,
            'civil_status' => $this->faker->randomElement([
                'single', 'married', 'widowed', 'separated', 'divorced', 'annulled'
            ]),
            'registered_voter' => $this->faker->boolean(75),
            'voter_id_number' => $this->faker->optional(0.6)->numerify('##########'),
            'employment_status' => $this->faker->randomElement([
                'employed', 'unemployed', 'self_employed', 'student', 'under_employed'
            ]),
            'citizenship' => 'Filipino',
            'religion' => $this->faker->randomElement([
                'Roman Catholic', 'Iglesia ni Cristo', 'Islam', 'Evangelical', 'Protestant', 'Others'
            ]),
            'contact_number' => $this->faker->numerify('09#########'),
            'email' => strtolower(
                preg_replace('/[^a-z0-9]/i', '', $firstName . '.' . substr($middleName, 0, 1) . '.' . $lname)
            ) . '@example.com',
            'purok_number' => $this->faker->numberBetween(1, 7),
            'street_id' => $street->id,
            'residency_date' => $this->faker->year('-40 years'),
            'residency_type' => $this->faker->randomElement(['permanent', 'temporary', 'migrant']),
            'resident_picture_path' => $this->faker->optional()->imageUrl(300, 300, 'people') ??
                'https://ui-avatars.com/api/?name=' . urlencode($firstName . ' ' . $middleName . ' ' . $lname) . '&size=300',
            'is_pwd' => $this->faker->boolean(10),
            'ethnicity' => $this->faker->randomElement([
                'Tagalog', 'Ilocano', 'Bisaya', 'Bicolano', 'Kapampangan'
            ]),
            'date_of_death' => $this->faker->optional(0.02)->dateTimeBetween('-20 years', 'now')?->format('Y-m-d'),
            'household_id' => $household->id,
            'is_household_head' => false,
            'family_id' => $randomFamily->id,
            'is_family_head' => $isFamilyHead,
            'verified' => true,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\BarangayInstitution;
use App\Models\BarangayInstitutionMember;
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
        protected $model = BarangayInstitutionMember::class;

        public function definition()
        {
            return [
                'institution_id' => BarangayInstitution::inRandomOrder()->value('id') ?? BarangayInstitution::factory(),
                'resident_id'    => Resident::inRandomOrder()->value('id') ?? Resident::factory(),
                'is_head'        => false, // default, overridden later
                'member_since'   => $this->faker->date(),
                'status'         => $this->faker->randomElement(['active', 'inactive', 'active', 'active']), // bias to active
            ];
        }

        /**
         * Assign this member as the head of the institution.
         */
        public function head()
        {
            return $this->state(fn () => ['is_head' => true]);
        }

}

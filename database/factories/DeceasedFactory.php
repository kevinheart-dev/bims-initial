<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deceased>
 */
class DeceasedFactory extends Factory
{
    public function definition(): array
    {
        return [
            'resident_id' => Resident::factory(), // or pass externally
            'date_of_death' => $this->faker->dateTimeBetween('-20 years', 'now')->format('Y-m-d'),
            'cause_of_death' => $this->faker->randomElement([
                'Heart Attack',
                'Stroke',
                'Pneumonia',
                'COVID-19',
                'Cancer',
                'Accident',
                'Unknown',
            ]),
            'place_of_death' => $this->faker->city,
            'burial_place' => $this->faker->city . ' Cemetery',

            // FIX: null-safe
            'burial_date' => ($date = $this->faker->optional(0.7)->dateTimeBetween('now', '+30 days'))
                ? $date->format('Y-m-d')
                : null,

            'death_certificate_number' => strtoupper($this->faker->bothify('DC-#####')),
            'remarks' => $this->faker->optional()->sentence,
        ];
    }
}


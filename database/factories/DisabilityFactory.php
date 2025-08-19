<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Disability>
 */
class DisabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Common disability types in PH context (aligned with NCDA and PhilHealth classifications)
        $disabilityTypes = [
            'Visual Impairment',
            'Hearing Impairment',
            'Mobility Impairment',
            'Speech/Communication Disorder',
            'Intellectual Disability',
            'Psychosocial Disability',
            'Chronic Illness-related Disability',
        ];

        return [
            'resident_id' => Resident::inRandomOrder()->first()?->id,
            // Pick a realistic disability type
            'disability_type' => $this->faker->randomElement($disabilityTypes),
        ];
    }
}

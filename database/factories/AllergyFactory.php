<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Allergy>
 */
class AllergyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $allergyNames = [
            'Peanuts',
            'Shellfish',
            'Dust Mites',
            'Pollen',
            'Milk',
            'Eggs',
            'Wheat',
            'Soy',
            'Latex',
            'Bee Stings',
            'Penicillin',
            'Aspirin',
        ];

        $reactionDescriptions = [
            'Mild rash and itching on the skin',
            'Difficulty breathing and chest tightness',
            'Swelling of lips and face',
            'Nausea, vomiting, and stomach cramps',
            'Severe anaphylaxis requiring epinephrine',
            'Sneezing and watery eyes',
            'Chronic cough and throat irritation',
        ];

        return [
            'resident_id' => Resident::inRandomOrder()->value('id') ?? Resident::factory(), // or pick existing with ->random()
            'allergy_name' => $this->faker->randomElement($allergyNames),
            'reaction_description' => $this->faker->randomElement($reactionDescriptions),
        ];
    }
}

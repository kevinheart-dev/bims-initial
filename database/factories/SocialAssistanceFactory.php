<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialAssistance>
 */
class SocialAssistanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => Resident::inRandomOrder()->first()->id,
            'assistance_type' => $this->faker->randomElement([
                '4Ps', 'Financial Aid', 'Livelihood Assistance', 'Educational Assistance',
                'Medical Assistance', 'Senior Citizen Pension', 'PWD Support',
                'Solo Parent Support', 'Others'
            ]),
            'amount' => $this->faker->randomFloat(2, 500, 5000),
            'assistance_status' => $this->faker->randomElement(['active', 'inactive', 'suspended']),
            'assistance_source' => $this->faker->word,
            'start_date' => $this->faker->date,
            'end_date' => $this->faker->date,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\BarangayOfficial;
use App\Models\BlotterReport;
use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Summon>
 */
class SummonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'blotter_id' => BlotterReport::inRandomOrder()->first()->id,
            'respondent_id' => Resident::inRandomOrder()->first()->id,
            'name' => $this->faker->name,
            'status' => $this->faker->randomElement(['pending', 'attended', 'missed', 'rescheduled']),
            'remarks' => $this->faker->sentence,
            'issued_by' => BarangayOfficial::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

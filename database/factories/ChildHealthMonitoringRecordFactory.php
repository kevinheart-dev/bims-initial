<?php

namespace Database\Factories;

use App\Models\Resident;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChildHealthMonitoringRecord>
 */
class ChildHealthMonitoringRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'resident_id' => Resident::whereDate('birthdate', '>', now()->subYears(5))
                ->inRandomOrder()
                ->value('id') ?? Resident::factory(['birthdate' => $this->faker->dateTimeBetween('-5 years', 'now')]),
            'head_circumference' => $this->faker->randomFloat(2, 32, 50),
            'developmental_milestones' => $this->faker->randomElement([
                'Able to crawl and sit without support',
                'Starting to walk with assistance',
                'Can say basic words like mama or papa',
                'Shows ability to follow simple instructions',
                'Able to hold objects and transfer them between hands',
                'Can recognize familiar faces and respond to sounds',
            ]),
        ];
    }
}

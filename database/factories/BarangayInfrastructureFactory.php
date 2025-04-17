<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangayInfrastructure>
 */
class BarangayInfrastructureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_id' => 1,
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['planning', 'ongoing', 'completed', 'cancelled']),
            'category' => $this->faker->randomElement([
                'infrastructure', 'healthcare', 'education', 'livelihood', 'training',
                'disaster preparedness', 'environmental', 'peace and order', 'others'
            ]),
            'responsible_institution' => rand(1, 5),
            'other' => $this->faker->word(),
            'budget' => $this->faker->randomFloat(2, 10000, 1000000),
            'funding_source' => $this->faker->company(),
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}

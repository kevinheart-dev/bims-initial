<?php

namespace Database\Factories;

use App\Models\BarangayOfficial;
use App\Models\Purok;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Designation>
 */
class DesignationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'barangay_kagawad_id' => BarangayOfficial::inRandomOrder()->first()->id ?? null,
            'sk_kagawad_id' => BarangayOfficial::inRandomOrder()->first()->id ?? null,
            'purok_id' => Purok::inRandomOrder()->first()->id,
            'started_at' => $this->faker->date(),
            'ended_at' => null,
        ];
    }
}

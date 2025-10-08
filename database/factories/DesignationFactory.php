<?php

namespace Database\Factories;

use App\Models\BarangayOfficial;
use App\Models\Purok;
use App\Models\Resident;
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
    protected $model = Designation::class;

    public function definition()
    {
        // Randomly decide if this designation is for barangay_kagawad or sk_kagawad
        $type = $this->faker->randomElement(['barangay_kagawad', 'sk_kagawad']);

        if ($type === 'barangay_kagawad') {
            $resident = Resident::whereHas('barangayOfficials', function ($q) {
                $q->where('position', 'barangay_kagawad');
            })->inRandomOrder()->first();

            $barangayKagawadId = $resident?->id;
            $skKagawadId = null;
        } else {
            $resident = Resident::whereHas('barangayOfficials', function ($q) {
                $q->where('position', 'sk_kagawad');
            })->inRandomOrder()->first();

            $barangayKagawadId = null;
            $skKagawadId = $resident?->id;
        }

        $purok = Purok::inRandomOrder()->first();

        $startYear = $this->faker->year($max = 'now');
        $endYear = $this->faker->optional(0.7)->year($max = 'now'); // 70% chance to have end year

        if ($endYear && $endYear < $startYear) {
            $endYear = $startYear + rand(0, 3);
        }

        return [
            'barangay_kagawad_id' => $barangayKagawadId,
            'sk_kagawad_id' => $skKagawadId,
            'purok_id' => $purok->id,
            'started_at' => $startYear,
            'ended_at' => $endYear,
        ];
    }
}

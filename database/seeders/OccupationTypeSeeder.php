<?php

namespace Database\Seeders;

use App\Models\OccupationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OccupationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $occupationTypes = [
            // Formal sector
            'Teacher',
            'Nurse',
            'Doctor',
            'Police Officer',
            'Soldier',
            'Engineer',
            'Architect',
            'Call Center Agent',
            'IT Specialist',
            'Accountant',
            'Bank Teller',
            'Lawyer',
            'Government Employee',
            'Factory Worker',
            'Construction Worker',
            'Electrician',
            'Plumber',
            'Mechanic',
            'Driver (Jeep)',
            'Driver (Tricycle)',
            'Driver (Truck)',
            'Security Guard',

            // Informal sector
            'Farmer',
            'Fisherman',
            'Vendor',
            'Housemaid',
            'Caretaker',
            'Sari-sari Store Owner',
            'Barber/Hairdresser',
            'Tailor',
            'Delivery Rider',
            'Grab/Taxi Driver',
            'Massage Therapist',
            'Welder',
            'Carpenter',
            'Laborer',
            'Trash Collector',

            // Overseas (OFW)
            'Domestic Helper',
            'Seafarer',
            'Factory Worker',

            // Other statuses
            'Freelancer',
            'Student Assistant',
        ];

        foreach ($occupationTypes as $type) {
            OccupationType::create([
                'name' => $type,
            ]);
        }
    }
}

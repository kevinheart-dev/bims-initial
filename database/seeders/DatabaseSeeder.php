<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\DisasterRisk;
use App\Models\EducationStatus;
use App\Models\Household;
use App\Models\HouseholdResident;
use App\Models\Livelihood;
use App\Models\Livestock;
use App\Models\MedicalInformation;
use App\Models\Occupation;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use App\Models\SocialWelfare;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Barangay::factory(1)->create();
        Household::factory(5)->create();
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $user = User::factory()->create([
            'resident_id' => Resident::factory(),
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'status' => 'active'
        ]);
        $user->assignRole($adminRole);
        $resRole = Role::firstOrCreate(['name' => 'resident']);
        for($i = 0; $i <= 20; $i++){
            $user = User::factory()->create([
                'resident_id' => Resident::factory(),
                'username' => 'Test User',
                'email' => 'test'. "$i" .'@example.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'resident',
                'status' => 'active'
            ]);
            $user->assignRole($resRole);
        }
        HouseholdResident::factory(20)->create();
        Livestock::factory(5)->create();
        Livelihood::factory(15)->create();
        Vehicle::factory(10)->create();
        MedicalInformation::factory(20)->create();
        SocialWelfare::factory(20)->create();
        Occupation::factory(20)->create();
        EducationStatus::factory(20)->create();
        DisasterRisk::factory(7)->create();
        SeniorCitizen::factory(5)->create();
    }
}

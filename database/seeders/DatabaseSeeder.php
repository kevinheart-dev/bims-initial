<?php

namespace Database\Seeders;

use App\Models\Allergy;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use App\Models\Designation;
use App\Models\Disability;
use App\Models\DisasterRisk;
use App\Models\EducationalHistory;
use App\Models\EducationStatus;
use App\Models\Family;
use App\Models\Household;
use App\Models\HouseholdResident;
use App\Models\InternetAccessibility;
use App\Models\Livelihood;
use App\Models\LivelihoodType;
use App\Models\Livestock;
use App\Models\MedicalCondition;
use App\Models\MedicalInformation;
use App\Models\Occupation;
use App\Models\OccupationType;
use App\Models\PregnancyRecords;
use App\Models\Purok;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use App\Models\SocialAssistance;
use App\Models\SocialWelfare;
use App\Models\SocialWelfareProfile;
use App\Models\Street;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Vaccination;
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
        Purok::factory(7)->create();
        Street::factory(30)->create();
        Household::factory(15)->create();

        $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);
        $user = User::factory()->create([
            'resident_id' => Resident::factory(),
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'status' => 'active'
        ]);
        $user->assignRole($barangayOfficer);

        $resRole = Role::firstOrCreate(['name' => 'resident']);
        for($i = 0; $i <= 20; $i++){
            $user = User::factory()->create([
                'resident_id' => Resident::factory(),
                'username' => 'Sample Resident Account',
                'email' => 'user'. "$i" .'@example.com',
                'password' => bcrypt('user123'),
                'email_verified_at' => now(),
                'role' => 'resident',
                'status' => 'active'
            ]);
            $user->assignRole($resRole);
        }

        OccupationType::factory(30)->create();
        LivelihoodType::factory(30)->create();
        Family::factory(7)->create();
        Resident::factory(50)->create();
        HouseholdResident::factory(40)->create();
        InternetAccessibility::factory(15)->create();
        Livelihood::factory(20)->create();
        Occupation::factory(10)->create();
        EducationalHistory::factory(30)->create();
        Vehicle::factory(30)->create();
        Livestock::factory(30)->create();
    }
}

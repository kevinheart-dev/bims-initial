<?php

namespace Database\Seeders;

use App\Models\Allergy;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use App\Models\BarangayOfficialTerm;
use App\Models\Designation;
use App\Models\Disability;
use App\Models\DisasterRisk;
use App\Models\EducationalHistory;
use App\Models\EducationStatus;
use App\Models\Family;
use App\Models\FamilyRelation;
use App\Models\Household;
use App\Models\HouseholdElectricitySource;
use App\Models\HouseholdResident;
use App\Models\HouseholdToilet;
use App\Models\HouseholdWasteManagement;
use App\Models\HouseholdWaterSource;
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
use App\Models\ResidentVoterInformation;
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
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    // heavy data
    public function run(): void
    {
        $faker = Faker::create();
        // User::factory(10)->create();
        // Barangay::factory(2)->create();
        $this->call([
            BarangaySeeder::class,
        ]);
        for ($i = 1; $i <= 7; $i++) {
            Purok::factory()->create([
                'barangay_id' => 1,
                'purok_number' => $i,
            ]);
        }
        Street::factory(15)->create();
        Household::factory(1259)->create();
        Family::factory(1258)->create();

        $term = BarangayOfficialTerm::factory()->create([
            'barangay_id' => 1,
            'term_start' => 2022,
            'term_end' => 2025,
            'status' => 'active',
        ]);

        $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);

        $user = User::factory()->create([
            'resident_id' => Resident::factory(),
            'barangay_id' => 1,
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'status' => 'active'
        ]);

        $user->assignRole($barangayOfficer);

        BarangayOfficial::factory()->create([
            'resident_id' => $user->resident->id,
            'term_id' => 1,
            'position' => 'barangay_secretary',
            'status' => 'active',
            'appointment_type' => 'appointed',
            'appointted_by' => null,
            'appointment_reason' => null,
            'remarks' => null,
        ]);

        $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);
        $user = User::factory()->create([
            'resident_id' => Resident::factory(),
            'barangay_id' => 2,
            'username' => 'Test User 2',
            'email' => 'testtest@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'admin',
            'status' => 'active'
        ]);
        $user->assignRole($barangayOfficer);

        // $resRole = Role::firstOrCreate(['name' => 'resident']);
        // for($i = 0; $i <= 20; $i++){
        //     $user = User::factory()->create([
        //         'resident_id' => Resident::factory(),
        //         'username' => 'Sample Resident Account',
        //         'email' => 'user'. "$i" .'@example.com',
        //         'password' => bcrypt('user123'),
        //         'email_verified_at' => now(),
        //         'role' => 'resident',
        //         'status' => 'active'
        //     ]);
        //     $user->assignRole($resRole);
        // }
        LivelihoodType::factory(5)->create();

        $residents = Resident::factory()->count(1890)->create();

        //MedicalInformation::factory(30)->create();
        InternetAccessibility::factory(1259)->create();
        Disability::factory(160)->create();
        //Livelihood::factory(60)->create();
        Occupation::factory(1400)->create();
        EducationalHistory::factory(1890)->create();
        Vehicle::factory(598)->create();
        Livestock::factory(989)->create();
        ResidentVoterInformation::factory(1890)->create();
        SocialWelfareProfile::factory(1259)->create();
        SeniorCitizen::factory(456)->create();
        HouseholdToilet::factory(1259)->create();
        HouseholdElectricitySource::factory(1259)->create();
        HouseholdWasteManagement::factory(1259)->create();
        HouseholdWaterSource::factory(1259)->create();
        $residents->groupBy('household_id')->each(function ($group) {
            $group->first()->update(['is_household_head' => true]);
        });
        $this->call([
            OccupationTypeSeeder::class,
            FixHouseholdResidentSeeder::class,
            FamilyRelationSeeder::class,
            BarangayInformationSeeder::class
        ]);
        Resident::all()->each(function ($resident) {
            $medical = MedicalInformation::factory()->create([
                'resident_id' => $resident->id,
            ]);

            // ✅ Only create Disability if pwd_id_number is filled
            if (!empty($medical->pwd_id_number)) {
                Disability::factory()->create([
                    'resident_id' => $resident->id,
                ]);
            }
        });
    }

    // light data
    // public function run(): void
    // {
    //     $faker = Faker::create();
    //     // User::factory(10)->create();
    //     // Barangay::factory(2)->create();
    //     $this->call([
    //         BarangaySeeder::class,
    //     ]);
    //     for ($i = 1; $i <= 7; $i++) {
    //         Purok::factory()->create([
    //             'barangay_id' => 1,
    //             'purok_number' => $i,
    //         ]);
    //     }

    //     Street::factory(12)->create();      // just 2 streets
    //     Household::factory(11)->create();   // only 5 households
    //     Family::factory(14)->create();

    //     $term = BarangayOfficialTerm::factory()->create([
    //         'barangay_id' => 1,
    //         'term_start' => 2022,
    //         'term_end' => 2025,
    //         'status' => 'active',
    //     ]);

    //     $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);

    //     $user = User::factory()->create([
    //         'resident_id' => Resident::factory(),
    //         'barangay_id' => 1,
    //         'username' => 'Test User',
    //         'email' => 'test@example.com',
    //         'password' => bcrypt('admin123'),
    //         'email_verified_at' => now(),
    //         'role' => 'admin',
    //         'status' => 'active'
    //     ]);

    //     $user->assignRole($barangayOfficer);

    //     BarangayOfficial::factory()->create([
    //         'resident_id' => $user->resident->id,
    //         'term_id' => 1,
    //         'position' => 'barangay_secretary',
    //         'status' => 'active',
    //         'appointment_type' => 'appointed',
    //         'appointted_by' => null,
    //         'appointment_reason' => null,
    //         'remarks' => null,
    //     ]);

    //     $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);
    //     $user = User::factory()->create([
    //         'resident_id' => Resident::factory(),
    //         'barangay_id' => 2,
    //         'username' => 'Test User 2',
    //         'email' => 'testtest@example.com',
    //         'password' => bcrypt('admin123'),
    //         'email_verified_at' => now(),
    //         'role' => 'admin',
    //         'status' => 'active'
    //     ]);
    //     $user->assignRole($barangayOfficer);

    //     // $resRole = Role::firstOrCreate(['name' => 'resident']);
    //     // for($i = 0; $i <= 20; $i++){
    //     //     $user = User::factory()->create([
    //     //         'resident_id' => Resident::factory(),
    //     //         'username' => 'Sample Resident Account',
    //     //         'email' => 'user'. "$i" .'@example.com',
    //     //         'password' => bcrypt('user123'),
    //     //         'email_verified_at' => now(),
    //     //         'role' => 'resident',
    //     //         'status' => 'active'
    //     //     ]);
    //     //     $user->assignRole($resRole);
    //     // }
    //     LivelihoodType::factory(5)->create();

    //    $residents = Resident::factory()->count(50)->create(); // ✅ very minimal

    //     // Related sample data (scaled down)
    //     InternetAccessibility::factory(20)->create();
    //     Occupation::factory(30)->create();
    //     EducationalHistory::factory(50)->create();
    //     Vehicle::factory(15)->create();
    //     Livestock::factory(20)->create();
    //     ResidentVoterInformation::factory(50)->create();
    //     SocialWelfareProfile::factory(25)->create();
    //     SeniorCitizen::factory(15)->create();
    //     HouseholdToilet::factory(25)->create();
    //     HouseholdElectricitySource::factory(25)->create();
    //     HouseholdWasteManagement::factory(25)->create();
    //     HouseholdWaterSource::factory(25)->create();

    //     // Mark household heads
    //     $residents->groupBy('household_id')->each(function ($group) {
    //         $group->first()->update(['is_household_head' => true]);
    //     });

    //     // Call essentials
    //     $this->call([
    //         OccupationTypeSeeder::class,
    //         FixHouseholdResidentSeeder::class,
    //         FamilyRelationSeeder::class,
    //         BarangayInformationSeeder::class,
    //     ]);

    //     // Attach medical info + conditional disability
    //     Resident::all()->each(function ($resident) {
    //         $medical = MedicalInformation::factory()->create([
    //             'resident_id' => $resident->id,
    //         ]);

    //         if (!empty($medical->pwd_id_number)) {
    //             Disability::factory()->create([
    //                 'resident_id' => $resident->id,
    //             ]);
    //         }
    //     });
    // }
}

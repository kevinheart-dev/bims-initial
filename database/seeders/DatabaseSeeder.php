<?php

namespace Database\Seeders;

use App\Models\Allergy;
use App\Models\Barangay;
use App\Models\BarangayInstitution;
use App\Models\BarangayInstitutionMember;
use App\Models\BarangayOfficial;
use App\Models\BarangayOfficialTerm;
use App\Models\BlotterReport;
use App\Models\BodiesOfLand;
use App\Models\BodiesOfWater;
use App\Models\CaseParticipant;
use App\Models\ChildHealthMonitoringRecord;
use App\Models\CommunityRiskAssessment;
use App\Models\Deceased;
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
use App\Models\Inventory;
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
use App\Models\ResidentMedicalCondition;
use App\Models\ResidentMedication;
use App\Models\ResidentVaccination;
use App\Models\ResidentVoterInformation;
use App\Models\SeniorCitizen;
use App\Models\SocialAssistance;
use App\Models\SocialWelfare;
use App\Models\SocialWelfareProfile;
use App\Models\Street;
use App\Models\Summon;
use App\Models\SummonParticipantAttendance;
use App\Models\SummonTake;
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
    public function run(): void
    {
        $faker = Faker::create();

        // Seed initial barangays
        $this->call([BarangaySeeder::class]);

        // Roles
        $barangayOfficerRole = Role::firstOrCreate(['name' => 'barangay_officer']);
        $residentRole = Role::firstOrCreate(['name' => 'resident']);
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $cdrrmoRole = Role::firstOrCreate(['name' => 'cdrrmo_admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // System users
        User::factory()->create([
            'resident_id' => null,
            'username' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
            'status' => 'active',
            'is_disabled' => false,
        ])->assignRole($superAdminRole);

        User::factory()->create([
            'resident_id' => null,
            'username' => 'CDRRMO Admin',
            'email' => 'cdrrmo@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'cdrrmo_admin',
            'status' => 'active',
            'is_disabled' => false,
        ])->assignRole($cdrrmoRole);

        $barangays = Barangay::all();
        //$barangays = Barangay::take(5)->get();

        //  foreach ($barangays->take(2) as $barangay)

        foreach ($barangays as $barangay) {
            $adminUser = User::factory()->create([
                'resident_id' => null,
                'barangay_id' => $barangay->id,
                'username' => $barangay->barangay_name . ' Admin',
                'email' => $barangay->email ?? 'barangay' . $barangay->id . '@example.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'status' => 'inactive',
                'is_disabled' => false,
            ]);
            $adminUser->assignRole($adminRole);

            /**
             * PUROKS & STREETS
             */
            $puroks = [];
            for ($i = 1; $i <= 7; $i++) {
                $puroks[] = Purok::factory()->create([
                    'barangay_id' => $barangay->id,
                    'purok_number' => $i,
                ]);
            }

            foreach ($puroks as $purok) {
                Street::factory(2)->create(['purok_id' => $purok->id]);
            }
        }

        // Call lookup/fix seeders
        $this->call([
            // BarangayDataSeeder::class,
            ExcelDataSeeder::class,
            OccupationTypeSeeder::class,
            FixHouseholdResidentSeeder::class,
            // FamilyRelationSeeder::class,
            BarangayInformationSeeder::class,
        ]);
        // $this->call([
        //     CRADataseeder::class,
        // ]);
        // CommunityRiskAssessment::factory()->create([
        //     'year' => 2022
        // ]);
        // CommunityRiskAssessment::factory()->create([
        //     'year' => 2023
        // ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2024
        ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2025
        ]);
    }
}

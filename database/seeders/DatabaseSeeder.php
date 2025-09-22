<?php

namespace Database\Seeders;

use App\Models\Allergy;
use App\Models\Barangay;
use App\Models\BarangayInstitution;
use App\Models\BarangayInstitutionMember;
use App\Models\BarangayOfficial;
use App\Models\BarangayOfficialTerm;
use App\Models\BlotterReport;
use App\Models\CaseParticipant;
use App\Models\ChildHealthMonitoringRecord;
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

    // heavy data
    // public function run(): void
    // {
    //     $faker = Faker::create();
    //     $this->call([
    //         BarangaySeeder::class,
    //     ]);

    //     for ($i = 1; $i <= 7; $i++) {
    //         Purok::factory()->create([
    //             'barangay_id' => 1,
    //             'purok_number' => $i,
    //         ]);
    //     }

    //     Inventory::factory(1000)->create();
    //     Street::factory(12)->create();
    //     Household::factory(6500)->create();
    //     Family::factory(7500)->create();

    //     $term = BarangayOfficialTerm::factory()->create([
    //         'barangay_id' => 1,
    //         'term_start' => 2022,
    //         'term_end' => 2025,
    //         'status' => 'active',
    //     ]);

    //     $barangayOfficerRole = Role::firstOrCreate(['name' => 'barangay_officer']);
    //     $barangays = Barangay::all();

    //     foreach ($barangays as $barangay) {
    //         $resident = Resident::factory()->create([
    //             'barangay_id' => $barangay->id,
    //         ]);

    //         $user = User::factory()->create([
    //             'resident_id' => $resident->id,
    //             'barangay_id' => $barangay->id,
    //             'username' => $barangay->name . ' Admin',
    //             'email' => $barangay->email ?? 'barangay'.$barangay->id.'@example.com',
    //             'password' => bcrypt('admin123'),
    //             'email_verified_at' => now(),
    //             'role' => 'admin',
    //             'status' => 'active',
    //         ]);

    //         $user->assignRole($barangayOfficerRole);

    //         BarangayOfficial::factory()->create([
    //             'resident_id' => $resident->id,
    //             'term_id' => 1,
    //             'position' => 'barangay_secretary',
    //             'status' => 'active',
    //             'appointment_type' => 'appointed',
    //             'appointted_by' => null,
    //             'appointment_reason' => null,
    //             'remarks' => null,
    //         ]);
    //     }

    //     $residents = Resident::factory()->count(10000)->create();

    //     InternetAccessibility::factory(3500)->create();
    //     Occupation::factory(7000)->create();
    //     EducationalHistory::factory(10000)->create();
    //     Vehicle::factory(4000)->create();
    //     Livestock::factory(1800)->create();
    //     ResidentVoterInformation::factory(2500)->create();
    //     SocialWelfareProfile::factory(2000)->create();
    //     SeniorCitizen::factory(4000)->create();
    //     HouseholdToilet::factory(6500)->create();
    //     HouseholdElectricitySource::factory(6500)->create();
    //     HouseholdWasteManagement::factory(6500)->create();
    //     HouseholdWaterSource::factory(6500)->create();
    //     Livelihood::factory(10000)->create();

    //     $residents->groupBy('household_id')->each(function ($group) {
    //         $group->first()->update(['is_household_head' => true]);
    //     });

    //     $this->call([
    //         OccupationTypeSeeder::class,
    //         FixHouseholdResidentSeeder::class,
    //         FamilyRelationSeeder::class,
    //         BarangayInformationSeeder::class,
    //     ]);

    //     Resident::all()->each(function ($resident) {
    //         $medical = MedicalInformation::factory()->create([
    //             'resident_id' => $resident->id,
    //         ]);

    //         if (!empty($medical->pwd_id_number)) {
    //             Disability::factory()->create([
    //                 'resident_id' => $resident->id,
    //             ]);

    //             $resident->update([
    //                 'is_pwd' => 1,
    //             ]);
    //         }
    //     });

    //     ResidentMedicalCondition::factory(2000)->create();
    //     ResidentMedication::factory(2000)->create();
    //     ResidentVaccination::factory(10000)->create();
    //     Allergy::factory(2000)->create();
    //     PregnancyRecords::factory(1500)->create();
    //     BlotterReport::factory(1000)->create();
    //     CaseParticipant::factory(3000)->create();
    //     Summon::factory(700)->create();
    //     ChildHealthMonitoringRecord::factory(2000)->create();
    // }

    //light data
    public function run(): void
    {
        $faker = Faker::create();
        $this->call([
            BarangaySeeder::class,
        ]);
        for ($i = 1; $i <= 7; $i++) {
            Purok::factory()->create([
                'barangay_id' => 1,
                'purok_number' => $i,
            ]);
        }
        Inventory::factory(50)->create();
        Street::factory(12)->create();      // just 2 streets
        Household::factory(50)->create();   // only 5 households
        Family::factory(65)->create();

        $term = BarangayOfficialTerm::factory()->create([
            'barangay_id' => 1,
            'term_start' => 2022,
            'term_end' => 2025,
            'status' => 'active',
        ]);

        $barangayOfficerRole = Role::firstOrCreate(['name' => 'barangay_officer']);
        $barangays = Barangay::all(); // Assuming you already have 91 barangays in DB

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $userper = User::factory()->create([
            'username' => "Super Admin", // e.g., "Barangay 1 Admin"
            'email' => 'superadmin@example.com', // fallback email if not present
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
        $userper->assignRole($superAdmin);

        $superAdmin = Role::firstOrCreate(['name' => 'cdrrmo_admin']);
        $cdrrmo = User::factory()->create([
            'username' => "CDRRMO Admin", // e.g., "Barangay 1 Admin"
            'email' => 'cdrrmo@example.com', // fallback email if not present
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
        $cdrrmo->assignRole($superAdmin);

        foreach ($barangays as $barangay) {
            // Create a resident first
            $resident = Resident::factory()->create([
                'barangay_id' => $barangay->id,
            ]);

            // Create a user for this barangay
            $user = User::factory()->create([
                'resident_id' => $resident->id,
                'barangay_id' => $barangay->id,
                'username' => $barangay->name . ' Admin', // e.g., "Barangay 1 Admin"
                'email' => $barangay->email ?? 'barangay'.$barangay->id.'@example.com', // fallback email if not present
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'admin',
                'status' => 'active',
            ]);

            // Assign role
            $user->assignRole($barangayOfficerRole);

            // Create BarangayOfficial linked to the resident
            BarangayOfficial::factory()->create([
                'resident_id' => $resident->id,
                'term_id' => 1, // default term
                'position' => 'barangay_secretary', // or adjust if needed
                'status' => 'active',
                'appointment_type' => 'appointed',
                'appointted_by' => null,
                'appointment_reason' => null,
                'remarks' => null,
            ]);
        }

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

        $residents = Resident::factory()->count(500)->create(); // ✅ very minimal

        // Related sample data (scaled down)
        InternetAccessibility::factory(50)->create();
        Occupation::factory(500)->create();
        EducationalHistory::factory(700)->create();
        Vehicle::factory(150)->create();
        Livestock::factory(55)->create();
        ResidentVoterInformation::factory( 500)->create();
        SocialWelfareProfile::factory(500)->create();
        SeniorCitizen::factory(190)->create();
        HouseholdToilet::factory(54)->create();
        HouseholdElectricitySource::factory(55)->create();
        HouseholdWasteManagement::factory(55)->create();
        HouseholdWaterSource::factory(55)->create();

        // Mark household heads
        $residents->groupBy('household_id')->each(function ($group) {
            $group->first()->update(['is_household_head' => true]);
        });

        // Call essentials
        $this->call([
            OccupationTypeSeeder::class,
            FixHouseholdResidentSeeder::class,
            FamilyRelationSeeder::class,
            BarangayInformationSeeder::class,
        ]);

        // Attach medical info + conditional disability
        Resident::all()->each(function ($resident) {
            $medical = MedicalInformation::factory()->create([
                'resident_id' => $resident->id,
            ]);

            if (!empty($medical->pwd_id_number)) {
                Disability::factory()->create([
                    'resident_id' => $resident->id,
                ]);

                // mark resident as PWD
                $resident->update([
                    'is_pwd' => 1,
                ]);
            }
        });
        ResidentMedicalCondition::factory(500)->create();
        ResidentMedication::factory(500)->create();
        ResidentVaccination::factory(500)->create();
        Allergy::factory(100)->create();
        PregnancyRecords::factory(75)->create();
        BlotterReport::factory(55)->create();
        CaseParticipant::factory(95)->create();
        BlotterReport::factory(120)->create()->each(function ($blotter) {
            // Add participants (complainants, respondents, witnesses)
            $participants = CaseParticipant::factory()
                ->count(rand(2, 5)) // at least 1 complainant + 1 respondent + maybe witnesses
                ->state(['blotter_id' => $blotter->id])
                ->create();

            // Create a summon for the blotter
            $summon = Summon::factory()
                ->state(['blotter_id' => $blotter->id])
                ->create();

            // Decide how many sessions to create (1–3)
            $maxSessions = rand(1, 3);
            $previousDate = null;

            for ($i = 1; $i <= $maxSessions; $i++) {
                $hearingDate = $i === 1
                    ? fake()->dateTimeBetween('-2 months', '+1 month')
                    : fake()->dateTimeBetween($previousDate, (clone $previousDate)->modify('+1 month'));

                // Decide realistic status
                if ($hearingDate > now()) {
                    $status = fake()->randomElement(['scheduled', 'cancelled']);
                } elseif ($hearingDate->format('Y-m-d') === now()->format('Y-m-d')) {
                    $status = fake()->randomElement(['in_progress', 'adjourned', 'no_show']);
                } else {
                    $status = fake()->randomElement(['completed', 'adjourned', 'no_show']);
                }

                // Remarks: mandatory for sessions #2 or #3
                $remarksOptions = [
                    'Initial summons issued',
                    'Case still under mediation',
                    'Escalated to higher authority',
                    'Case resolved after mediation',
                    'Dismissed due to lack of evidence',
                ];
                $remarks = $i > 1 ? fake()->randomElement($remarksOptions) : fake()->optional()->randomElement($remarksOptions);

                $take = SummonTake::factory()->create([
                    'summon_id'       => $summon->id,
                    'session_number'  => $i,
                    'hearing_date'    => $hearingDate->format('Y-m-d'),
                    'session_status'  => $status,
                    'session_remarks' => $remarks,
                ]);

                // Mark attendance for participants
                foreach ($participants as $participant) {
                    SummonParticipantAttendance::factory()
                        ->state([
                            'take_id' => $take->id,
                            'participant_id' => $participant->id,
                        ])
                        ->create();
                }

                $previousDate = $hearingDate;
            }
        });
        ChildHealthMonitoringRecord::factory(100)->create();
        $this->call(CRADataseeder::class);
    }

    // public function run(): void
    // {
    //     $faker = \Faker\Factory::create();

    //     // 1. Seed barangays first (if not already seeded)
    //     $this->call([
    //         BarangaySeeder::class, // make sure this seeds ALL barangays
    //     ]);

    //     // 2. Loop through all barangays
    //     Barangay::all()->each(function ($barangay) use ($faker) {

    //         // Seed puroks
    //         for ($i = 1; $i <= 7; $i++) {
    //             $purok = Purok::factory()->create([
    //                 'barangay_id' => $barangay->id,
    //                 'purok_number' => $i,
    //             ]);

    //             // Seed streets under this purok
    //             Street::factory(3)->create([  // adjust number per purok
    //                 'purok_id' => $purok->id,
    //             ]);
    //         }


    //         // Seed households & families
    //         Household::factory(10)->create([
    //             'barangay_id' => $barangay->id,
    //         ])->each(function ($household) {
    //             Family::factory(1)->create([
    //                 'household_id' => $household->id,
    //             ]);
    //         });

    //         // Active term
    //         $term = BarangayOfficialTerm::factory()->create([
    //             'barangay_id' => $barangay->id,
    //             'term_start' => 2022,
    //             'term_end' => 2025,
    //             'status' => 'active',
    //         ]);

    //         // Roles
    //         $barangayOfficer = Role::firstOrCreate(['name' => 'barangay_officer']);
    //         $residentRole   = Role::firstOrCreate(['name' => 'resident']);

    //         // Barangay officer user
    //         $officerUser = User::factory()->create([
    //             'resident_id' => Resident::factory(),
    //             'barangay_id' => $barangay->id,
    //             'username' => $faker->name,
    //             'email' => $barangay->email,
    //             'password' => bcrypt('admin123'),
    //             'email_verified_at' => now(),
    //             'role' => 'admin',
    //             'status' => 'active'
    //         ]);
    //         $officerUser->assignRole($barangayOfficer);

    //         BarangayOfficial::factory()->create([
    //             'resident_id' => $officerUser->resident->id,
    //             'term_id'     => $term->id,
    //             'position'    => 'barangay_secretary',
    //             'status'      => 'active',
    //             'appointment_type' => 'appointed',
    //         ]);

    //         // Seed residents
    //         $residents = Resident::factory()->count(20)->create([
    //             'barangay_id' => $barangay->id,
    //         ]);

    //         // Mark household heads
    //         $residents->groupBy('household_id')->each(function ($group) {
    //             $group->first()->update(['is_household_head' => true]);
    //         });

    //         // Related data
    //         InternetAccessibility::factory(5)->create();
    //         Occupation::factory(20)->create();
    //         EducationalHistory::factory(20)->create();
    //         Vehicle::factory(10)->create();
    //         Livestock::factory(10)->create();
    //         ResidentVoterInformation::factory(15)->create();
    //         SocialWelfareProfile::factory(15)->create();
    //         SeniorCitizen::factory(10)->create();
    //         HouseholdToilet::factory(5)->create();
    //         HouseholdElectricitySource::factory(5)->create();
    //         HouseholdWasteManagement::factory(5)->create();
    //         HouseholdWaterSource::factory(5)->create();
    //         Livelihood::factory(15)->create();

    //         // Medical info + disabilities
    //         $residents->each(function ($resident) {
    //             $medical = MedicalInformation::factory()->create([
    //                 'resident_id' => $resident->id,
    //             ]);

    //             if (!empty($medical->pwd_id_number)) {
    //                 Disability::factory()->create([
    //                     'resident_id' => $resident->id,
    //                 ]);
    //                 $resident->update(['is_pwd' => 1]);
    //             }
    //         });

    //         ResidentMedicalCondition::factory(20)->create();
    //         ResidentMedication::factory(20)->create();
    //         ResidentVaccination::factory(20)->create();
    //         Allergy::factory(20)->create();
    //         PregnancyRecords::factory(5)->create();
    //     });

    //     // Call essentials AFTER barangays are seeded
    //     $this->call([
    //         OccupationTypeSeeder::class,
    //         FixHouseholdResidentSeeder::class,
    //         FamilyRelationSeeder::class,
    //         BarangayInformationSeeder::class,
    //     ]);
    // }



}

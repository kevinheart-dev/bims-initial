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
    //     Inventory::factory(50)->create();
    //     Street::factory(12)->create();      // just 2 streets
    //     Household::factory(50)->create();   // only 5 households
    //     Family::factory(65)->create();

    //     $term = BarangayOfficialTerm::factory()->create([
    //         'barangay_id' => 1,
    //         'term_start' => 2022,
    //         'term_end' => 2025,
    //         'status' => 'active',
    //     ]);

    //     $barangayOfficerRole = Role::firstOrCreate(['name' => 'barangay_officer']);
    //     $barangays = Barangay::all(); // Assuming you already have 91 barangays in DB

    //     $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
    //     $userper = User::factory()->create([
    //         'username' => "Super Admin", // e.g., "Barangay 1 Admin"
    //         'email' => 'superadmin@example.com', // fallback email if not present
    //         'password' => bcrypt('admin123'),
    //         'email_verified_at' => now(),
    //         'role' => 'super_admin',
    //         'status' => 'active',
    //     ]);
    //     $userper->assignRole($superAdmin);

    //     $superAdmin = Role::firstOrCreate(['name' => 'cdrrmo_admin']);
    //     $cdrrmo = User::factory()->create([
    //         'username' => "CDRRMO Admin", // e.g., "Barangay 1 Admin"
    //         'email' => 'cdrrmo@example.com', // fallback email if not present
    //         'password' => bcrypt('admin123'),
    //         'email_verified_at' => now(),
    //         'role' => 'super_admin',
    //         'status' => 'active',
    //     ]);
    //     $cdrrmo->assignRole($superAdmin);

    //     foreach ($barangays as $barangay) {
    //         // Create a resident first
    //         $resident = Resident::factory()->create([
    //             'barangay_id' => $barangay->id,
    //         ]);

    //         // Create a user for this barangay
    //         $user = User::factory()->create([
    //             'resident_id' => $resident->id,
    //             'barangay_id' => $barangay->id,
    //             'username' => $barangay->name . ' Admin', // e.g., "Barangay 1 Admin"
    //             'email' => $barangay->email ?? 'barangay'.$barangay->id.'@example.com', // fallback email if not present
    //             'password' => bcrypt('admin123'),
    //             'email_verified_at' => now(),
    //             'role' => 'admin',
    //             'status' => 'active',
    //         ]);

    //         // Assign role
    //         $user->assignRole($barangayOfficerRole);

    //         // Create BarangayOfficial linked to the resident
    //         BarangayOfficial::factory()->create([
    //             'resident_id' => $resident->id,
    //             'term_id' => 1, // default term
    //             'position' => 'barangay_secretary', // or adjust if needed
    //             'status' => 'active',
    //             'appointment_type' => 'appointed',
    //             'appointted_by' => null,
    //             'appointment_reason' => null,
    //             'remarks' => null,
    //         ]);
    //     }
    //     $residents = Resident::factory()->count(500)->create(); // ✅ very minimal
    //     $resRole = Role::firstOrCreate(['name' => 'resident']);
    //     for($i = 0; $i <= 20; $i++){
    //         $user = User::factory()->create([
    //             'resident_id' => Resident::inRandomOrder()->first()?->id,
    //             'username' => 'Sample Resident Account',
    //             'email' => 'user'. "$i" .'@example.com',
    //             'password' => bcrypt('user123'),
    //             'email_verified_at' => now(),
    //             'role' => 'resident',
    //             'status' => 'active'
    //         ]);
    //         $user->assignRole($resRole);
    //     }
    //     // Related sample data (scaled down)
    //     InternetAccessibility::factory(50)->create();
    //     Occupation::factory(500)->create();
    //     EducationalHistory::factory(700)->create();
    //     Vehicle::factory(150)->create();
    //     Livestock::factory(55)->create();
    //     ResidentVoterInformation::factory( 500)->create();
    //     SocialWelfareProfile::factory(500)->create();
    //     SeniorCitizen::factory(190)->create();
    //     HouseholdToilet::factory(54)->create();
    //     HouseholdElectricitySource::factory(55)->create();
    //     HouseholdWasteManagement::factory(55)->create();
    //     HouseholdWaterSource::factory(55)->create();

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

    //             // mark resident as PWD
    //             $resident->update([
    //                 'is_pwd' => 1,
    //             ]);
    //         }
    //     });
    //     ResidentMedicalCondition::factory(500)->create();
    //     ResidentMedication::factory(500)->create();
    //     ResidentVaccination::factory(500)->create();
    //     Allergy::factory(100)->create();
    //     PregnancyRecords::factory(75)->create();
    //     BlotterReport::factory(55)->create();
    //     CaseParticipant::factory(95)->create();
    //     BlotterReport::factory(120)->create()->each(function ($blotter) {
    //         // Add participants (complainants, respondents, witnesses)
    //         $participants = CaseParticipant::factory()
    //             ->count(rand(2, 5)) // at least 1 complainant + 1 respondent + maybe witnesses
    //             ->state(['blotter_id' => $blotter->id])
    //             ->create();

    //         // Create a summon for the blotter
    //         $summon = Summon::factory()
    //             ->state(['blotter_id' => $blotter->id])
    //             ->create();

    //         // Decide how many sessions to create (1–3)
    //         $maxSessions = rand(1, 3);
    //         $previousDate = null;

    //         for ($i = 1; $i <= $maxSessions; $i++) {
    //             $hearingDate = $i === 1
    //                 ? fake()->dateTimeBetween('-2 months', '+1 month')
    //                 : fake()->dateTimeBetween($previousDate, (clone $previousDate)->modify('+1 month'));

    //             // Decide realistic status
    //             if ($hearingDate > now()) {
    //                 $status = fake()->randomElement(['scheduled', 'cancelled']);
    //             } elseif ($hearingDate->format('Y-m-d') === now()->format('Y-m-d')) {
    //                 $status = fake()->randomElement(['in_progress', 'adjourned', 'no_show']);
    //             } else {
    //                 $status = fake()->randomElement(['completed', 'adjourned', 'no_show']);
    //             }

    //             // Remarks: mandatory for sessions #2 or #3
    //             $remarksOptions = [
    //                 'Initial summons issued',
    //                 'Case still under mediation',
    //                 'Escalated to higher authority',
    //                 'Case resolved after mediation',
    //                 'Dismissed due to lack of evidence',
    //             ];
    //             $remarks = $i > 1 ? fake()->randomElement($remarksOptions) : fake()->optional()->randomElement($remarksOptions);

    //             $take = SummonTake::factory()->create([
    //                 'summon_id'       => $summon->id,
    //                 'session_number'  => $i,
    //                 'hearing_date'    => $hearingDate->format('Y-m-d'),
    //                 'session_status'  => $status,
    //                 'session_remarks' => $remarks,
    //             ]);

    //             // Mark attendance for participants
    //             foreach ($participants as $participant) {
    //                 SummonParticipantAttendance::factory()
    //                     ->state([
    //                         'take_id' => $take->id,
    //                         'participant_id' => $participant->id,
    //                     ])
    //                     ->create();
    //             }

    //             $previousDate = $hearingDate;
    //         }
    //     });
    //     ChildHealthMonitoringRecord::factory(100)->create();
    //     $this->call(CRADataseeder::class);
    // }

    // optimized
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

            // System users
            User::factory()->create([
                'username' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'super_admin',
                'status' => 'active',
            ])->assignRole($superAdminRole);

            User::factory()->create([
                'username' => 'CDRRMO Admin',
                'email' => 'cdrrmo@example.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'cdrrmo_admin',
                'status' => 'active',
            ])->assignRole($cdrrmoRole);

            $barangays = Barangay::all();

            foreach ($barangays as $barangay) {
                // Create 7 puroks per barangay
                $puroks = Purok::factory(7)->create(['barangay_id' => $barangay->id]);

                // Create 2 streets per purok
                foreach ($puroks as $purok) {
                    Street::factory(2)->create(['purok_id' => $purok->id]);
                }

                // Create 1 initial resident → Barangay Admin
                $resident = Resident::factory()->create(['barangay_id' => $barangay->id]);

                $adminUser = User::factory()->create([
                    'resident_id' => $resident->id,
                    'barangay_id' => $barangay->id,
                    'username' => $barangay->name . ' Admin',
                    'email' => $barangay->email ?? 'barangay' . $barangay->id . '@example.com',
                    'password' => bcrypt('admin123'),
                    'email_verified_at' => now(),
                    'role' => 'barangay_officer',
                    'status' => 'active',
                ]);
                $adminUser->assignRole($barangayOfficerRole);

                // Create Barangay Official Term
                $term = BarangayOfficialTerm::factory()->create([
                    'barangay_id' => $barangay->id,
                    'term_start' => 2022,
                    'term_end' => 2025,
                    'status' => 'active',
                ]);

                // Assign Barangay Official
                BarangayOfficial::factory()->create([
                    'resident_id' => $resident->id,
                    'term_id' => $term->id,
                    'position' => 'barangay_secretary',
                    'status' => 'active',
                    'appointment_type' => 'appointed',
                ]);

                // Create households and families
                Household::factory(5)->create(['barangay_id' => $barangay->id]);
                Family::factory(10)->create();

                // Create additional residents (reduce to 50 per barangay for testing)
                $residents = Resident::factory(100)->create(['barangay_id' => $barangay->id]);

                // Sample resident users (take first 10 for each barangay)
                foreach ($residents->take(10) as $index => $res) {
                    $user = User::factory()->create([
                        'resident_id' => $res->id,
                        'username' => 'Sample Resident ' . $index,
                        'email' => 'user' . $barangay->id . '_' . $index . '@example.com',
                        'password' => bcrypt('user123'),
                        'email_verified_at' => now(),
                        'role' => 'resident',
                        'status' => 'active',
                    ]);
                    $user->assignRole($residentRole);
                }
            }

            // Related sample data
            InternetAccessibility::factory(50)->create();
            Occupation::factory(500)->create();
            EducationalHistory::factory(700)->create();
            Vehicle::factory(150)->create();
            Livestock::factory(55)->create();
            ResidentVoterInformation::factory(500)->create();
            SocialWelfareProfile::factory(500)->create();
            SeniorCitizen::factory(190)->create();
            HouseholdToilet::factory(54)->create();
            HouseholdElectricitySource::factory(55)->create();
            HouseholdWasteManagement::factory(55)->create();
            HouseholdWaterSource::factory(55)->create();

            // Mark household heads
            Resident::all()->groupBy('household_id')->each(function ($group) {
                $group->first()->update(['is_household_head' => true]);
            });

            // Call lookup/fix seeders
            $this->call([
                OccupationTypeSeeder::class,
                FixHouseholdResidentSeeder::class,
                FamilyRelationSeeder::class,
                BarangayInformationSeeder::class,
            ]);

            // Medical + disability
            Resident::all()->each(function ($resident) {
                $medical = MedicalInformation::factory()->create(['resident_id' => $resident->id]);
                if (!empty($medical->pwd_id_number)) {
                    Disability::factory()->create(['resident_id' => $resident->id]);
                    $resident->update(['is_pwd' => 1]);
                }
            });

            ResidentMedicalCondition::factory(500)->create();
            ResidentMedication::factory(500)->create();
            ResidentVaccination::factory(500)->create();
            Allergy::factory(100)->create();
            PregnancyRecords::factory(75)->create();

            // Blotters, participants, summons
            BlotterReport::factory(120)->create()->each(function ($blotter) {
                $participants = CaseParticipant::factory(rand(2, 5))
                    ->state(['blotter_id' => $blotter->id])
                    ->create();

                $summon = Summon::factory()->state(['blotter_id' => $blotter->id])->create();

                $previousDate = null;
                for ($i = 1; $i <= rand(1, 3); $i++) {
                    $hearingDate = $i === 1
                        ? fake()->dateTimeBetween('-2 months', '+1 month')
                        : fake()->dateTimeBetween($previousDate, (clone $previousDate)->modify('+1 month'));

                    $status = $hearingDate > now()
                        ? fake()->randomElement(['scheduled', 'cancelled'])
                        : ($hearingDate->format('Y-m-d') === now()->format('Y-m-d')
                            ? fake()->randomElement(['in_progress', 'adjourned', 'no_show'])
                            : fake()->randomElement(['completed', 'adjourned', 'no_show']));

                    $remarksOptions = [
                        'Initial summons issued',
                        'Case still under mediation',
                        'Escalated to higher authority',
                        'Case resolved after mediation',
                        'Dismissed due to lack of evidence',
                    ];

                    $remarks = $i > 1 ? fake()->randomElement($remarksOptions) : fake()->optional()->randomElement($remarksOptions);

                    $take = SummonTake::factory()->create([
                        'summon_id' => $summon->id,
                        'session_number' => $i,
                        'hearing_date' => $hearingDate->format('Y-m-d'),
                        'session_status' => $status,
                        'session_remarks' => $remarks,
                    ]);

                    foreach ($participants as $participant) {
                        SummonParticipantAttendance::factory()->create([
                            'take_id' => $take->id,
                            'participant_id' => $participant->id,
                        ]);
                    }

                    $previousDate = $hearingDate;
                }
            });

            ChildHealthMonitoringRecord::factory(100)->create();
            // $this->call([
            //     CRADataseeder::class,
            // ]);
        }
}

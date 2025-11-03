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

        // ----- Bodies of Water -----
        $waterTypes = [
            'Sea',
            'River',
            'Gulf (Inlet)',
            'Lake',
            'Spring',
            'Falls',
            'Creek',
            'Not mentioned above (Specify)',
        ];

        $waterNames = [
            'Sea' => ['San Miguel Sea', 'Dalisay Sea', 'Maligaya Coast', 'Bayanihan Bay'],
            'River' => ['San Roque River', 'Mabini River', 'Katipunan River', 'Bulusan River'],
            'Gulf (Inlet)' => ['Agila Gulf', 'Luna Gulf', 'Esperanza Inlet', 'Rizal Inlet'],
            'Lake' => ['Banahaw Lake', 'Makiling Lake', 'Maharlika Lake'],
            'Spring' => ['Mapula Spring', 'Tagumpay Spring', 'Maligaya Spring', 'Sampaguita Spring'],
            'Falls' => ['Maria Falls', 'Tinago Falls', 'Bulusan Falls', 'Mayumi Falls'],
            'Creek' => ['Tinago Creek', 'Katipunan Creek', 'Maligaya Creek', 'San Roque Creek'],
            'Not mentioned above (Specify)' => ['Underground Stream', 'Hidden Pond', 'Mystic Basin'],
        ];
        // ----- Bodies of Land -----
        $landTypes = [
            'Mountain',
            'Hill',
            'Plateau',
            'Valley',
            'Plain',
            'Forest',
            'Cave',
            'Not mentioned above (Specify)',
        ];

        $landNames = [
            'Mountain' => ['Mt. Banahaw', 'Mt. Makiling', 'Mt. Dalisay', 'Mt. Kalayaan'],
            'Hill' => ['Tagumpay Hill', 'San Isidro Hill', 'Mabini Hill'],
            'Plateau' => ['Luntian Plateau', 'Esperanza Plateau', 'Bayanihan Plateau'],
            'Valley' => ['Mapayapa Valley', 'Katipunan Valley', 'Luna Valley'],
            'Plain' => ['Maligaya Plain', 'Sampaguita Plain', 'San Roque Plain'],
            'Forest' => ['Bayanihan Forest', 'Katipunan Forest', 'Maligaya Forest', 'Esperanza Woods'],
            'Cave' => ['San Pedro Cave', 'Tagumpay Cave', 'Bulusan Cave', 'Dalisay Cave'],
            'Not mentioned above (Specify)' => ['Rock Formation', 'Underground Ridge', 'Hidden Plateau'],
        ];

        // System users
        User::factory()->create([
            'username' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'super_admin',
            'status' => 'active',
            'is_disabled' => false,
        ])->assignRole($superAdminRole);

        User::factory()->create([
            'username' => 'CDRRMO Admin',
            'email' => 'cdrrmo@example.com',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
            'role' => 'cdrrmo_admin',
            'status' => 'active',
            'is_disabled' => false,
        ])->assignRole($cdrrmoRole);

        //$barangays = Barangay::all();
        $barangays = Barangay::take(1)->get();
        //  foreach ($barangays->take(2) as $barangay)
        foreach ($barangays as $barangay) {
            // Create 7 puroks per barangay
            $puroks = []; // Collect all created Puroks

            for ($i = 1; $i <= 7; $i++) {
                $puroks[] = Purok::factory()->create([
                    'barangay_id' => $barangay->id,
                    'purok_number' => $i,
                ]);
            }


            // Create 2 streets per purok
            foreach ($puroks as $purok) {
                Street::factory(2)->create(['purok_id' => $purok->id]);
            }

            // Create 1 initial resident → Barangay Admin
            $resident = Resident::factory()->create(['barangay_id' => $barangay->id]);

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

            $admin = User::factory()->create([
                'resident_id' => $resident->id,
                'barangay_id' => $barangay->id,
                'username' => $barangay->barangay_name . ' Barangay Officer',
                'email' => 'barangayofficer' . $barangay->id . '@example.com',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now(),
                'role' => 'barangay_officer',
                'status' => 'inactive',
                'is_disabled' => false,
            ]);
            $admin->assignRole($barangayOfficerRole);

            // Create Barangay Official Term
            $term = BarangayOfficialTerm::factory()->create([
                'barangay_id' => $barangay->id,
                'term_start' => 2022,
                'term_end' => 2025,
                'status' => 'inactive',
            ]);

            // Assign Barangay Official
            BarangayOfficial::factory()->create([
                'resident_id' => $resident->id,
                'term_id' => $term->id,
                'position' => 'barangay_secretary',
                'status' => 'inactive',
                'appointment_type' => 'appointed',
            ]);

            // Create households and families
            Household::factory(15)
                ->for($barangay)
                ->has(Livestock::factory()->count(rand(0, 5)), 'livestocks')
                ->has(HouseholdToilet::factory()->count(rand(1, 2)), 'toilets')
                ->has(HouseholdElectricitySource::factory(), 'electricityTypes')
                ->has(HouseholdWasteManagement::factory(), 'wasteManagementTypes')
                ->has(HouseholdWaterSource::factory()->count(rand(1, 3)), 'waterSourceTypes')
                ->create();

            Family::factory(10)->create(['barangay_id' => $barangay->id]);

            // Create additional residents (reduce to 50 per barangay for testing)
            $residents = Resident::factory(30)->create(['barangay_id' => $barangay->id]);
            foreach ($residents as $resident) {
                // Each resident can have 1–3 occupations
                Occupation::factory(rand(1, 3))->create([
                    'resident_id' => $resident->id,
                ]);

                // Each resident can have 1–2 educational histories
                EducationalHistory::factory(rand(1, 2))->create([
                    'resident_id' => $resident->id,
                ]);

                // Each resident gets voter info
                ResidentVoterInformation::factory()->create([
                    'resident_id' => $resident->id,
                ]);

                // Each resident gets social welfare profile
                SocialWelfareProfile::factory()->create([
                    'resident_id' => $resident->id,
                ]);

                // Randomly mark some residents as senior citizens
                if ($resident->birthdate <= now()->subYears(60)) {
                    SeniorCitizen::factory()->create(['resident_id' => $resident->id]);
                }

                // Medical Information + possible disability
                $medical = MedicalInformation::factory()->create([
                    'resident_id' => $resident->id,
                ]);

                if (!empty($medical->pwd_id_number)) {
                    Disability::factory()->create([
                        'resident_id' => $resident->id,
                    ]);
                    $resident->update(['is_pwd' => 1]);
                }

                // One-to-many medical-related records
                ResidentMedicalCondition::factory(rand(0, 3))->create([
                    'resident_id' => $resident->id,
                ]);

                ResidentMedication::factory(rand(0, 2))->create([
                    'resident_id' => $resident->id,
                ]);

                ResidentVaccination::factory(rand(0, 5))->create([
                    'resident_id' => $resident->id,
                ]);

                Allergy::factory(rand(0, 2))->create([
                    'resident_id' => $resident->id,
                ]);

                if ($resident->gender === 'female' && $resident->birthdate >= now()->subYears(45) && $resident->birthdate <= now()->subYears(15)) {
                    PregnancyRecords::factory(rand(0, 2))->create(['resident_id' => $resident->id]);
                }

                if ($resident->birthdate >= now()->subYears(5)) {
                    ChildHealthMonitoringRecord::factory(rand(1, 3))->create(['resident_id' => $resident->id]);
                }

                if (!empty($resident->is_deceased) && $resident->is_deceased == 1) {
                    Deceased::factory()->create([
                        'resident_id' => $resident->id,
                    ]);
                }
            }
            Resident::where('barangay_id', $barangay->id)
                ->orderBy('household_id')
                ->chunkById(100, function ($residents) {
                    $residents->groupBy('household_id')->each(function ($group) {
                        $group->first()->update(['is_household_head' => true, 'is_family_head' => true]);
                    });
                });

            // Sample resident users (take first 10 for each barangay)
            foreach ($residents->take(5) as $index => $res) {
                $user = User::factory()->create([
                    'barangay_id' => $barangay->id,
                    'resident_id' => $res->id,
                    'username' => 'Sample Resident ' . $index,
                    'email' => 'user' . $barangay->id . "_" . $index + 1 . '@example.com',
                    'password' => bcrypt('user123'),
                    'email_verified_at' => now(),
                    'role' => 'resident',
                    'status' => 'inactive',
                    'is_disabled' => false,
                ]);
                $user->assignRole($residentRole);
            }

            // Blotters, participants, summons
            BlotterReport::factory(20)
                ->create(['barangay_id' => $barangay->id])
                ->each(function ($blotter) use ($barangay) {

                    // Assign random participants from same barangay
                    $participants = CaseParticipant::factory(rand(2, 5))
                        ->state(['blotter_id' => $blotter->id])
                        ->create();

                    $summon = Summon::factory()->state([
                        'blotter_id' => $blotter->id,
                    ])->create();

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

            $numWaters = rand(0, 4);

            if ($numWaters === 0) {
                BodiesOfWater::create([
                    'barangay_id' => $barangay->id,
                    'type' => 'None',
                    'exists' => false,
                    'name' => 'N/A',
                ]);
            } else {
                $selectedWaterTypes = collect($waterTypes)->random($numWaters);
                foreach ($selectedWaterTypes as $type) {
                    BodiesOfWater::create([
                        'barangay_id' => $barangay->id,
                        'type' => $type,
                        'exists' => true,
                        'name' => fake()->randomElement($waterNames[$type]),
                    ]);
                }
            }

            $numLands = rand(0, 4);

            if ($numLands === 0) {
                BodiesOfLand::create([
                    'barangay_id' => $barangay->id,
                    'type' => 'None',
                    'exists' => false,
                    'name' => 'N/A',
                ]);
            } else {
                $selectedLandTypes = collect($landTypes)->random($numLands);
                foreach ($selectedLandTypes as $type) {
                    BodiesOfLand::create([
                        'barangay_id' => $barangay->id,
                        'type' => $type,
                        'exists' => true,
                        'name' => fake()->randomElement($landNames[$type]),
                    ]);
                }
            }
        }
        // Call lookup/fix seeders
        $this->call([
            OccupationTypeSeeder::class,
            FixHouseholdResidentSeeder::class,
            // FamilyRelationSeeder::class,
            BarangayInformationSeeder::class,
        ]);
        // $this->call([
        //     CRADataseeder::class,
        // ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2022
        ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2023
        ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2024
        ]);
        CommunityRiskAssessment::factory()->create([
            'year' => 2025
        ]);
    }
}

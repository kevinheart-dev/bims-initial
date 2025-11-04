<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{
    Barangay, Purok, Street, Resident, User, BarangayOfficialTerm, BarangayOfficial,
    Household, Livestock, HouseholdToilet, HouseholdElectricitySource, HouseholdWasteManagement,
    HouseholdWaterSource, Family, Occupation, EducationalHistory, ResidentVoterInformation,
    SocialWelfareProfile, SeniorCitizen, MedicalInformation, Disability, ResidentMedicalCondition,
    ResidentMedication, ResidentVaccination, Allergy, PregnancyRecords, ChildHealthMonitoringRecord,
    Deceased, BlotterReport, CaseParticipant, Summon, SummonTake, SummonParticipantAttendance,
    BodiesOfWater, BodiesOfLand
};
use Illuminate\Support\Facades\Hash;

class BarangayDataSeeder extends Seeder
{
    public function run(): void
    {
        // Roles must be created before running this seeder
        $adminRole = 'admin';
        $barangayOfficerRole = 'barangay_officer';
        $residentRole = 'resident';

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

        // Seed ONLY one barangay for testing
        $barangays = Barangay::take(1)->get();
        //$barangays = Barangay::all();
        foreach ($barangays as $barangay) {
            /**
             * ADMIN USERS
             */
            $resident = Resident::factory()->create(['barangay_id' => $barangay->id]);
            $officer = User::factory()->create([
                'resident_id' => $resident->id,
                'barangay_id' => $barangay->id,
                'username' => $barangay->barangay_name . ' Barangay Officer',
                'email' => 'barangayofficer'.$barangay->id.'@example.com',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
                'role' => $barangayOfficerRole,
                'status' => 'inactive',
                'is_disabled' => false,
            ]);
            $officer->assignRole($barangayOfficerRole);

            /**
             * OFFICIAL TERM & SECRETARY
             */
            $term = BarangayOfficialTerm::factory()->create([
                'barangay_id' => $barangay->id,
                'term_start' => 2022,
                'term_end' => 2025,
                'status' => 'inactive',
            ]);

            BarangayOfficial::factory()->create([
                'resident_id' => $resident->id,
                'term_id' => $term->id,
                'position' => 'barangay_secretary',
                'status' => 'inactive',
                'appointment_type' => 'appointed',
            ]);

            /**
             * HOUSEHOLDS & FAMILIES
             */
            Household::factory(15)
                ->for($barangay)
                ->has(Livestock::factory()->count(rand(0, 5)), 'livestocks')
                ->has(HouseholdToilet::factory()->count(rand(1, 2)), 'toilets')
                ->has(HouseholdElectricitySource::factory(), 'electricityTypes')
                ->has(HouseholdWasteManagement::factory(), 'wasteManagementTypes')
                ->has(HouseholdWaterSource::factory()->count(rand(1, 3)), 'waterSourceTypes')
                ->create();

            Family::factory(10)->create(['barangay_id' => $barangay->id]);

            /**
             * RESIDENTS + RELATED DATA
             */
            $residents = Resident::factory(30)->create(['barangay_id' => $barangay->id]);

            foreach ($residents as $res) {
                Occupation::factory(rand(1, 3))->create(['resident_id' => $res->id]);
                EducationalHistory::factory(rand(1, 2))->create(['resident_id' => $res->id]);
                ResidentVoterInformation::factory()->create(['resident_id' => $res->id]);
                SocialWelfareProfile::factory()->create(['resident_id' => $res->id]);

                if ($res->birthdate <= now()->subYears(60)) {
                    SeniorCitizen::factory()->create(['resident_id' => $res->id]);
                }

                $medical = MedicalInformation::factory()->create(['resident_id' => $res->id]);

                if (!empty($medical->pwd_id_number)) {
                    Disability::factory()->create(['resident_id' => $res->id]);
                    $res->update(['is_pwd' => 1]);
                }

                ResidentMedicalCondition::factory(rand(0, 3))->create(['resident_id' => $res->id]);
                ResidentMedication::factory(rand(0, 2))->create(['resident_id' => $res->id]);
                ResidentVaccination::factory(rand(0, 5))->create(['resident_id' => $res->id]);
                Allergy::factory(rand(0, 2))->create(['resident_id' => $res->id]);

                if ($res->gender === 'female' && $res->birthdate >= now()->subYears(45) && $res->birthdate <= now()->subYears(15)) {
                    PregnancyRecords::factory(rand(0, 2))->create(['resident_id' => $res->id]);
                }

                if ($res->birthdate >= now()->subYears(5)) {
                    ChildHealthMonitoringRecord::factory(rand(1, 3))->create(['resident_id' => $res->id]);
                }

                if ($res->is_deceased == 1) {
                    Deceased::factory()->create(['resident_id' => $res->id]);
                }
            }

            Resident::where('barangay_id', $barangay->id)
                ->orderBy('household_id')
                ->chunkById(100, function ($group) {
                    $group->groupBy('household_id')->each(fn($g) =>
                        $g->first()->update(['is_household_head' => 1, 'is_family_head' => 1])
                    );
                });

            /**
             * SAMPLE USERS
             */
            foreach ($residents->take(5) as $i => $res) {
                $user = User::factory()->create([
                    'barangay_id' => $barangay->id,
                    'resident_id' => $res->id,
                    'username' => 'Sample Resident '.$i,
                    'email' => 'user'.$barangay->id.'_'.($i + 1).'@example.com',
                    'password' => Hash::make('user123'),
                    'email_verified_at' => now(),
                    'role' => $residentRole,
                    'status' => 'inactive',
                    'is_disabled' => false,
                ]);
                $user->assignRole($residentRole);
            }

            /**
             * BLOTTERS / SUMMONS / HEARINGS
             */
            BlotterReport::factory(20)
                ->create(['barangay_id' => $barangay->id])
                ->each(function ($blotter) {
                    $participants = CaseParticipant::factory(rand(2, 5))->state(['blotter_id' => $blotter->id])->create();
                    $summon = Summon::factory()->state(['blotter_id' => $blotter->id])->create();

                    $previous = null;
                    for ($i = 1; $i <= rand(1, 3); $i++) {
                        $date = $i === 1
                            ? fake()->dateTimeBetween('-2 months', '+1 month')
                            : fake()->dateTimeBetween($previous, $previous->modify('+1 month'));

                        $status = $date > now()
                            ? fake()->randomElement(['scheduled', 'cancelled'])
                            : fake()->randomElement(['completed','adjourned','no_show']);

                        $remarks = fake()->optional()->randomElement([
                            'Initial summons issued', 'Case still under mediation',
                            'Escalated to higher authority', 'Case resolved', 'Dismissed'
                        ]);

                        $take = SummonTake::factory()->create([
                            'summon_id' => $summon->id,
                            'session_number' => $i,
                            'hearing_date' => $date->format('Y-m-d'),
                            'session_status' => $status,
                            'session_remarks' => $remarks,
                        ]);

                        foreach ($participants as $p) {
                            SummonParticipantAttendance::factory()->create([
                                'take_id' => $take->id,
                                'participant_id' => $p->id,
                            ]);
                        }

                        $previous = $date;
                    }
                });

            /**
             * GEOGRAPHICAL DATA
             */
            $this->generateLandWater($barangay, $waterTypes, $waterNames, $landTypes, $landNames);
        }
    }

    private function generateLandWater($barangay, $waterTypes, $waterNames, $landTypes, $landNames)
    {
        $numWaters = rand(0, 4);

        if ($numWaters === 0) {
            BodiesOfWater::create([
                'barangay_id' => $barangay->id, 'type' => 'None', 'exists' => false, 'name' => 'N/A',
            ]);
        } else {
            foreach (collect($waterTypes)->random($numWaters) as $type) {
                BodiesOfWater::create([
                    'barangay_id' => $barangay->id, 'type' => $type, 'exists' => true,
                    'name' => fake()->randomElement($waterNames[$type]),
                ]);
            }
        }

        $numLands = rand(0, 4);

        if ($numLands === 0) {
            BodiesOfLand::create([
                'barangay_id' => $barangay->id, 'type' => 'None', 'exists' => false, 'name' => 'N/A',
            ]);
        } else {
            foreach (collect($landTypes)->random($numLands) as $type) {
                BodiesOfLand::create([
                    'barangay_id' => $barangay->id, 'type' => $type, 'exists' => true,
                    'name' => fake()->randomElement($landNames[$type]),
                ]);
            }
        }
    }
}

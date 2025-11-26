<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use App\Models\Purok;
use App\Models\Household;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Carbon\Carbon;

class ExcelDataSeeder extends Seeder
{
    public function run(): void
    {
        $rows = Excel::toArray([], database_path('seeders/data/residents.xlsx'))[0];

        foreach ($rows as $i => $row) {
            if ($i === 0) continue; // Skip header

            $barangayId = 1;

            // Basic info
            $firstname       = trim($row[0]);
            $middlename      = trim($row[1] ?? null);
            $lastname        = trim($row[2]);
            $maiden          = trim($row[3] ?? null);
            if ($maiden === '') {
                $maiden = null;
            }
            $suffix = trim($row[4] ?? null);
            if ($suffix === '') {
                $suffix = null;
            }

            $sex             = strtolower(trim($row[5] ?? ''));
            $gender          = strtolower(trim($row[6] ?? ''));

            $rawDate = trim($row[7] ?? '');

            if ($rawDate === '' || strtolower($rawDate) == 'n/a') {
                $birthdate = null;
            } elseif (is_numeric($rawDate)) {
                // Excel serial number to date
                $birthdate = Carbon::instance(ExcelDate::excelToDateTimeObject($rawDate))
                    ->format('Y-m-d');
            } else {
                // Normal string date
                $birthdate = Carbon::parse($rawDate)->format('Y-m-d');
            }
            $birthplace      = trim($row[8]);
            $civilStatus     = strtolower(trim($row[9] ?? ''));
            $employmentStatus = strtolower(trim($row[10] ?? ''));
            $citizenship     = trim($row[11]);
            $religion        = trim($row[12]);
            $contact         = preg_replace('/\D/', '', $row[13]) ?: null;
            $email           = trim($row[14]);
            if ($email === '') {
                $email = null;
            }

            // --- Fix Purok ---
            $purokNumber = isset($row[15]) ? trim($row[15]) : null;
            $originalValue = $row[15] ?? null; // for logging

            $purokNumber = preg_replace('/[^0-9]/', '', $purokNumber);

            $fallbackUsed = false;
            if ($purokNumber === '' || $purokNumber === null) {
                $purokNumber = 0;
                $fallbackUsed = true;
            }

            // --- LOGGING ---
            Log::info("Row {$i} Purok Check", [
                'original_value' => $originalValue,
                'cleaned_numeric' => $purokNumber,
                'fallback_used' => $fallbackUsed,
            ]);

            $houseNumberFromFile = $row[18];

            $isPWD           = strtolower(trim($row[16] ?? '')) === '1' ? 1 : 0;
            $isDeceased      = strtolower(trim($row[17] ?? '')) === '1' ? 1 : 0;

            $isHead          = strtolower(trim($row[19] ?? '')) === '1';
            $isFamilyHead    = strtolower(trim($row[20] ?? '')) === '1';

            // Occupation & education
            $occupation      = strtolower(trim($row[21] ?? ''));
            $educationAtt    = strtolower(trim($row[22] ?? ''));
            $educationStatus = strtolower(trim($row[23] ?? '')) ?: 'enrolled';

            // Other special tags
            $isOFW           = !empty($row[24]) && $row[24] == 1 ? 1 : 0;
            $isSoloParent    = !empty($row[25]) && $row[25] == 1 ? 1 : 0;
            $isOSY           = !empty($row[26]) && $row[26] == 1 ? 1 : 0;
            $isOSC           = !empty($row[27]) && $row[27] == 1 ? 1 : 0;
            $isIP            = !empty($row[28]) && $row[28] == 1 ? 1 : 0;
            $philsys        = trim($row[29]) ?? null;




            /** ✅ Get or Create Purok */
            $purok = Purok::firstOrCreate([
                'barangay_id' => $barangayId,
                'purok_number' => $purokNumber,
            ]);

            /** ✅ Get or Create Household */
            $household = Household::firstOrCreate([
                'barangay_id' => $barangayId,
                'purok_id'    => $purok->id,
                'house_number'=> $houseNumberFromFile,
            ]);

            /** ✅ Insert Resident */
            $residentId = DB::table('residents')->insertGetId([
                'barangay_id'       => $barangayId,
                'firstname'         => $firstname,
                'middlename'        => $middlename,
                'lastname'          => $lastname,
                'maiden_name'       => $maiden,
                'suffix'            => $suffix,
                'sex'               => $sex,
                'gender'            => $gender,
                'birthdate'         => $birthdate,
                'birthplace'        => $birthplace,
                'civil_status'      => $civilStatus,
                'employment_status' => $employmentStatus,
                'citizenship'       => $citizenship,
                'religion'          => $religion,
                'contact_number'    => $contact,
                'email'             => $email,
                'purok_number'      => $purokNumber,
                'is_pwd'            => $isPWD,
                'is_deceased'       => $isDeceased,
                'household_id'      => $household->id,
                'is_household_head' => $isHead,
                'is_family_head'    => $isFamilyHead,
                'verified'          => true,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            /** ✅ Insert Household Resident */
            DB::table('household_residents')->insert([
                'resident_id'        => $residentId,
                'household_id'       => $household->id,
                'is_household_head'  => $isHead,
                'relationship_to_head'=> $isHead ? 'self' : null,
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            /** ✅ Insert Occupation */
            if (!empty($occupation)) {
                DB::table('occupations')->insert([
                    'resident_id' => $residentId,
                    'occupation'  => $occupation,
                    'is_ofw'      => $isOFW,
                    'is_main_livelihood' => 1,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            /** ✅ Insert Education */
            if (!empty($educationAtt)) {
                DB::table('educational_histories')->insert([
                    'resident_id'            => $residentId,
                    'educational_attainment' => $educationAtt,
                    'education_status'       => $educationStatus,
                    'created_at'             => now(),
                    'updated_at'             => now(),
                ]);
            }
            if (!empty($philsys) || $isSoloParent || $isOSY || $isOSC) {
                DB::table('social_welfare_profiles')->insert([
                    'barangay_id'                 => $barangayId,
                    'resident_id'                 => $residentId,
                    'is_4ps_beneficiary'          => $is4Ps ?? false,
                    'is_solo_parent'              => $isSoloParent ?? false,
                    'is_out_of_school_youth'      => $isOSY ?? false,
                    'is_out_of_school_children'   => $isOSC ?? false,
                    'solo_parent_id_number'       => $soloParentIdNumber ?? null,
                    'philsys_card_no'             => $philsys ?? null,
                    'created_at'                  => now(),
                    'updated_at'                  => now(),
                ]);
            }

            if ($isDeceased  === 1) {
                DB::table('deceaseds')->insert([
                    'resident_id'            => $residentId,
                    'created_at'             => now(),
                    'updated_at'             => now(),
                ]);
            }
        }
    }
}

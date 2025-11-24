<?php

namespace App\Http\Controllers;


use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class SuperAdminDataController extends Controller
{
    // data
    public function populationSummary()
    {
        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        // Define all age groups in order
        $allAgeGroups = [
            '0-6 months','7 months-2 years','3-5 years','6-12 years',
            '13-17 years','18-59 years','60+ years'
        ];

        $ageGroupDataPerBarangay = [];
        $purokDataPerBarangay = [];

        $purokColumns = [1, 2, 3, 4, 5, 6, 7]; // fixed columns

        foreach ($barangays as $barangay) {
            // Age groups breakdown
            $ageGroups = DB::table('residents')
                ->select(
                    DB::raw("COUNT(*) as total"),
                    DB::raw("
                        CASE
                            WHEN TIMESTAMPDIFF(MONTH, birthdate, CURDATE()) BETWEEN 0 AND 6 THEN '0-6 months'
                            WHEN TIMESTAMPDIFF(MONTH, birthdate, CURDATE()) BETWEEN 7 AND 24 THEN '7 months-2 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 3 AND 5 THEN '3-5 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 6 AND 12 THEN '6-12 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 13 AND 17 THEN '13-17 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 18 AND 59 THEN '18-59 years'
                            ELSE '60+ years'
                        END as age_group
                    ")
                )
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('age_group')
                ->pluck('total', 'age_group')
                ->toArray();

            // Ensure all age groups exist
            $ageGroupRow = [];
            foreach ($allAgeGroups as $ageGroup) {
                $ageGroupRow[$ageGroup] = $ageGroups[$ageGroup] ?? 0;
            }

            $ageGroupDataPerBarangay[$barangay->barangay_name] = $ageGroupRow;

            // Purok-level population (columns 1-7)
            $puroks = DB::table('residents')
                ->select('purok_number', DB::raw('COUNT(*) as total_population'))
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('purok_number')
                ->pluck('total_population', 'purok_number')
                ->toArray();

            $purokRow = [];
            foreach ($purokColumns as $col) {
                $purokRow[$col] = $puroks[$col] ?? 0; // fill missing puroks with 0
            }

            // Optional: total for barangay
            $purokRow['total'] = array_sum($purokRow);

            $purokDataPerBarangay[$barangay->barangay_name] = $purokRow;

            $sexCounts = DB::table('residents')
                ->select(DB::raw('COUNT(*) as total'), 'sex')
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('sex')
                ->pluck('total', 'sex')
                ->toArray();

            $normalized = [];
            foreach ($sexCounts as $sex => $total) {
                $sex = strtolower(trim($sex));
                if ($sex === 'male' || $sex === 'm') $normalized['Male'] = $total;
                if ($sex === 'female' || $sex === 'f') $normalized['Female'] = $total;
            }

            $sexDataPerBarangay[$barangay->barangay_name] = [
                'Male'   => $normalized['Male'] ?? 0,
                'Female' => $normalized['Female'] ?? 0,
                'Total'  => ($normalized['Male'] ?? 0) + ($normalized['Female'] ?? 0), // 🔥 add total per barangay
            ];
        }

        // Total rows
        $totalAgeGroups = array_fill_keys($allAgeGroups, 0);
        $totalPuroks = array_fill_keys($purokColumns, 0);
        $totalPuroks['total'] = 0;

        foreach ($ageGroupDataPerBarangay as $row) {
            foreach ($allAgeGroups as $ageGroup) {
                $totalAgeGroups[$ageGroup] += $row[$ageGroup];
            }
        }

        foreach ($purokDataPerBarangay as $row) {
            foreach ($purokColumns as $col) {
                $totalPuroks[$col] += $row[$col];
            }
            $totalPuroks['total'] += $row['total'];
        }

        $ageGroupDataPerBarangay['Total'] = $totalAgeGroups;
        $purokDataPerBarangay['Total'] = $totalPuroks;


        // Sex totals
        $totalMale = 0;
        $totalFemale = 0;
        $totalOverall = 0;

        foreach ($sexDataPerBarangay as $barangayName => $row) {

            if ($barangayName === 'Total') {
                continue;
            }

            $male = $row['Male'] ?? 0;
            $female = $row['Female'] ?? 0;

            $totalMale   += $male;
            $totalFemale += $female;
            $totalOverall += $male + $female; // 🔥 accumulate total
        }

        $sexDataPerBarangay['Total'] = [
            'Male'   => $totalMale,
            'Female' => $totalFemale,
            'Total'  => $totalOverall, // 🔥 grand total
        ];

        return Inertia::render('SuperAdmin/Statistics/PopulationSummary', [
            'ageGroupsPerBarangay' => $ageGroupDataPerBarangay,
            'purokPerBarangay' => $purokDataPerBarangay,
            'sexPerBarangay' => $sexDataPerBarangay,     // 🔥 NEW
            'ageGroups' => $allAgeGroups,
            'purokColumns' => $purokColumns,
        ]);
    }

    public function employmentSummary()
    {
        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        // Final output array
        $employmentDataPerBarangay = [];

        // Define fixed employment categories
        $employmentCategories = [
            'employed',
            'unemployed',
            'self_employed',
            'student',
            'not_applicable'
        ];

        foreach ($barangays as $barangay) {

            // Query employment categories per barangay
            $employmentCounts = DB::table('residents')
                ->select(
                    DB::raw('COUNT(*) as total'),
                    'employment_status'
                )
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('employment_status')
                ->pluck('total', 'employment_status')
                ->toArray();

            // Build row ensuring all categories exist
            $row = [];
            foreach ($employmentCategories as $cat) {
                $row[$cat] = $employmentCounts[$cat] ?? 0;
            }

            // Total for the barangay
            $row['total'] = array_sum($row);

            $employmentDataPerBarangay[$barangay->barangay_name] = $row;
        }

        // ---- Compute TOTAL row ----
        $totalRow = array_fill_keys($employmentCategories, 0);
        $totalRow['total'] = 0;

        foreach ($employmentDataPerBarangay as $row) {
            foreach ($employmentCategories as $cat) {
                $totalRow[$cat] += $row[$cat];
            }
            $totalRow['total'] += $row['total'];
        }

        // Add total row
        $employmentDataPerBarangay['Total'] = $totalRow;


        return Inertia::render('SuperAdmin/Statistics/EmploymentSummary', [
            'employmentPerBarangay' => $employmentDataPerBarangay,
            'employmentCategories'  => $employmentCategories,
        ]);
    }
    //**============================================   REPORT GENERATION ====================================================== **//

    public function exportPopulationSummaryByAgeGroup()
    {
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        $allAgeGroups = [
            '0-6 months','7 months-2 years','3-5 years','6-12 years',
            '13-17 years','18-59 years','60+ years'
        ];

        $ageGroupDataPerBarangay = [];

        foreach ($barangays as $barangay) {
            $ageGroups = DB::table('residents')
                ->select(
                    DB::raw("COUNT(*) as total"),
                    DB::raw("
                        CASE
                            WHEN TIMESTAMPDIFF(MONTH, birthdate, CURDATE()) BETWEEN 0 AND 6 THEN '0-6 months'
                            WHEN TIMESTAMPDIFF(MONTH, birthdate, CURDATE()) BETWEEN 7 AND 24 THEN '7 months-2 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 3 AND 5 THEN '3-5 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 6 AND 12 THEN '6-12 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 13 AND 17 THEN '13-17 years'
                            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 18 AND 59 THEN '18-59 years'
                            ELSE '60+ years'
                        END as age_group
                    ")
                )
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('age_group')
                ->pluck('total', 'age_group')
                ->toArray();

            $ageGroupRow = [];
            foreach ($allAgeGroups as $ageGroup) {
                $ageGroupRow[$ageGroup] = $ageGroups[$ageGroup] ?? 0;
            }

            $ageGroupDataPerBarangay[$barangay->barangay_name] = $ageGroupRow;
        }

        // Total row
        $totalAgeGroups = array_fill_keys($allAgeGroups, 0);
        foreach ($ageGroupDataPerBarangay as $row) {
            foreach ($allAgeGroups as $ageGroup) {
                $totalAgeGroups[$ageGroup] += $row[$ageGroup];
            }
        }
        $ageGroupDataPerBarangay['Total'] = $totalAgeGroups;

        $pdf = Pdf::loadView('sadmin.age_group_summary', [
            'ageGroupsPerBarangay' => $ageGroupDataPerBarangay,
            'ageGroups' => $allAgeGroups,
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Age_Group_Summary.pdf');
    }
    public function exportPopulationSummaryByPurok()
    {
        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        $purokColumns = [1, 2, 3, 4, 5, 6, 7]; // fixed columns
        $purokDataPerBarangay = [];

        foreach ($barangays as $barangay) {
            // Get population per purok
            $puroks = DB::table('residents')
                ->select('purok_number', DB::raw('COUNT(*) as total_population'))
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('purok_number')
                ->pluck('total_population', 'purok_number')
                ->toArray();

            $purokRow = [];
            foreach ($purokColumns as $col) {
                $purokRow[$col] = $puroks[$col] ?? 0; // fill missing puroks with 0
            }

            $purokRow['total'] = array_sum($purokRow); // total population per barangay
            $purokDataPerBarangay[$barangay->barangay_name] = $purokRow;
        }

        // Total row
        $totalPuroks = array_fill_keys($purokColumns, 0);
        $totalPuroks['total'] = 0;
        foreach ($purokDataPerBarangay as $row) {
            foreach ($purokColumns as $col) {
                $totalPuroks[$col] += $row[$col];
            }
            $totalPuroks['total'] += $row['total'];
        }
        $purokDataPerBarangay['Total'] = $totalPuroks;

        // Prepare data for PDF
        $pdfData = [
            'purokPerBarangay' => $purokDataPerBarangay,
            'purokColumns' => $purokColumns,
            'year' => now('Asia/Manila')->year,
        ];

        // Load Blade template for PDF (create 'bims.population_summary_purok' blade)
        $pdf = Pdf::loadView('sadmin.population_summary_purok', $pdfData)
            ->setPaper('legal', 'landscape');

        return $pdf->stream('Population_Summary_By_Purok.pdf');
    }

    public function exportPopulationSummaryBySex()
    {
        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        $sexDataPerBarangay = [];

        foreach ($barangays as $barangay) {

            // Count Male + Female per barangay
            $sexCounts = DB::table('residents')
                ->select(
                    DB::raw('COUNT(*) as total'),
                    DB::raw("CASE
                                WHEN sex = 'male' THEN 'Male'
                                WHEN sex = 'female' THEN 'Female'
                            END as sex")
                )
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('sex')
                ->pluck('total', 'sex')
                ->toArray();

            $male   = $sexCounts['Male'] ?? 0;
            $female = $sexCounts['Female'] ?? 0;

            $sexDataPerBarangay[$barangay->barangay_name] = [
                'Male'   => $male,
                'Female' => $female,
                'Total'  => $male + $female,
            ];
        }

        // Compute total row
        $totalMale = 0;
        $totalFemale = 0;
        $totalOverall = 0;

        foreach ($sexDataPerBarangay as $row) {
            $totalMale    += $row['Male'];
            $totalFemale  += $row['Female'];
            $totalOverall += $row['Total'];
        }

        $sexDataPerBarangay['Total'] = [
            'Male'   => $totalMale,
            'Female' => $totalFemale,
            'Total'  => $totalOverall
        ];
        //dd($sexDataPerBarangay);
        // Prepare data for the PDF
        $pdfData = [
            'sexPerBarangay' => $sexDataPerBarangay,
            'year' => now('Asia/Manila')->year,
        ];

        // Load Blade template: create `sadmin.population_summary_sex`
        $pdf = Pdf::loadView('sadmin.population_summary_sex', $pdfData)
            ->setPaper('legal', 'landscape');

        return $pdf->stream('Population_Summary_By_Sex.pdf');
    }
    public function exportEmploymentSummary()
    {
        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        // Fixed employment categories
        $employmentCategories = [
            'employed',
            'unemployed',
            'self_employed',
            'student',
            'not_applicable'
        ];

        $employmentDataPerBarangay = [];

        foreach ($barangays as $barangay) {

            // Query employment status per barangay
            $employmentCounts = DB::table('residents')
                ->select(DB::raw('COUNT(*) as total'), 'employment_status')
                ->where('barangay_id', $barangay->id)
                ->where('is_deceased', false)
                ->groupBy('employment_status')
                ->pluck('total', 'employment_status')
                ->toArray();

            // Build row ensuring all categories exist
            $row = [];
            foreach ($employmentCategories as $cat) {
                $row[$cat] = $employmentCounts[$cat] ?? 0;
            }

            // Total for barangay
            $row['total'] = array_sum($row);

            $employmentDataPerBarangay[$barangay->barangay_name] = $row;
        }

        // Compute TOTAL row
        $totalRow = array_fill_keys($employmentCategories, 0);
        $totalRow['total'] = 0;

        foreach ($employmentDataPerBarangay as $row) {
            foreach ($employmentCategories as $cat) {
                $totalRow[$cat] += $row[$cat];
            }
            $totalRow['total'] += $row['total'];
        }

        $employmentDataPerBarangay['Total'] = $totalRow;

        // Prepare data for Blade PDF
        $pdfData = [
            'employmentPerBarangay' => $employmentDataPerBarangay,
            'employmentCategories' => $employmentCategories,
            'year' => now('Asia/Manila')->year,
        ];

        // Load Blade template: create `sadmin.employment_summary` blade
        $pdf = Pdf::loadView('sadmin.employment_summary', $pdfData)
            ->setPaper('legal', 'landscape');

        return $pdf->stream('Employment_Summary.pdf');
    }
}

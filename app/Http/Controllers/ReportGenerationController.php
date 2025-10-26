<?php

namespace App\Http\Controllers;

use App\Exports\BlotterReportExport;
use App\Exports\CertificateExport;
use App\Exports\EducationalHistoryExport;
use App\Exports\FamilyExport;
use App\Exports\FamilyMembersExport;
use App\Exports\HouseholdExport;
use App\Exports\HouseholdMembersExport;
use App\Exports\MedicalInformationExport;
use App\Exports\OccupationExport;
use App\Exports\PopulationExposureOverallExport;
use App\Exports\SeniorCitizenExport;
use App\Exports\SummonExport;
use App\Exports\VehicleExport;
use App\Models\Barangay;
use App\Models\CommunityRiskAssessment;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAHumanResource;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationGender;
use App\Models\Resident;
use Barryvdh\DomPDF\Facade\Pdf;
use DB;
use Illuminate\Http\Request;
use App\Exports\ResidentsExport;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportGenerationController extends Controller
{
    protected $data;
    public function __construct()
    {
        // Initialize barangay data for the logged-in user
        $this->data = Barangay::find(auth()->user()->barangay_id);
    }
    public function index()
    {
        return Inertia::render('BarangayOfficer/Reports/Index');
    }

    private function setfilename($name)
    {
        // Safely get barangay name
        $barangay = $this->data->barangay_name ?? 'Barangay';
        $year = now()->year;
        // Replace spaces with underscores for file name safety
        $fileName = str_replace(' ', '_', "{$barangay}_{$name}_{$year}.xlsx");

        return $fileName;
    }
    public function exportResidentWithFilters()
    {
        $fileName = $this->setfilename("Residents_Report");
        return Excel::download(new ResidentsExport, $fileName);
    }

    public function exportSeniorWithFilters()
    {
        $fileName = $this->setfilename("Senior_Citizen_Report");
        return Excel::download(new SeniorCitizenExport, $fileName);
    }

    public function exportFamily()
    {
        $fileName = $this->setfilename("Family_Report");
        return Excel::download(new FamilyExport, $fileName);
    }
    public function exportFamilyMembers()
    {
        $fileName = $this->setfilename("Family_Members_Report");
        return Excel::download(new FamilyMembersExport(), $fileName);
    }
    public function exportHousehold()
    {
        $fileName = $this->setfilename("Household_Report");
        return Excel::download(new HouseholdExport(), $fileName);
    }
    public function exportHouseholdMembers()
    {
        $fileName = $this->setfilename("Household_Members_Report");
        return Excel::download(new HouseholdMembersExport(), $fileName);
    }

    public function exportVehicles()
    {
        $fileName = $this->setfilename("Vehicles_Report");
        return Excel::download(new VehicleExport(), $fileName);
    }
    public function exportEducations()
    {
        $fileName = $this->setfilename("Resident_Educaitons_Report");
        return Excel::download(new EducationalHistoryExport(), $fileName);
    }
    public function exportOccupations()
    {
        $fileName = $this->setfilename("Resident_Occupations_Report");
        return Excel::download(new OccupationExport(), $fileName);
    }
    public function exportCertificates()
    {
        $fileName = $this->setfilename("Resident_Certificates_Report");
        return Excel::download(new CertificateExport(), $fileName);
    }
    public function exportBlotterReports()
    {
        $fileName = $this->setfilename("Resident_Blotters_Report");
        return Excel::download(new BlotterReportExport(), $fileName);
    }
    public function exportSummon()
    {
        $fileName = $this->setfilename("Resident_Summon_Report");
        return Excel::download(new SummonExport(), $fileName);
    }
    public function exportMedical()
    {
        $fileName = $this->setfilename("Resident_Medical_Information_Report");
        return Excel::download(new MedicalInformationExport(), $fileName);
    }

    //** ========================================= DOM PDF ========================================== **//
    public function exportPopulationExposureSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $hazardName = $request->input('hazard');

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        $hazard = DB::table('c_r_a_hazards')->where('hazard_name', $hazardName)->first();
        if (!$hazard) {
            return back()->with('error', 'Selected hazard not found.');
        }

        $exposures = DB::table('c_r_a_population_exposures as e')
            ->join('barangays as b', 'b.id', '=', 'e.barangay_id')
            ->select(
                'b.barangay_name',
                'e.purok_number',
                DB::raw('SUM(e.total_families) as families'),
                DB::raw('SUM(e.individuals_male) as male'),
                DB::raw('SUM(e.individuals_female) as female'),
                DB::raw('SUM(e.individuals_lgbtq) as lgbtq')
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.hazard_id', $hazard->id)
            ->groupBy('b.barangay_name', 'e.purok_number')
            ->orderBy('b.barangay_name')
            ->orderBy('e.purok_number')
            ->get();

        $grouped = [];
        foreach ($exposures as $row) {
            $barangay = $row->barangay_name;
            $purok = $row->purok_number;

            if (!isset($grouped[$barangay])) {
                $grouped[$barangay] = [];
                for ($i = 1; $i <= 7; $i++) {
                    $grouped[$barangay][$i] = [
                        'families' => 0,
                        'male' => 0,
                        'female' => 0,
                        'lgbtq' => 0,
                    ];
                }
            }

            $grouped[$barangay][$purok] = [
                'families' => $row->families,
                'male' => $row->male,
                'female' => $row->female,
                'lgbtq' => $row->lgbtq,
            ];
        }

        $pdf = Pdf::loadView('pdf.population_exposure_summary', [
            'year' => $cra->year,
            'hazardName' => $hazardName,
            'grouped' => $grouped,
        ])->setPaper('legal', 'landscape'); // ✅ Fits all columns better

        $sanitizedHazard = str_replace(['/', '\\'], '-', $hazardName);

        return $pdf->stream('Population_Exposure_Summary_' . $sanitizedHazard . '_' . $cra->year . '.pdf');
    }

    public function exportPopulationOverviewSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        // Get all age groups in order
        $allAgeGroups = CRAPopulationAgeGroup::where('cra_id', $cra->id)
            ->select('age_group')
            ->distinct()
            ->orderByRaw("
                FIELD(age_group,
                    '0-6 months','7 months-2 years','3-5 years','6-12 years',
                    '13-18 years','19-35 years','36-59 years','60-79 years','80+ years'
                )
            ")
            ->pluck('age_group')
            ->toArray();

        $grouped = [];

        foreach ($barangays as $barangay) {
            // General population & households
            $population = CRAGeneralPopulation::where('cra_id', $cra->id)
                ->where('barangay_id', $barangay->id)
                ->first();

            $totalPopulation = $population->total_population ?? 0;
            $totalHouseholds = $population->total_households ?? 0;
            $totalFamilies = $population->total_families ?? 0;

            // Gender totals
            $genderData = CRAPopulationGender::where('cra_id', $cra->id)
                ->where('barangay_id', $barangay->id)
                ->select(
                    DB::raw("SUM(CASE WHEN gender='Male' THEN quantity ELSE 0 END) as male"),
                    DB::raw("SUM(CASE WHEN gender='Female' THEN quantity ELSE 0 END) as female"),
                    DB::raw("SUM(CASE WHEN gender='LGBTQ' THEN quantity ELSE 0 END) as lgbtq")
                )
                ->first();

            // Age groups breakdown
            $ageGroups = CRAPopulationAgeGroup::where('cra_id', $cra->id)
                ->where('barangay_id', $barangay->id)
                ->get()
                ->keyBy('age_group') // Key by age group for easy lookup
                ->map(function ($item) {
                    return [
                        'male_without_disability' => $item->male_without_disability,
                        'male_with_disability' => $item->male_with_disability,
                        'female_without_disability' => $item->female_without_disability,
                        'female_with_disability' => $item->female_with_disability,
                        'lgbtq_without_disability' => $item->lgbtq_without_disability,
                        'lgbtq_with_disability' => $item->lgbtq_with_disability,
                        'total' => $item->male_without_disability + $item->male_with_disability +
                                $item->female_without_disability + $item->female_with_disability +
                                $item->lgbtq_without_disability + $item->lgbtq_with_disability,
                    ];
                });

            // Ensure all age groups exist even if zero
            $ageGroupData = [];
            foreach ($allAgeGroups as $ageGroup) {
                $ageGroupData[$ageGroup] = $ageGroups->has($ageGroup)
                    ? $ageGroups[$ageGroup]
                    : [
                        'male_without_disability' => 0,
                        'male_with_disability' => 0,
                        'female_without_disability' => 0,
                        'female_with_disability' => 0,
                        'lgbtq_without_disability' => 0,
                        'lgbtq_with_disability' => 0,
                        'total' => 0,
                    ];
            }

            $grouped[$barangay->barangay_name] = [
                'total_population' => $totalPopulation,
                'total_households' => $totalHouseholds,
                'total_families' => $totalFamilies,
                'gender' => [
                    'male' => $genderData->male ?? 0,
                    'female' => $genderData->female ?? 0,
                    'lgbtq' => $genderData->lgbtq ?? 0,
                ],
                'age_groups' => $ageGroupData,
            ];
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdf.population_overview_summary', [
            'year' => $cra->year,
            'grouped' => $grouped,
            'ageGroups' => $allAgeGroups,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Population_Overview_Summary_' . $cra->year . '.pdf');
    }

    public function exportTopHazardsSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        // Get all barangays
        $barangays = DB::table('barangays')->orderBy('barangay_name')->get();

        $grouped = [];

        foreach ($barangays as $barangay) {
            // Get top 10 hazards for this barangay
            $hazards = DB::table('c_r_a_hazard_risks as r')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
                ->where('r.cra_id', $cra->id)
                ->where('r.barangay_id', $barangay->id)
                ->select('h.hazard_name')
                ->orderByDesc('r.average_score')
                ->limit(10)
                ->get();

            $hazardList = $hazards->map(function ($h, $index) {
                return [
                    'no' => $index + 1,
                    'rank' => $index + 1,
                    'hazard_name' => $h->hazard_name,
                ];
            });

            $grouped[$barangay->barangay_name] = [
                'top_hazards' => $hazardList,
            ];
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdf.top_hazard_summary', [
            'year' => $cra->year,
            'grouped' => $grouped,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Top_Hazards_Summary_' . $cra->year . '.pdf');
    }

    public function exportLivelihoodSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();
        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        $barangayId = $request->query('barangay_id');

        // 🟩 BASE QUERY
        $data = DB::table('c_r_a_livelihood_statistics as ls')
            ->join('barangays as b', 'b.id', '=', 'ls.barangay_id')
            ->where('ls.cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('ls.barangay_id', $barangayId))
            ->select(
                'b.id as barangay_id',
                'b.barangay_name',
                'ls.livelihood_type',
                'ls.male_without_disability',
                'ls.male_with_disability',
                'ls.female_without_disability',
                'ls.female_with_disability',
                'ls.lgbtq_without_disability',
                'ls.lgbtq_with_disability',
                DB::raw('(
                    ls.male_without_disability +
                    ls.male_with_disability +
                    ls.female_without_disability +
                    ls.female_with_disability +
                    ls.lgbtq_without_disability +
                    ls.lgbtq_with_disability
                ) as total')
            )
            ->orderByDesc('total')
            ->get();

        if ($data->isEmpty()) {
            return back()->with('error', 'No livelihood records found for this year.');
        }

        // 🟦 Top 5 livelihood types across all barangays
        $livelihoodTypes = $data
            ->groupBy('livelihood_type')
            ->map(fn($group, $type) => [
                'type' => $type,
                'total' => $group->sum('total')
            ])
            ->sortByDesc('total')
            ->take(5)
            ->pluck('type')
            ->values();

        // 🟧 Build Barangay Rows
        $barangayRows = $data->groupBy('barangay_id')->map(function ($group) use ($livelihoodTypes) {
            $barangayName = $group->first()->barangay_name;
            $barangayTotal = 0;

            $row = ['barangay_name' => $barangayName];

            foreach ($livelihoodTypes as $type) {
                $entry = $group->firstWhere('livelihood_type', $type);
                $row[$type] = [
                    'male_without_disability' => (int) ($entry->male_without_disability ?? 0),
                    'male_with_disability' => (int) ($entry->male_with_disability ?? 0),
                    'female_without_disability' => (int) ($entry->female_without_disability ?? 0),
                    'female_with_disability' => (int) ($entry->female_with_disability ?? 0),
                    'lgbtq_without_disability' => (int) ($entry->lgbtq_without_disability ?? 0),
                    'lgbtq_with_disability' => (int) ($entry->lgbtq_with_disability ?? 0),
                ];
                $barangayTotal += array_sum($row[$type]);
            }

            $row['total'] = $barangayTotal;

            return $row;
        })->values();

        // 🟨 Overall total row
        $overallRow = ['barangay_name' => 'TOTAL', 'total' => 0];
        foreach ($livelihoodTypes as $type) {
            $overallRow[$type] = [
                'male_without_disability' => $barangayRows->sum(fn($r) => $r[$type]['male_without_disability'] ?? 0),
                'male_with_disability' => $barangayRows->sum(fn($r) => $r[$type]['male_with_disability'] ?? 0),
                'female_without_disability' => $barangayRows->sum(fn($r) => $r[$type]['female_without_disability'] ?? 0),
                'female_with_disability' => $barangayRows->sum(fn($r) => $r[$type]['female_with_disability'] ?? 0),
                'lgbtq_without_disability' => $barangayRows->sum(fn($r) => $r[$type]['lgbtq_without_disability'] ?? 0),
                'lgbtq_with_disability' => $barangayRows->sum(fn($r) => $r[$type]['lgbtq_with_disability'] ?? 0),
            ];
            $overallRow['total'] += array_sum($overallRow[$type]);
        }
        $barangayRows->push($overallRow);

        // 🟩 Generate PDF
        $pdf = Pdf::loadView('pdf.livelihood_summary', [
            'year' => $cra->year,
            'livelihoodTypes' => $livelihoodTypes,
            'barangayRows' => $barangayRows,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream("Livelihood_Summary_Top5_{$cra->year}.pdf");
    }

    public function exportHumanResourcesSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();
        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        $barangayId = $request->query('barangay_id');

        // 🟩 Base Query
        $data = CRAHumanResource::query()
            ->join('barangays', 'c_r_a_human_resources.barangay_id', '=', 'barangays.id')
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_human_resources.barangay_id', $barangayId))
            ->select(
                'barangays.id as barangay_id',
                'barangays.barangay_name',
                'c_r_a_human_resources.resource_name',
                'c_r_a_human_resources.male_without_disability',
                'c_r_a_human_resources.male_with_disability',
                'c_r_a_human_resources.female_without_disability',
                'c_r_a_human_resources.female_with_disability',
                'c_r_a_human_resources.lgbtq_without_disability',
                'c_r_a_human_resources.lgbtq_with_disability',
                DB::raw('(
                    male_without_disability + male_with_disability +
                    female_without_disability + female_with_disability +
                    lgbtq_without_disability + lgbtq_with_disability
                ) as total')
            )
            ->get();

        if ($data->isEmpty()) {
            return back()->with('error', 'No human resources data found for this year.');
        }

        // 🟦 Get Top 5 resource_names across all barangays
        $topResources = $data->groupBy('resource_name')
            ->reject(fn($group, $name) => empty($name) || $name === 'Not mentioned above (Specify)')
            ->map(fn($group, $name) => ['resource_name' => $name, 'total' => $group->sum('total')])
            ->sortByDesc('total')
            ->take(5)
            ->pluck('resource_name')
            ->values();

        // 🟧 Prepare Barangay rows
        $barangayRows = $data->groupBy('barangay_id')->map(function ($group) use ($topResources) {
            $barangayName = $group->first()->barangay_name;
            $barangayTotal = 0;

            $row = ['barangay_name' => $barangayName];

            foreach ($topResources as $resource) {
                $entry = $group->firstWhere('resource_name', $resource);
                $row[$resource] = [
                    'male_without_disability' => (int) ($entry->male_without_disability ?? 0),
                    'male_with_disability' => (int) ($entry->male_with_disability ?? 0),
                    'female_without_disability' => (int) ($entry->female_without_disability ?? 0),
                    'female_with_disability' => (int) ($entry->female_with_disability ?? 0),
                    'lgbtq_without_disability' => (int) ($entry->lgbtq_without_disability ?? 0),
                    'lgbtq_with_disability' => (int) ($entry->lgbtq_with_disability ?? 0),
                ];
                $barangayTotal += array_sum($row[$resource]);
            }

            $row['total'] = $barangayTotal;
            return $row;
        })->values();

        // 🟨 Overall total row
        $overallRow = ['barangay_name' => 'TOTAL', 'total' => 0];
        foreach ($topResources as $resource) {
            $overallRow[$resource] = [
                'male_without_disability' => $barangayRows->sum(fn($r) => $r[$resource]['male_without_disability'] ?? 0),
                'male_with_disability' => $barangayRows->sum(fn($r) => $r[$resource]['male_with_disability'] ?? 0),
                'female_without_disability' => $barangayRows->sum(fn($r) => $r[$resource]['female_without_disability'] ?? 0),
                'female_with_disability' => $barangayRows->sum(fn($r) => $r[$resource]['female_with_disability'] ?? 0),
                'lgbtq_without_disability' => $barangayRows->sum(fn($r) => $r[$resource]['lgbtq_without_disability'] ?? 0),
                'lgbtq_with_disability' => $barangayRows->sum(fn($r) => $r[$resource]['lgbtq_with_disability'] ?? 0),
            ];
            $overallRow['total'] += array_sum($overallRow[$resource]);
        }
        $barangayRows->push($overallRow);

        // 🟩 Generate PDF
        $pdf = Pdf::loadView('pdf.hr_summary', [
            'year' => $cra->year,
            'resources' => $topResources,
            'barangayRows' => $barangayRows,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream("HumanResources_Summary_Top5_{$cra->year}.pdf");
    }

    public function exportOverallDisasterRiskPopulationSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        $records = DB::table('c_r_a_disaster_risk_populations as r')
            ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                DB::raw('SUM(r.low_families) as low_families'),
                DB::raw('SUM(r.medium_families) as medium_families'),
                DB::raw('SUM(r.high_families) as high_families'),
                DB::raw('SUM(r.low_individuals) as low_individuals'),
                DB::raw('SUM(r.medium_individuals) as medium_individuals'),
                DB::raw('SUM(r.high_individuals) as high_individuals')
            )
            ->where('r.cra_id', $cra->id)
            ->groupBy('b.barangay_name', 'h.hazard_name')
            ->orderBy('b.barangay_name')
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return back()->with('error', 'No disaster risk population data found.');
        }

        // 🧮 Transform into [barangay => [hazard => values]]
        $data = [];
        foreach ($records as $row) {
            $barangay = $row->barangay_name;
            $hazard = $row->hazard_name;

            if (!isset($data[$barangay])) {
                $data[$barangay] = [];
            }

            $data[$barangay][$hazard] = [
                'low_families' => (int) $row->low_families,
                'low_individuals' => (int) $row->low_individuals,
                'medium_families' => (int) $row->medium_families,
                'medium_individuals' => (int) $row->medium_individuals,
                'high_families' => (int) $row->high_families,
                'high_individuals' => (int) $row->high_individuals,
            ];
        }

        // 🧾 Collect all unique hazards
        $hazards = $records->pluck('hazard_name')->unique()->values();

        // 🧹 Sanitize filename
        $filename = str_replace(['/', '\\'], '_', 'Disaster_Risk_Population_Summary_Overall_' . $cra->year . '.pdf');

        // 🧩 Generate PDF
        $pdf = Pdf::loadView('pdf.disaster_risk_population_overall_summary', [
            'year' => $cra->year,
            'data' => $data,      // ✅ renamed from grouped → data
            'hazards' => $hazards // ✅ now defined and passed
        ])->setPaper('legal', 'landscape');

        return $pdf->stream($filename);
    }

    public function exportPerHazardDisasterRiskPopulationSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $hazardName = $request->input('hazard') ?? session('selected_hazard'); // Get hazard from request or session

        if (!$hazardName) {
            return back()->with('error', 'No hazard selected.');
        }

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        $records = DB::table('c_r_a_disaster_risk_populations as r')
            ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
            ->select(
                'b.barangay_name',
                DB::raw('SUM(r.low_families) as low_families'),
                DB::raw('SUM(r.medium_families) as medium_families'),
                DB::raw('SUM(r.high_families) as high_families'),
                DB::raw('SUM(r.low_individuals) as low_individuals'),
                DB::raw('SUM(r.medium_individuals) as medium_individuals'),
                DB::raw('SUM(r.high_individuals) as high_individuals')
            )
            ->where('r.cra_id', $cra->id)
            ->where('h.hazard_name', $hazardName) // Filter by selected hazard
            ->groupBy('b.barangay_name')
            ->orderBy('b.barangay_name')
            ->get();

        if ($records->isEmpty()) {
            return back()->with('error', 'No disaster risk population data found for the selected hazard.');
        }

        // Transform into [barangay => values]
        $data = [];
        foreach ($records as $row) {
            $data[$row->barangay_name] = [
                'low_families' => (int) $row->low_families,
                'low_individuals' => (int) $row->low_individuals,
                'medium_families' => (int) $row->medium_families,
                'medium_individuals' => (int) $row->medium_individuals,
                'high_families' => (int) $row->high_families,
                'high_individuals' => (int) $row->high_individuals,
                'total_families' => (int) ($row->low_families + $row->medium_families + $row->high_families),
                'total_individuals' => (int) ($row->low_individuals + $row->medium_individuals + $row->high_individuals),
            ];
        }

        $filename = str_replace(['/', '\\'], '_', 'Disaster_Risk_Population_' . $hazardName . '_' . $cra->year . '.pdf');

        $hazardClass = strtolower($hazardName) . '-header';

        $pdf = Pdf::loadView('pdf.disaster_risk_population_per_hazard', [
            'year' => $cra->year,
            'hazard' => $hazardName,
            'hazardClass' => $hazardClass,  // ✅ pass this to the view
            'barangays' => $data
        ])->setPaper('legal', 'landscape');

        return $pdf->stream($filename);
    }

    public function exportOverallRiskMatrixSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        // Get all hazards
        $hazards = DB::table('c_r_a_hazards')->pluck('hazard_name');

        // Get overall data: total people per barangay per hazard
        $records = DB::table('c_r_a_assessment_matrices as m')
            ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
            ->select('b.barangay_name', 'h.hazard_name', DB::raw('SUM(m.people) as total_people'))
            ->where('m.matrix_type', 'risk')
            ->where('m.cra_id', $cra->id)
            ->groupBy('b.barangay_name', 'h.hazard_name')
            ->orderBy('b.barangay_name')
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return back()->with('error', 'No risk matrix data found.');
        }

        // ✅ Unique hazards from records
        $hazards = $records->pluck('hazard_name')->unique()->values();

        // ✅ All barangays
        $allBarangays = $records->pluck('barangay_name')->unique();

        // ✅ Initialize data array
        $data = [];
        foreach ($allBarangays as $barangay) {
            foreach ($hazards as $hazard) {
                $data[$barangay][$hazard] = 0;
            }
        }

        // ✅ Fill actual counts
        foreach ($records as $row) {
            $data[$row->barangay_name][$row->hazard_name] = (int) $row->total_people;
        }

        $filename = str_replace(['/', '\\'], '_', "Risk_Matrix_Overall_{$cra->year}.pdf");

        $pdf = Pdf::loadView('pdf.risk_matrix_overall', [
            'year' => $cra->year,
            'data' => $data,
            'hazards' => $hazards,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream($filename);
    }

    public function exportOverallVulnerabilityMatrixSummary(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            return back()->with('error', 'CRA record not found for the selected year.');
        }

        // Get all hazards
        $hazards = DB::table('c_r_a_hazards')->pluck('hazard_name');

        // Get overall data: total people per barangay per hazard
        $records = DB::table('c_r_a_assessment_matrices as m')
            ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
            ->select('b.barangay_name', 'h.hazard_name', DB::raw('SUM(m.people) as total_people'))
            ->where('m.matrix_type', 'vulnerability')
            ->where('m.cra_id', $cra->id)
            ->groupBy('b.barangay_name', 'h.hazard_name')
            ->orderBy('b.barangay_name')
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return back()->with('error', 'No risk matrix data found.');
        }

        // ✅ Unique hazards from records
        $hazards = $records->pluck('hazard_name')->unique()->values();

        // ✅ All barangays
        $allBarangays = $records->pluck('barangay_name')->unique();

        // ✅ Initialize data array
        $data = [];
        foreach ($allBarangays as $barangay) {
            foreach ($hazards as $hazard) {
                $data[$barangay][$hazard] = 0;
            }
        }

        // ✅ Fill actual counts
        foreach ($records as $row) {
            $data[$row->barangay_name][$row->hazard_name] = (int) $row->total_people;
        }

        $filename = str_replace(['/', '\\'], '_', "Vulnerability_Matrix_Overall_{$cra->year}.pdf");

        $pdf = Pdf::loadView('pdf.vulnerability_matrix_overall', [
            'year' => $cra->year,
            'data' => $data,
            'hazards' => $hazards,
        ])->setPaper('legal', 'landscape');

        return $pdf->stream($filename);
    }
}

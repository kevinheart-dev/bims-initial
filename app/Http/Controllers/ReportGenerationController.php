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
use App\Models\Allergy;
use App\Models\Barangay;
use App\Models\BlotterReport;
use App\Models\Certificate;
use App\Models\CommunityRiskAssessment;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAHumanResource;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationGender;
use App\Models\EducationalHistory;
use App\Models\Family;
use App\Models\Household;
use App\Models\HouseholdResident;
use App\Models\MedicalInformation;
use App\Models\Occupation;
use App\Models\Resident;
use App\Models\Summon;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use App\Exports\ResidentsExport;
use Illuminate\Support\Str;
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
    public function exportResidentInfoPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        // ✅ Base query
        $query = Resident::select([
                'id', 'barangay_id', 'firstname', 'middlename', 'lastname', 'suffix',
                'sex', 'purok_number', 'birthdate', 'civil_status', 'ethnicity', 'religion',
                'contact_number', 'email', 'is_pwd', 'registered_voter', 'employment_status',
            ])
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->with([
                'occupations' => fn($q) => $q->latest('started_at')->limit(1),
                'socialwelfareprofile:id,resident_id,is_solo_parent,is_4ps_beneficiary',
            ]);

        // ✅ Search by name
        if ($name = trim($request->input('name'))) {
            $like = "%{$name}%";
            $query->where(function ($q) use ($like) {
                $q->where('firstname', 'like', $like)
                ->orWhere('lastname', 'like', $like)
                ->orWhere('middlename', 'like', $like)
                ->orWhere('suffix', 'like', $like)
                ->orWhereRaw("CONCAT_WS(' ', firstname, middlename, lastname, suffix) LIKE ?", [$like]);
            });
        }

        // ✅ Filters
        $filters = [
            'purok' => 'purok_number',
            'sex' => 'sex',
            'gender' => 'gender',
            'estatus' => 'employment_status',
            'cstatus' => 'civil_status',
            'voter_status' => 'registered_voter',
        ];

        foreach ($filters as $param => $column) {
            if ($request->filled($param) && $request->input($param) !== 'All') {
                $query->where($column, $request->input($param));
            }
        }

        // ✅ Age group filter
        if (($ageGroup = $request->input('age_group')) && $ageGroup !== 'All') {
            $today = Carbon::today();

            [$min, $max] = match ($ageGroup) {
                '0_6_months' => [$today->clone()->subMonths(6), $today],
                '7mos_2yrs'  => [$today->clone()->subYears(2), $today->clone()->subMonths(7)],
                '3_5yrs'     => [$today->clone()->subYears(5), $today->clone()->subYears(3)],
                '6_12yrs'    => [$today->clone()->subYears(12), $today->clone()->subYears(6)],
                '13_17yrs'   => [$today->clone()->subYears(17), $today->clone()->subYears(13)],
                '18_59yrs'   => [$today->clone()->subYears(59), $today->clone()->subYears(18)],
                '60_above'   => [null, $today->clone()->subYears(60)],
                default      => [null, null],
            };

            if ($min && $max) {
                $query->whereBetween('birthdate', [$min, $max]);
            } elseif ($max) {
                $query->where('birthdate', '<=', $max);
            }
        }

        // ✅ Social welfare filters
        if ($request->input('fourps') === '1' || $request->input('solo_parent') === '1' || $request->input('pwd') === '1') {
            $query->whereHas('socialwelfareprofile', function ($q) use ($request) {
                if ($request->input('fourps') === '1') $q->where('is_4ps_beneficiary', 1);
                if ($request->input('solo_parent') === '1') $q->where('is_solo_parent', 1);
                if ($request->input('pwd') === '1') $q->where('is_pwd', 1);
            });
        }

        $residents = $query->orderBy('lastname', 'asc')
                        ->orderBy('firstname', 'asc')
                        ->get();

        // ✅ Prepare PDF data
        $data = $residents->map(fn($r) => [
            'first_name' => $r->firstname,
            'middle_name' => $r->middlename,
            'last_name' => $r->lastname,
            'suffix' => $r->suffix,
            'sex' => $r->sex,
            'purok' => $r->purok_number,
            'birthdate' => $r->birthdate,
            'age' => $r->age,
            'civil_status' => $r->civil_status,
            'ethnicity' => $r->ethnicity,
            'religion' => $r->religion,
            'contact_number' => $r->contact_number,
            'email' => $r->email,
            'registered_voter' => $r->registered_voter ? 'Yes' : 'No',
            'employment_status' => $r->employment_status,
            'is_pwd' => $r->is_pwd ? 'Yes' : 'No',
            'solo_parent' => $r->socialwelfareprofile?->is_solo_parent ? 'Yes' : 'No',
            'is_4ps' => $r->socialwelfareprofile?->is_4ps_beneficiary ? 'Yes' : 'No',
            'occupation' => $r->occupations->first()?->occupation ?? '-',
        ]);
        $barangay = auth()->user()->barangay()->first();

        $pdf = Pdf::loadView('bims.resident_summary', [
            'residents' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null, // pass logo path
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Resident_Information_List.pdf');
    }
    public function exportSeniorCitizensPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $today = Carbon::today();

        // Base query
        $query = Resident::select([
                'residents.id', 'residents.firstname', 'residents.middlename', 'residents.lastname',
                'residents.suffix', 'residents.sex', 'residents.purok_number', 'residents.birthdate'
            ])
            ->with(['seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone'])
            ->where('residents.barangay_id', $brgy_id)
            ->where('residents.is_deceased', false)
            ->whereDate('residents.birthdate', '<=', $today->copy()->subYears(60))
            ->leftJoin('senior_citizens', 'residents.id', '=', 'senior_citizens.resident_id')
            ->distinct();

        // Search by name
        if ($name = trim($request->input('name'))) {
            $like = "%{$name}%";
            $query->where(function ($q) use ($like) {
                $q->where('residents.firstname', 'like', $like)
                ->orWhere('residents.lastname', 'like', $like)
                ->orWhere('residents.middlename', 'like', $like)
                ->orWhere('residents.suffix', 'like', $like)
                ->orWhereRaw("CONCAT_WS(' ', firstname, middlename, lastname, suffix) LIKE ?", [$like]);
            });
        }

        // Filters
        $filters = [
            'sex' => 'residents.sex',
            'gender' => 'residents.gender',
            'purok' => 'residents.purok_number',
            'is_pensioner' => 'senior_citizens.is_pensioner',
            'pension_type' => 'senior_citizens.pension_type',
            'living_alone' => 'senior_citizens.living_alone',
            'is_registered' => 'senior_citizens.id',
            'birth_month' => 'residents.birthdate',
        ];

        foreach ($filters as $param => $column) {
            if ($request->filled($param) && $request->input($param) !== 'All') {
                if ($param === 'is_registered') {
                    if ($request->input($param) === 'yes') {
                        $query->whereNotNull('senior_citizens.id');
                    } else {
                        $query->whereNull('senior_citizens.id');
                    }
                } elseif ($param === 'birth_month') {
                    $query->whereMonth('residents.birthdate', intval($request->input($param)));
                } else {
                    $query->where($column, $request->input($param));
                }
            }
        }

        // Sorting: by lastname then firstname
        $query->orderBy('residents.lastname', 'asc')
            ->orderBy('residents.firstname', 'asc');

        $seniors = $query->get();

        // Prepare PDF data
        $data = $seniors->map(fn($r) => [
            'first_name' => $r->firstname,
            'middle_name' => $r->middlename,
            'last_name' => $r->lastname,
            'suffix' => $r->suffix,
            'sex' => $r->sex,
            'purok' => $r->purok_number,
            'birthdate' => $r->birthdate,
            'age' => $r->age,
            'osca_id' => $r->seniorcitizen?->osca_id_number ?? '-',
            'is_pensioner' => $r->seniorcitizen?->is_pensioner ? 'Yes' : 'No',
            'pension_type' => $r->seniorcitizen?->pension_type ?? '-',
            'living_alone' => $r->seniorcitizen?->living_alone ? 'Yes' : 'No',
        ]);

        $barangay = auth()->user()->barangay()->first();

        // Load Dompdf view
        $pdf = Pdf::loadView('bims.senior_citizen_summary', [
            'residents' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' =>now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Senior_Citizens_List.pdf');
    }
    private const INCOME_CATEGORY_TEXT = [
        'below_5000'    => 'Survival',
        '5001_10000'    => 'Poor',
        '10001_20000'   => 'Low Income',
        '20001_40000'   => 'Lower Middle Income',
        '40001_70000'   => 'Middle Income',
        '70001_120000'  => 'Upper Middle Income',
        'above_120001'  => 'High Income',
    ];
    private const INCOME_BRACKET_TEXT = [
        'below_5000'    => 'Below 5,000 PHP',
        '5001_10000'    => '5,001 - 10,000 PHP',
        '10001_20000'   => '10,001 - 20,000 PHP',
        '20001_40000'   => '20,001 - 40,000 PHP',
        '40001_70000'   => '40,001 - 70,000 PHP',
        '70001_120000'  => '70,001 - 120,000 PHP',
        'above_120001'  => '120,001 PHP and above',
    ];
    public function exportFamilyPdf(Request $request)
    {
        $barangay = auth()->user()->barangay()->first();

        // Fetch families with related data
        $families = Family::with(['latestHead', 'members', 'household.purok'])
            ->join('households', 'families.household_id', '=', 'households.id')
            ->join('puroks', 'households.purok_id', '=', 'puroks.id')
            ->where('families.barangay_id', auth()->user()->barangay_id)
            ->orderBy('puroks.purok_number', 'asc')
            ->select('families.*')
            ->get();

        $FAMILY_TYPE_TEXT = [
            'nuclear'              => 'Nuclear',
            'single_parent'        => 'Single-parent',
            'extended'             => 'Extended',
            'stepfamilies'         => 'Stepfamilies',
            'grandparent'          => 'Grandparent',
            'childless'            => 'Childless',
            'cohabiting_partners'  => 'Cohabiting Partners',
            'one_person_household' => 'One-person Household',
            'roommates'            => 'Roommates',
            'other'                => 'Other',
        ];

        $familyData = $families->map(function ($family) use ($FAMILY_TYPE_TEXT) {
            return [
                'Family Name'     => $family->family_name ?? 'N/A',
                'Family Type'     => $FAMILY_TYPE_TEXT[$family->family_type] ?? 'N/A',
                'Income Bracket'  => self::INCOME_BRACKET_TEXT[$family->income_bracket] ?? 'N/A',
                'Income Category' => self::INCOME_CATEGORY_TEXT[$family->income_bracket] ?? 'N/A',
                'Family Head'     => $family->latestHead?->fullname ?? 'N/A',
                'Members Count'   => $family->members?->count() ?? 0,
                'Purok'           => $family->household?->purok?->purok_number ?? 'N/A',
            ];
        });

        $pdf = Pdf::loadView('bims.family_summary', [
            'families' => $familyData,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $familyData->count(),
            'generatedAt' =>now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Family_Information_List.pdf');
    }
    public function exportFamilyMembersPdf()
    {
        $barangay = auth()->user()->barangay()->first();

        // Fetch families with members and purok
        $families = Family::with(['members', 'household.purok'])
            ->join('households', 'families.household_id', '=', 'households.id')
            ->join('puroks', 'households.purok_id', '=', 'puroks.id')
            ->where('families.barangay_id', auth()->user()->barangay_id)
            ->orderBy('puroks.purok_number', 'asc')
            ->select('families.*')
            ->get();

        $rows = [];
        foreach ($families as $family) {
            // Family row
            $rows[] = [
                'family_name' => $family->family_name ?? 'N/A',
                'full_name'   => '',
                'gender'      => '',
                'birthdate'   => '',
                'purok'       => $family->household?->purok?->purok_number ?? 'N/A',
            ];

            // Member rows
            foreach ($family->members as $member) {
                $rows[] = [
                    'family_name' => '',
                    'full_name'   => $member->fullname,
                    'gender'      => $member->gender,
                    'birthdate'   => $member->birthdate,
                    'purok'       => '',
                ];
            }
        }

        return Pdf::loadView('bims.family_pdf', [
            'rows' => $rows,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'cityLogo' => public_path('images/city-of-ilagan.png'),
            'totalFamilies' => $families->count(),
            'generatedAt' =>now('Asia/Manila')->format('F d, Y h:i A'),
        ])
        ->setPaper('legal', 'landscape')
        ->stream('Family_Information_List.pdf');
    }
    public function exportHouseholdPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = HouseholdResident::query()
            ->with([
                'resident:id,firstname,lastname,middlename,suffix,gender,birthdate',
                'household:id,barangay_id,purok_id,street_id,house_number,ownership_type,housing_condition,year_established,house_structure,number_of_rooms,number_of_floors',
                'household.street:id,street_name',
                'household.purok:id,purok_number',
            ])
            ->whereHas('household', fn($q) => $q->where('barangay_id', $brgy_id))
            ->where('relationship_to_head', 'self')
            ->whereIn('id', function ($sub) {
                $sub->selectRaw('MAX(id)')
                    ->from('household_residents')
                    ->where('relationship_to_head', 'self')
                    ->groupBy('household_id');
            })
            ->with(['household' => fn($q) => $q->withCount('residents')])
            ->latest('updated_at');

        // Filters (optional)
        if ($name = $request->input('name')) {
            $parts = collect(explode(' ', trim($name)))->filter()->values();
            $query->whereHas('resident', function ($r) use ($parts, $name) {
                $r->where(function ($w) use ($parts, $name) {
                    foreach ($parts as $part) {
                        $w->orWhere('firstname', 'like', "%{$part}%")
                        ->orWhere('lastname', 'like', "%{$part}%")
                        ->orWhere('middlename', 'like', "%{$part}%")
                        ->orWhere('suffix', 'like', "%{$part}%");
                    }
                    $w->orWhereRaw("CONCAT(firstname,' ',lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname,' ',middlename,' ',lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname,' ',middlename,' ',lastname,' ',suffix) LIKE ?", ["%{$name}%"]);
                });
            });
        }

        // Other filters (purok, street, ownership, etc.)
        foreach (['purok', 'street', 'own_type', 'condition', 'structure'] as $filter) {
            if ($request->filled($filter) && $request->input($filter) !== 'All') {
                $query->when($filter === 'purok', fn($q) => $q->whereHas('household.purok', fn($q) => $q->where('purok_number', $request->input($filter))))
                    ->when($filter === 'street', fn($q) => $q->whereHas('household.street', fn($q) => $q->where('street_name', $request->input($filter))))
                    ->when($filter === 'own_type', fn($q) => $q->whereHas('household', fn($q) => $q->where('ownership_type', $request->input($filter))))
                    ->when($filter === 'condition', fn($q) => $q->whereHas('household', fn($q) => $q->where('housing_condition', $request->input($filter))))
                    ->when($filter === 'structure', fn($q) => $q->whereHas('household', fn($q) => $q->where('house_structure', $request->input($filter))));
            }
        }

        $heads = $query->get();

        $rows = $heads->map(function ($head, $index) {
            $h = $head->household;
            return [
                'No'                => $index + 1,
                'Head'              => $head->resident?->fullname ?? 'N/A',
                'House Number'      => $h->house_number ?? 'N/A',
                'Street'            => $h->street?->street_name ?? 'N/A',
                'Purok'             => $h->purok?->purok_number ?? 'N/A',
                'Ownership Type'    => ucfirst($h->ownership_type ?? 'N/A'),
                'Housing Condition' => ucfirst($h->housing_condition ?? 'N/A'),
                'House Structure'   => ucfirst($h->house_structure ?? 'N/A'),
                'Year Established'  => $h->year_established ?? 'N/A',
                'Rooms'             => $h->number_of_rooms ?? 0,
                'Floors'            => $h->number_of_floors ?? 0,
                'Members Count'     => $h->residents_count ?? 0,
            ];
        });

        $barangay = auth()->user()->barangay;

        $pdf = Pdf::loadView('bims.household_summary', [
            'households' => $rows,
            'barangayName' => $barangay?->barangay_name ?? 'N/A',
            'barangayLogo' => $barangay?->logo_path ?? null, // pass the logo
            'generatedAt' => now()->format('F d, Y H:i'),
            'totalRecords' => $rows->count(),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Household_Summary_' . now()->format('Ymd_His') . '.pdf');
    }
    public function exportHouseholdMembersPdf(Request $request)
    {
        $barangay = auth()->user()->barangay;

        $brgy_id = $barangay->id;

        $query = Household::with(['householdResidents.resident', 'purok'])
            ->where('barangay_id', $brgy_id)
            ->orderBy('purok_id', 'asc');

        // Head name search
        if ($name = $request->input('name')) {
            $name = trim($name);
            $parts = collect(explode(' ', $name))->filter()->values();

            $query->whereHas('householdResidents', function ($q) use ($parts, $name) {
                $q->where('relationship_to_head', 'self')
                ->whereHas('resident', function ($r) use ($parts, $name) {
                    $r->where(function ($w) use ($parts, $name) {
                        foreach ($parts as $part) {
                            $w->orWhere('firstname', 'like', "%{$part}%")
                                ->orWhere('lastname', 'like', "%{$part}%")
                                ->orWhere('middlename', 'like', "%{$part}%")
                                ->orWhere('suffix', 'like', "%{$part}%");
                        }
                        $w->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
                    });
                });
            });
        }

        // Optional filters
        foreach (['purok', 'street', 'own_type', 'condition', 'structure'] as $filter) {
            if ($request->filled($filter) && $request->input($filter) !== 'All') {
                match ($filter) {
                    'purok' => $query->whereHas('purok', fn($q) => $q->where('purok_number', $request->input($filter))),
                    'street' => $query->whereHas('street', fn($q) => $q->where('street_name', $request->input($filter))),
                    'own_type' => $query->where('ownership_type', $request->input($filter)),
                    'condition' => $query->where('housing_condition', $request->input($filter)),
                    'structure' => $query->where('house_structure', $request->input($filter)),
                };
            }
        }

        $households = $query->get();

        $rows = [];
        foreach ($households as $household) {
            $head = $household->householdResidents
                        ->firstWhere('relationship_to_head', 'self')?->resident?->fullname ?? 'N/A';

            // Household row
            $rows[] = [
                'household' => "Household #{$household->house_number}",
                'head' => $head,
                'full_name' => '',
                'gender' => '',
                'birthdate' => '',
                'purok' => $household->purok?->purok_number ?? 'N/A',
            ];

            // Member rows
            foreach ($household->householdResidents as $member) {
                $rows[] = [
                    'household' => '',
                    'head' => '',
                    'full_name' => $member->resident?->fullname ?? 'N/A',
                    'gender' => $member->resident?->gender ?? 'N/A',
                    'birthdate' => $member->resident?->birthdate ?? 'N/A',
                    'purok' => '',
                ];
            }
        }

        return Pdf::loadView('bims.household_members_pdf', [
            'rows' => $rows,
            'barangayName' => $barangay->barangay_name ?? 'N/A',
            'barangayLogo' => $barangay->logo_path ?? null, // pass logo path
            'totalHouseholds' => $households->count(),
            'generatedAt' =>now('Asia/Manila')->format('F d, Y h:i A'),
        ])
        ->setPaper('legal', 'landscape')
        ->stream('Household_Summary.pdf');
    }
    public function exportHouseholdOverviewPDF()
    {
        $barangayId = auth()->user()->barangay_id;

        // 🧠 Barangay Info
        $barangay = Barangay::find($barangayId);
        $barangayName = $barangay->barangay_name ?? 'Unknown Barangay';

        // 🟢 Base Query for Households
        $households = Household::query()
            ->select(['id', 'barangay_id', 'purok_id', 'house_number', 'bath_and_wash_area'])
            ->with([
                'toilets:id,household_id,toilet_type',
                'electricityTypes:id,household_id,electricity_type',
                'waterSourceTypes:id,household_id,water_source_type',
                'wasteManagementTypes:id,household_id,waste_management_type',
                'livestocks:id,household_id,livestock_type,quantity',
                'pets:id,household_id,pet_type,is_vaccinated',
                'internetAccessibility:id,household_id,type_of_internet',
                'purok:id,purok_number',
            ])
            ->where('barangay_id', $barangayId)
            ->orderBy('house_number', 'asc')
            ->get();

        // 🧩 Format each row for clarity
        $rows = $households->map(function ($h) {
            // Clean helper: replace underscores, lowercase -> sentence case
            $format = fn($val) => $val
                ? Str::of($val)
                    ->replace('_', ' ')
                    ->title() // "solar renewable energy source" -> "Solar Renewable Energy Source"
                : 'N/A';

            // 🧱 Relationships: join values, clean formatting
            $toilets = $h->toilets->pluck('toilet_type')->unique()
                ->map($format)->join(', ') ?: 'N/A';
            $electricity = $h->electricityTypes->pluck('electricity_type')->unique()
                ->map($format)->join(', ') ?: 'N/A';
            $water = $h->waterSourceTypes->pluck('water_source_type')->unique()
                ->map($format)->join(', ') ?: 'N/A';
            $waste = $h->wasteManagementTypes->pluck('waste_management_type')->unique()
                ->map($format)->join(', ') ?: 'N/A';
            $internet = $h->internetAccessibility->pluck('type_of_internet')->unique()
                ->map($format)->join(', ') ?: 'N/A';

            // 🐔 Livestock summary
            $livestock = $h->livestocks->map(function ($l) use ($format) {
                return $format($l->livestock_type) . " ({$l->quantity})";
            })->join(', ') ?: 'N/A';

            // 🐶 Pet summary
            $pets = $h->pets->map(function ($p) use ($format) {
                $vax = $p->is_vaccinated ? 'Vaccinated' : 'Not Vaccinated';
                return $format($p->pet_type) . " ({$vax})";
            })->join(', ') ?: 'N/A';

            return [
                'id' => $h->id,
                'house_number' => $h->house_number ?? 'N/A',
                'bath_and_wash_area' => $format($h->bath_and_wash_area),
                'toilets' => $toilets,
                'electricity' => $electricity,
                'water' => $water,
                'waste' => $waste,
                'livestock' => $livestock,
                'pets' => $pets,
                'internet' => $internet,
                'purok' => $h->purok->purok_number ?? 'N/A',
            ];
        });

        // 🧮 Summary
        $totalHouseholds = $households->count();
        $purokDistribution = $households
            ->groupBy(fn($h) => $h->purok->purok_number ?? 'N/A')
            ->map->count()
            ->toArray();

        // 🖨️ Generate PDF
        $pdf = PDF::loadView('bims.household_services_summary', [
            'barangayName' => $barangayName,
            'barangayLogo' => $barangay->logo_path,
            'rows' => $rows,
            'totalHouseholds' => $totalHouseholds,
            'purokDistribution' => $purokDistribution,
            'generatedAt' =>now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('a4', 'landscape');

        return $pdf->stream("{$barangayName}-Household-Overview.pdf");
    }
    public function exportVehicleInfoPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $barangay = Barangay::find($brgy_id);

        // --- Base Resident Query ---
        $query = Resident::where('barangay_id', $brgy_id)
            ->whereHas('vehicles', function ($q) use ($request) {
                if ($request->filled('v_type') && $request->v_type !== 'All') {
                    $q->where('vehicle_type', $request->v_type);
                }
                if ($request->filled('v_class') && $request->v_class !== 'All') {
                    $q->where('vehicle_class', $request->v_class);
                }
                if ($request->filled('usage') && $request->usage !== 'All') {
                    $q->where('usage_status', $request->usage);
                }
            })
            ->with(['vehicles' => function ($q) use ($request) {
                if ($request->filled('v_type') && $request->v_type !== 'All') {
                    $q->where('vehicle_type', $request->v_type);
                }
                if ($request->filled('v_class') && $request->v_class !== 'All') {
                    $q->where('vehicle_class', $request->v_class);
                }
                if ($request->filled('usage') && $request->usage !== 'All') {
                    $q->where('usage_status', $request->usage);
                }
            }])
            ->when($request->filled('purok') && $request->purok !== 'All', fn($q) => $q->where('purok_number', $request->purok))
            ->when($request->filled('name'), function ($q) use ($request) {
                $name = trim($request->name);
                $q->whereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', COALESCE(suffix,'')) LIKE ?", ["%{$name}%"]);
            })
            ->select('id', 'firstname', 'middlename', 'lastname', 'suffix', 'purok_number')
            ->orderBy('lastname', 'asc')
            ->orderBy('firstname', 'asc');

        $residents = $query->get();

        // --- Flatten Vehicles ---
        $vehicles = $residents->flatMap(function ($resident) {
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            return $resident->vehicles->map(function ($vehicle) use ($resident, $fullName) {
                return [
                    'Resident ID'   => $resident->id,
                    'Full Name'     => $fullName,
                    'Purok'         => $resident->purok_number,
                    'Vehicle Type'  => $vehicle->vehicle_type,
                    'Vehicle Class' => $vehicle->vehicle_class,
                    'Usage Status'  => $vehicle->usage_status,
                ];
            });
        });

        // --- Totals for Summary ---
        $total = $vehicles->count();
        $typeCounts = $vehicles->groupBy('Vehicle Type')->map->count();
        $classCounts = $vehicles->groupBy('Vehicle Class')->map->count();
        $usageCounts = $vehicles->groupBy('Usage Status')->map->count();
        $purokCounts = $vehicles->groupBy('Purok')->map->count();

        // --- Generate PDF ---
        $pdf = Pdf::loadView('bims.vehicle_summary', [
            'vehicles' => $vehicles,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $total,
            'typeCounts' => $typeCounts,
            'classCounts' => $classCounts,
            'usageCounts' => $usageCounts,
            'purokCounts' => $purokCounts,
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Vehicle_Information_List.pdf');
    }
    public function exportEducationalHistoryPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = EducationalHistory::with([
            'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
        ])
        ->select(
            'id',
            'resident_id',
            'school_name',
            'school_type',
            'educational_attainment',
            'education_status',
            'year_started',
            'year_ended',
            'program'
        )
        ->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id)
            ->where('is_deceased', false);
        });

        // ✅ Latest education only
        if ($request->filled('latest_education') && $request->input('latest_education') === '1') {
            $query = EducationalHistory::select('educational_histories.*')
                ->join(DB::raw('(
                    SELECT resident_id, MAX(year_ended) AS max_year
                    FROM educational_histories
                    GROUP BY resident_id
                ) AS latest'), function ($join) {
                    $join->on('educational_histories.resident_id', '=', 'latest.resident_id')
                        ->on('educational_histories.year_ended', '=', 'latest.max_year');
                })
                ->with([
                    'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
                ])
                ->whereHas('resident', function ($q) use ($brgy_id) {
                    $q->where('barangay_id', $brgy_id)
                    ->where('is_deceased', false);
                });
        }

        // ✅ Name and school/program search
        if ($request->filled('name')) {
            $search = trim($request->input('name'));
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', COALESCE(suffix,'')) LIKE ?", ["%{$search}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                })
                ->orWhere('school_name', 'like', "%{$search}%")
                ->orWhere('program', 'like', "%{$search}%");
            });
        }

        // ✅ Additional filters
        if ($request->filled('purok') && $request->input('purok') !== 'All') {
            $query->whereHas('resident', function ($q) use ($request) {
                $q->where('purok_number', $request->input('purok'));
            });
        }

        if ($request->filled('educational_attainment') && $request->input('educational_attainment') !== 'All') {
            $query->where('educational_attainment', $request->input('educational_attainment'));
        }

        if ($request->filled('education_status') && $request->input('education_status') !== 'All') {
            $query->where('education_status', $request->input('education_status'));
        }

        if ($request->filled('school_type') && $request->input('school_type') !== 'All') {
            $query->where('school_type', $request->input('school_type'));
        }

        if ($request->filled('year_started') && $request->input('year_started') !== 'All') {
            $query->where('year_started', $request->input('year_started'));
        }

        if ($request->filled('year_ended') && $request->input('year_ended') !== 'All') {
            $query->where('year_ended', $request->input('year_ended'));
        }
        $educations = $query->get();

        // ✅ Data mapping
        $data = $educations->map(function ($education) {
            $r = $education->resident;
            $fullName = trim("{$r->firstname} {$r->middlename} {$r->lastname} {$r->suffix}");
            return [
                'Resident ID' => $r->id,
                'Full Name' => $fullName,
                'Purok' => $r->purok_number,
                'School Name' => $education->school_name,
                'School Type' => $education->school_type,
                'Educational Attainment' => $education->educational_attainment,
                'Education Status' => $education->education_status,
                'Year Started' => $education->year_started,
                'Year Ended' => $education->year_ended,
                'Program' => $education->program,
            ];
        });

        $barangay = auth()->user()->barangay()->first();

        // ✅ Generate PDF
        $pdf = Pdf::loadView('bims.education_summary', [
            'educations' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Educational_History_List.pdf');
    }
    public function exportOccupationPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = Occupation::with([
            'resident:id,firstname,lastname,middlename,suffix,purok_number,employment_status,barangay_id'
        ])
        ->select(
            'id',
            'resident_id',
            'occupation',
            'employment_type',
            'work_arrangement',
            'employer',
            'occupation_status',
            'is_ofw',
            'is_main_livelihood',
            'started_at',
            'ended_at'
        )
        ->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id)
            ->where('is_deceased', false);
        });

        // ✅ Latest Occupation Only
        if ($request->filled('latest_occupation') && $request->input('latest_occupation') === '1') {
            $subquery = DB::table('occupations as o1')
                ->select('resident_id', DB::raw('MAX(started_at) as latest_started_at'))
                ->join('residents', 'o1.resident_id', '=', 'residents.id')
                ->where('residents.barangay_id', $brgy_id)
                ->groupBy('resident_id');

            $query = Occupation::from('occupations as o')
                ->joinSub($subquery, 'latest_occupations', function ($join) {
                    $join->on('o.resident_id', '=', 'latest_occupations.resident_id')
                        ->on('o.started_at', '=', 'latest_occupations.latest_started_at');
                })
                ->with([
                    'resident:id,firstname,lastname,middlename,suffix,purok_number,employment_status,barangay_id'
                ])
                ->select(
                    'o.id',
                    'o.resident_id',
                    'o.occupation',
                    'o.employment_type',
                    'o.work_arrangement',
                    'o.employer',
                    'o.occupation_status',
                    'o.is_ofw',
                    'o.is_main_livelihood',
                    'o.started_at',
                    'o.ended_at'
                );
        }

        // ✅ Search Filter
        if ($search = trim($request->input('name', ''))) {
            $terms = preg_split('/\s+/', $search);
            $query->where(function ($q) use ($terms, $search) {
                $q->where('occupation', 'like', "%{$search}%")
                ->orWhereHas('resident', function ($r) use ($terms) {
                    foreach ($terms as $term) {
                        $r->where(function ($r2) use ($term) {
                            $like = "%{$term}%";
                            $r2->where('firstname', 'like', $like)
                                ->orWhere('middlename', 'like', $like)
                                ->orWhere('lastname', 'like', $like)
                                ->orWhere('suffix', 'like', $like);
                        });
                    }
                });
            });
        }

        // ✅ Additional Filters
        if ($request->filled('employment_type') && $request->input('employment_type') !== 'All') {
            $query->where('employment_type', $request->input('employment_type'));
        }

        if ($request->filled('work_arrangement') && $request->input('work_arrangement') !== 'All') {
            $query->where('work_arrangement', $request->input('work_arrangement'));
        }

        if ($request->filled('occupation_status') && $request->input('occupation_status') !== 'All') {
            $query->where('occupation_status', $request->input('occupation_status'));
        }

        if ($request->filled('is_ofw') && $request->input('is_ofw') !== 'All') {
            $query->where('is_ofw', $request->input('is_ofw'));
        }

        if ($request->filled('year_started') && $request->input('year_started') !== 'All') {
            $query->where('started_at', $request->input('year_started'));
        }

        if ($request->filled('year_ended') && $request->input('year_ended') !== 'All') {
            $query->where('ended_at', $request->input('year_ended'));
        }

        if ($request->filled('employment_status') && $request->input('employment_status') !== 'All') {
            $query->whereHas('resident', function ($q) use ($request) {
                $q->where('employment_status', $request->input('employment_status'));
            });
        }

        if ($request->filled('purok') && $request->input('purok') !== 'All') {
            $query->whereHas('resident', function ($q) use ($request) {
                $q->where('purok_number', $request->input('purok'));
            });
        }

        $occupations = $query->get();

        // ✅ Data Mapping
        $data = $occupations->map(function ($occ) {
            $r = $occ->resident;
            $fullName = trim("{$r->firstname} {$r->middlename} {$r->lastname} {$r->suffix}");
            return [
                'Resident ID' => $r->id,
                'Full Name' => $fullName,
                'Purok' => $r->purok_number,
                'Occupation' => $occ->occupation,
                'Employment Type' => $occ->employment_type,
                'Work Arrangement' => $occ->work_arrangement,
                'Employer' => $occ->employer,
                'Occupation Status' => $occ->occupation_status,
                'OFW' => $occ->is_ofw ? 'Yes' : 'No',
                'Main Livelihood' => $occ->is_main_livelihood ? 'Yes' : 'No',
                'Year Started' => $occ->started_at,
                'Year Ended' => $occ->ended_at,
            ];
        });

        $barangay = auth()->user()->barangay()->first();

        // ✅ Generate PDF
        $pdf = Pdf::loadView('bims.occupations_summary', [
            'occupations' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Occupation_List.pdf');
    }
    public function exportMedicalInformationPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = MedicalInformation::with([
            'resident:id,firstname,middlename,lastname,suffix,purok_number,sex,is_pwd,barangay_id',
            'resident.disabilities'
        ])->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id)
            ->where('is_deceased', false);
        });

        // ------------------- FILTERS -------------------
        if ($request->filled('name')) {
            $search = $request->input('name');
            $query->whereHas('resident', function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                ->orWhere('middlename', 'like', "%{$search}%")
                ->orWhere('lastname', 'like', "%{$search}%")
                ->orWhere('suffix', 'like', "%{$search}%")
                ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"])
                ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$search}%"])
                ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$search}%"]);
            });
        }

        if ($request->filled('purok') && $request->input('purok') !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('purok_number', $request->input('purok')));
        }

        if ($request->filled('sex') && $request->input('sex') !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('sex', $request->input('sex')));
        }

        if ($request->filled('is_pwd') && $request->input('is_pwd') !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('is_pwd', $request->input('is_pwd')));
        }

        if ($request->filled('blood_type') && $request->input('blood_type') !== 'All') {
            $query->where('blood_type', $request->input('blood_type'));
        }

        if ($request->filled('nutritional_status') && $request->input('nutritional_status') !== 'All') {
            $query->where('nutrition_status', $request->input('nutritional_status'));
        }

        if ($request->filled('is_smoker') && $request->input('is_smoker') !== 'All') {
            $query->where('is_smoker', $request->input('is_smoker'));
        }

        if ($request->filled('alcohol_user') && $request->input('alcohol_user') !== 'All') {
            $query->where('is_alcohol_user', $request->input('alcohol_user'));
        }

        if ($request->filled('has_philhealth') && $request->input('has_philhealth') !== 'All') {
            $query->where('has_philhealth', $request->input('has_philhealth'));
        }

        $medicalRecords = $query->get();

        // ------------------- Data Mapping -------------------
        $data = $medicalRecords->map(function ($record) {
            $r = $record->resident;
            $fullName = trim("{$r->firstname} {$r->middlename} {$r->lastname} {$r->suffix}");
            return [
                'Resident Name' => $fullName,
                'Weight (kg)' => $record->weight_kg ?? 'N/A',
                'Height (cm)' => $record->height_cm ?? 'N/A',
                'Sex' => ucfirst($r->sex ?? 'N/A'),
                'Nutritional Status' => $record->nutrition_status ?? 'N/A',
                'Blood Type' => $record->blood_type ?? 'N/A',
                'Emergency Contact Number' => $record->emergency_contact_number ?? 'N/A', // ✅ from medical_information
                'Is PWD?' => $r->is_pwd ? 'Yes' : 'No',
                'Purok Number' => $r->purok_number ?? 'N/A',
            ];
        });

        // ------------------- Summary Computation -------------------
        $summary = [
            'male' => $medicalRecords->filter(fn($m) => optional($m->resident)->sex === 'male')->count(),
            'female' => $medicalRecords->filter(fn($m) => optional($m->resident)->sex === 'female')->count(),
            'pwd' => $medicalRecords->filter(fn($m) => optional($m->resident)->is_pwd)->count(),
            'philhealth' => $medicalRecords->filter(fn($m) => $m->has_philhealth)->count(),
        ];

        $barangay = auth()->user()->barangay()->first();

        // ------------------- Generate PDF -------------------
        $pdf = Pdf::loadView('bims.medical_info_summary', [
            'medicalRecords' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'summary' => $summary,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Medical_Information_List.pdf');
    }
    public function exportCertificatesPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = Certificate::where('barangay_id', $brgy_id)
            ->with([
                'resident:id,firstname,middlename,lastname,suffix,purok_number',
                'document:id,name',
                'issuedBy:id,position'
            ])
            ->select('id', 'resident_id', 'document_id', 'barangay_id', 'request_status', 'purpose', 'issued_at', 'issued_by', 'docx_path', 'pdf_path', 'control_number');

        // ------------------- FILTERS -------------------
        if ($request->filled('certificate_type') && $request->certificate_type !== 'All') {
            $type = $request->certificate_type;
            $query->whereHas('document', fn($q) => $q->where('name', $type));
        }

        if ($request->filled('request_status') && $request->request_status !== 'All') {
            $query->where('request_status', $request->request_status);
        }

        if ($request->filled('issued_by') && $request->issued_by !== 'All') {
            $query->where('issued_by', $request->issued_by);
        }

        if ($request->filled('issued_at')) {
            try {
                $date = \Carbon\Carbon::parse($request->issued_at)->toDateString();
                $query->whereDate('issued_at', $date);
            } catch (\Exception $e) {
                // Ignore invalid date
            }
        }

        if ($request->filled('name')) {
            $search = trim($request->name);
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($r) use ($search) {
                    $r->where(fn($rr) =>
                        $rr->where('firstname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('suffix', 'like', "%{$search}%")
                    );
                })
                ->orWhere('purpose', 'like', "%{$search}%")
                ->orWhereHas('document', fn($d) => $d->where('name', 'like', "%{$search}%"));
            });
        }

        $certificates = $query->get();

        // ------------------- Data Mapping -------------------
        $data = $certificates->map(function ($cert) {
            $r = $cert->resident;
            $fullName = trim("{$r->firstname} {$r->middlename} {$r->lastname} {$r->suffix}");
            return [
                'Full Name' => $fullName,
                'Purok' => $r->purok_number ?? 'N/A',
                'Certificate Type' => $cert->document->name ?? 'N/A',
                'Purpose' => $cert->purpose ?? 'N/A',
                'Request Status' => $cert->request_status ?? 'N/A',
                'Issued By' => $cert->issuedBy->position ?? 'N/A',
                'Issued At' => $cert->issued_at ? $cert->issued_at->format('F d, Y') : 'N/A',
            ];
        });

        $barangay = auth()->user()->barangay()->first();

        // ------------------- Summary -------------------
        $summary = [
            'total_residents' => $certificates->pluck('resident_id')->unique()->count(),
            'pending' => $certificates->where('request_status', 'Pending')->count(),
            'approved' => $certificates->where('request_status', 'Approved')->count(),
            'rejected' => $certificates->where('request_status', 'Rejected')->count(),
        ];

        // ------------------- Generate PDF -------------------
        $pdf = Pdf::loadView('bims.certificates_summary', [
            'certificates' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
            'summary' => $summary
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Certificates_List.pdf');
    }
    public function exportBlotterReportsPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        // ------------------- Base Query -------------------
        $query = BlotterReport::with([
                'complainants.resident:id,firstname,middlename,lastname,suffix',
                'recordedBy.resident:id,firstname,middlename,lastname,suffix',
                'participants.resident:id,firstname,middlename,lastname,suffix'
            ])
            ->where('barangay_id', $brgy_id)
            ->latest();

        // ------------------- Filters -------------------
        if ($name = trim($request->input('name'))) {
            $query->whereHas('participants', function ($q) use ($name) {
                $q->whereHas('resident', function ($qr) use ($name) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?",
                        ["%{$name}%"]
                    )->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$name}%"]
                    );
                })
                ->orWhere('name', 'like', "%{$name}%"); // manually added participants
            });
        }

        if ($incidentType = $request->input('incident_type')) {
            if ($incidentType !== 'All') $query->where('type_of_incident', $incidentType);
        }

        if ($reportType = $request->input('report_type')) {
            if ($reportType !== 'All') $query->where('report_type', $reportType);
        }

        if ($incidentDate = $request->input('incident_date')) {
            $query->whereDate('incident_date', $incidentDate);
        }

        // ------------------- Fetch Data -------------------
        $blotters = $query->get();

        // ------------------- Map Data -------------------
        $data = $blotters->map(function ($report, $index) {

            // Format recorded by directly
            $recordedBy = $report->recordedBy
                ? trim("{$report->recordedBy->resident->firstname} {$report->recordedBy->resident->middlename} {$report->recordedBy->resident->lastname} {$report->recordedBy->resident->suffix}")
                : 'N/A';

            $incidentDate = $report->incident_date;
            if ($incidentDate) {
                try {
                    $incidentDate = \Carbon\Carbon::parse($incidentDate)->format('F d, Y');
                } catch (\Exception $e) {
                    // fallback to string if parse fails
                }
            }

            return [
                'No' => $index + 1,
                'Report ID' => $report->id,
                'Incident Type' => $report->type_of_incident ?? 'N/A',
                'Incident Date' => $incidentDate ?? 'N/A',
                'Complainants' => $report->participants
                    ->where('role_type', 'complainant')
                    ->map(fn($p) => $p->resident
                        ? trim("{$p->resident->firstname} {$p->resident->middlename} {$p->resident->lastname} {$p->resident->suffix}")
                        : $p->name)
                    ->filter()
                    ->join(', ') ?: 'N/A',
                'Recorded By' => $recordedBy,
                'Status' => $report->report_status ?? 'N/A',
                'Remarks' => $report->resolution ?? '-',
            ];
        });
        $barangay = auth()->user()->barangay()->first();

        // ------------------- Generate PDF -------------------
        $pdf = Pdf::loadView('bims.blotter_summary', [
            'blotters' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Blotter_Reports_List.pdf');
    }
    public function exportSummonsPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        // ------------------- Base Query -------------------
        $query = Summon::with([
            'blotter:id,type_of_incident,incident_date',
            'blotter.complainants.resident:id,firstname,middlename,lastname,suffix',
            'issuedBy:id,resident_id,position',
            'issuedBy.resident:id,firstname,middlename,lastname,suffix',
            'latestTake' => fn($q) => $q->select(
                'summon_takes.id',
                'summon_takes.summon_id',
                'summon_takes.session_number',
                'summon_takes.hearing_date',
                'summon_takes.session_status',
                'summon_takes.session_remarks'
            ),
        ])->select('id', 'blotter_id', 'status', 'remarks', 'issued_by')
        ->whereHas('blotter', fn($q) => $q->where('barangay_id', $brgy_id));

        // ------------------- Filters -------------------
        if ($request->filled('summon_status') && $request->summon_status !== 'All') {
            $query->where('status', $request->summon_status);
        }

        if ($request->filled('hearing_number') && $request->hearing_number !== 'All') {
            $query->whereHas('latestTake', fn($q) => $q->where('session_number', $request->hearing_number));
        }

        if ($request->filled('hearing_status') && $request->hearing_status !== 'All') {
            $query->whereHas('latestTake', fn($q) => $q->where('session_status', $request->hearing_status));
        }

        if ($request->filled('incident_type') && $request->incident_type !== 'All') {
            $query->whereHas('blotter', fn($q) => $q->where('type_of_incident', $request->incident_type));
        }

        if ($request->filled('incident_date')) {
            $query->whereHas('blotter', fn($q) => $q->whereDate('incident_date', $request->incident_date));
        }

        if ($request->filled('name')) {
            $search = $request->name;
            $query->whereHas('blotter.participants', function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', IFNULL(suffix, '')) LIKE ?",
                        ["%{$search}%"]
                    )->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$search}%"]
                    );
                })->orWhere('name', 'like', "%{$search}%");
            });
        }

        // ------------------- Fetch Data -------------------
        $summons = $query->latest()->get();

        // ------------------- Map Data -------------------
        $data = $summons->map(function ($summon, $index) {
            $blotter = $summon->blotter;

            // Complainants
            $complainants = $blotter?->complainants
                ->map(fn($p) => $p->resident
                    ? trim("{$p->resident->firstname} {$p->resident->middlename} {$p->resident->lastname} {$p->resident->suffix}")
                    : $p->name)
                ->filter()
                ->join(', ') ?: 'N/A';

            // Issued by
            $issuedBy = $summon->issuedBy
                ? trim("{$summon->issuedBy->resident->firstname} {$summon->issuedBy->resident->middlename} {$summon->issuedBy->resident->lastname} {$summon->issuedBy->resident->suffix}")
                : 'N/A';

            // Latest hearing — directly use the relation
            $latestTake = $summon->latestTake; // remove ->first()
            $hearingDate = $latestTake?->hearing_date
                ? \Carbon\Carbon::parse($latestTake->hearing_date)->format('F d, Y')
                : 'N/A';
            $hearingNumber = $latestTake?->session_number ?? 'N/A';
            $hearingStatus = $latestTake?->session_status ?? 'N/A';
            $hearingRemarks = $latestTake?->session_remarks ?? '-';

            return [
                'No' => $index + 1,
                'Summon ID' => $summon->id,
                'Blotter ID' => $blotter->id ?? 'N/A',
                'Incident Type' => $blotter->type_of_incident ?? 'N/A',
                'Complainants' => $complainants,
                'Issued By' => $issuedBy,
                'Summon Status' => $summon->status ?? 'N/A',
                'Hearing Number' => $hearingNumber,
                'Hearing Date' => $hearingDate,
                'Hearing Status' => $hearingStatus,
                'Hearing Remarks' => $hearingRemarks,
            ];
        });

        $barangay = auth()->user()->barangay()->first();

        // ------------------- Generate PDF -------------------
        $pdf = Pdf::loadView('bims.summons_summary', [
            'summons' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Summons_Reports_List.pdf');
    }

    // OTHER MEDICAL INFO
    public function exportAllergyPdf(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;
        $filters = $request->all();

        // Base query: only select necessary columns
        $query = Allergy::select('id', 'resident_id', 'allergy_name', 'reaction_description')
            ->with([
                'resident:id,firstname,middlename,lastname,suffix,purok_number,sex,birthdate',
            ])
            ->whereHas('resident', function ($q) use ($brgy_id, $filters) {
                $q->where('barangay_id', $brgy_id)
                ->where('is_deceased', false);

                if (!empty($filters['purok']) && $filters['purok'] !== 'All') {
                    $q->where('purok_number', $filters['purok']);
                }

                if (!empty($filters['sex']) && $filters['sex'] !== 'All') {
                    $q->where('sex', $filters['sex']);
                }

                if (!empty($filters['age_group']) && $filters['age_group'] !== 'All') {
                    $today = now();
                    switch ($filters['age_group']) {
                        case '0_6_months':
                            $q->whereBetween('birthdate', [$today->copy()->subMonths(6), $today]);
                            break;
                        case '7mos_2yrs':
                            $q->whereBetween('birthdate', [$today->copy()->subYears(2), $today->copy()->subMonths(7)]);
                            break;
                        case '3_5yrs':
                            $q->whereBetween('birthdate', [$today->copy()->subYears(5), $today->copy()->subYears(3)]);
                            break;
                        case '6_12yrs':
                            $q->whereBetween('birthdate', [$today->copy()->subYears(12), $today->copy()->subYears(6)]);
                            break;
                        case '13_17yrs':
                            $q->whereBetween('birthdate', [$today->copy()->subYears(17), $today->copy()->subYears(13)]);
                            break;
                        case '18_59yrs':
                            $q->whereBetween('birthdate', [$today->copy()->subYears(59), $today->copy()->subYears(18)]);
                            break;
                        case '60_above':
                            $q->where('birthdate', '<=', $today->copy()->subYears(60));
                            break;
                    }
                }
            });

        if (!empty($filters['allergy'])) {
            $query->where(function($q) use ($filters) {
                $q->where('allergy_name', 'like', '%' . $filters['allergy'] . '%')
                ->orWhere('reaction_description', 'like', '%' . $filters['allergy'] . '%');
            });
        }

        if ($name = trim($request->input('name'))) {
            $like = "%{$name}%";
            $query->where(function ($q) use ($like) {
                $q->whereHas('resident', fn($sub) => $sub->whereRaw(
                    "CONCAT_WS(' ', firstname, middlename, lastname, suffix) LIKE ?", [$like]
                ));
            });
        }

        // Fetch all allergies
        $allergies = $query->get();

        // Group by resident
        $grouped = $allergies->groupBy('resident_id');

        // Map for PDF
        $data = $grouped->values()->map(function ($group, $index) {
            $resident = $group->first()->resident;
            $allergyNames = $group->pluck('allergy_name')->filter()->unique()->implode(', ');
            $descriptions = $group->pluck('reaction_description')->filter()->unique()->implode('; ');

            return [
                'No' => $index + 1,
                'Resident Name' => trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}"),
                'Age' => $resident->age ?? 'N/A',
                'Sex' => ucfirst($resident->sex ?? 'N/A'),
                'Allergy Name' => $allergyNames ?: 'N/A',
                'Description' => $descriptions ?: 'N/A',
                'Purok Number' => $resident->purok_number ?? 'N/A',
            ];
        });

        $barangay = auth()->user()->barangay()->first();

        $pdf = Pdf::loadView('bims.allergy_summary', [
            'allergies' => $data,
            'barangayName' => $barangay->barangay_name ?? 'Barangay',
            'barangayLogo' => $barangay->logo_path ?? null,
            'total' => $data->count(),
            'generatedAt' => now('Asia/Manila')->format('F d, Y h:i A'),
        ])->setPaper('legal', 'landscape');

        return $pdf->stream('Allergy_Information_List.pdf');
    }


}

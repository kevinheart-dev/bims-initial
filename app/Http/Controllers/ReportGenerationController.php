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

        return $pdf->stream('Population_Exposure_Summary_'.$hazardName.'_'.$cra->year.'.pdf');
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

}

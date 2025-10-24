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
}

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
use App\Exports\SeniorCitizenExport;
use App\Exports\SummonExport;
use App\Exports\VehicleExport;
use App\Models\Barangay;
use App\Models\Resident;
use Illuminate\Http\Request;
use App\Exports\ResidentsExport;
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
        dd('Under development');
    }

    private function setfilename($name){
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
}

<?php

namespace App\Http\Controllers;

use App\Exports\FamilyExport;
use App\Exports\FamilyMembersExport;
use App\Exports\SeniorCitizenExport;
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
}

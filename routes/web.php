<?php

use App\Exports\ResidentsExport;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\BarangayInfrastructureController;
use App\Http\Controllers\BarangayFacilityController;
use App\Http\Controllers\BarangayInstitutionController;
use App\Http\Controllers\BarangayOfficialController;
use App\Http\Controllers\BarangayProfileController;
use App\Http\Controllers\BarangayProjectController;
use App\Http\Controllers\BarangayRoadController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\CaseParticipantController;
use App\Http\Controllers\CDRRMOAdminController;
use App\Http\Controllers\CDRRMOSuperAdminController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ChildHealthMonitoringController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\CRAController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeathController;
use App\Http\Controllers\DisabilityController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentGenerationController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\FamilyRelationController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\InstitutionMemberController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\LivelihoodController;
use App\Http\Controllers\MedicalInformationController;
use App\Http\Controllers\OccupationController;
use App\Http\Controllers\PregnancyRecordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportGenerationController;
use App\Http\Controllers\ResidentAccountController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\ResidentMedicalConditionController;
use App\Http\Controllers\ResidentMedicationController;
use App\Http\Controllers\ResidentVaccinationController;
use App\Http\Controllers\SeniorCitizenController;
use App\Http\Controllers\SummonController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Models\BarangayInfrastructure;
use App\Models\BarangayInstitution;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

// Admin-only routes
Route::middleware(['auth', 'role:barangay_officer|cdrrmo_admin'])->group(function () {
    Route::get('/document/fill/{resident}/{template}', [DocumentGenerationController::class, 'generateFilledDocument'])
        ->name('document.fill');

    // axios documents
    Route::get('/document/preview/{id}', [DocumentController::class, 'preview'])->name('document.preview');
    Route::get('/document/fetchdocuments', [DocumentController::class, 'fetchDocuments'])->name('document.fetchdocs');
    Route::get('/document/fetchdocumentpath/{id}', [DocumentController::class, 'fetchDocumentPath'])->name('document.documentpath');
    Route::get('/document/fetchplaceholders/{id}', [DocumentController::class, 'fetchPlaceholders'])->name('document.placeholders');

    Route::get('certificate/{id}/download', [CertificateController::class, 'download'])->name('certificate.download');
    Route::get('certificate/{id}/print', [CertificateController::class, 'print'])->name('certificate.print');
    Route::get('certificate/index', [CertificateController::class, 'index'])->name('certificate.index');
    Route::post('certificate/store', [CertificateController::class, 'storeFromPost'])->name('certificate.store');
    Route::get('certificate/export-certificates-excel', [ReportGenerationController::class, 'exportCertificates'])
        ->name('certificate.export');
    Route::post('/certificate/issue/{id}', [CertificateController::class, 'issue'])
        ->name('certificate.issue');

    // family
    Route::get('familytree/{resident}', [ResidentController::class, 'getFamilyTree'])->name('resident.familytree');
    Route::get('family/showfamily/{family}', [FamilyController::class, 'showFamily'])->name('family.showfamily');
    Route::get('family/getfamilydetails/{id}', [FamilyController::class, 'getFamilyDetails'])->name('family.getdetails');
    Route::get('family/remove/{id}', [FamilyController::class, 'remove'])->name('family.remove');
    Route::get('/family/residents-members', [FamilyController::class, 'getResidentsAndMembersJson'])
    ->name('family.residents-members');

    // resident
    Route::get('resident/createresident', [ResidentController::class, 'createResident'])->name('resident.createresident');
    Route::post('resident/storehousehold', [ResidentController::class, 'storeHousehold'])->name('resident.storehousehold');
    Route::get('resident/showresident/{id}', [ResidentController::class, 'showResident'])->name('resident.showresident');
    Route::get('resident/fetchresidents', [ResidentController::class, 'fetchResidents'])->name('resident.fetchresidents');
    Route::get('resident/chartdata', [ResidentController::class, 'chartData'])->name('resident.chartdata');

    // barangay
    Route::get('barangay_profile/barangaydetails', [BarangayProfileController::class, 'barangayDetails'])->name('barangay_profile.details');
    Route::get('barangay_official/officialsinfo/{id}', [BarangayOfficialController::class, 'getOfficialInformation'])->name('barangay_official.info');
    Route::get('barangay_infrastructure/details/{id}', [BarangayInfrastructureController::class, 'infrastructureDetails'])->name('barangay_infrastructure.details');
    Route::get('barangay_institution/details/{id}', [BarangayInstitutionController::class, 'institutionDetails'])->name('barangay_institution.details');
    Route::get('barangay_facility/details/{id}', [BarangayFacilityController::class, 'facilityDetails'])->name('barangay_facility.details');
    Route::get('barangay_project/details/{id}', [BarangayProjectController::class, 'projectDetails'])->name('barangay_project.details');
    Route::get('barangay_road/details/{id}', [BarangayRoadController::class, 'roadDetails'])->name('barangay_road.details');
    Route::get('inventory/details/{id}', [InventoryController::class, 'itemDetails'])->name('inventory.details');
    Route::get('institution_member/details/{id}', [InstitutionMemberController::class, 'memberDetails'])->name('institution_member.details');

    // household
    Route::get('household/getlatesthead/{id}', [HouseholdController::class, 'getLatestHead'])->name('household.latesthead');
    Route::get('household/remove/{id}', [HouseholdController::class, 'remove'])->name('household.remove');


    // senior
    Route::get('senior_citizen/seniordetails/{id}', [SeniorCitizenController::class, 'seniordetails'])->name('senior_citizen.details');

    // education
    Route::get('education/history/{id}', [EducationController::class, 'educationHistory'])->name('education.history');

    // occupation
    Route::get('occupation/details/{id}', [OccupationController::class, 'occupationDetails'])->name('occupation.details');

    // livelihood
    Route::get('livelihood/details/{id}', [LivelihoodController::class, 'livelihoodDetails'])->name('livelihood.details');

    // vehicle
    Route::get('vehicle/details/{id}', [VehicleController::class, 'vehicleDetails'])->name('vehicle.details');

    // user
    Route::post('user/confirmpassword', [UserController::class, 'confirmPassword'])->name('user.confirm');
    Route::get('/user/{id}', [UserController::class, 'accountDetails'])->name('user.details');

    // reports
    Route::get('report', [ReportGenerationController::class, 'index'])->name('report.index');
    Route::get('report/export-residents-excel', [ReportGenerationController::class, 'exportResidentWithFilters'])
        ->name('report.resident');
    Route::get('report/export-seniorcitizen-excel', [ReportGenerationController::class, 'exportSeniorWithFilters'])
        ->name('report.seniorcitizen');
    Route::get('report/export-family-excel', [ReportGenerationController::class, 'exportFamily'])
        ->name('report.family');
    Route::get('report/export-familymembers-excel', [ReportGenerationController::class, 'exportFamilyMembers'])
        ->name('report.familymembers');
    Route::get('report/export-household-excel', [ReportGenerationController::class, 'exportHousehold'])
        ->name('report.household');
    Route::get('report/export-householdmembers-excel', [ReportGenerationController::class, 'exportHouseholdMembers'])
        ->name('report.householdmembers');
    Route::get('report/export-vehicles-excel', [ReportGenerationController::class, 'exportVehicles'])
        ->name('report.vehicles');
    Route::get('report/export-education-excel', [ReportGenerationController::class, 'exportEducations'])
        ->name('report.education');
    Route::get('report/export-occupations-excel', [ReportGenerationController::class, 'exportOccupations'])
        ->name('report.occupations');
    Route::get('report/export-blotter-reports-excel', [ReportGenerationController::class, 'exportBlotterReports'])
        ->name('report.blotter');
    Route::get('report/export-summon-excel', [ReportGenerationController::class, 'exportSummon'])
        ->name('report.summon');
    Route::get('report/export-medical-excel', [ReportGenerationController::class, 'exportMedical'])
        ->name('report.medical');

    // pregnancy
    Route::get('pregnancy/details/{id}', [PregnancyRecordController::class, 'pregnancyDetails'])->name('pregnancy.details');

    // cra
    Route::get('cra/index', [CRAController::class, 'index'])->name('cra.index');
    Route::get('cra/create', [CRAController::class, 'create'])->name('cra.create');
    Route::get('cra/dashboard', [CRAController::class, 'dashboard'])->name('cra.dashboard');
    Route::get('cra/datacollection', [CRAController::class, 'brgyDataCollection'])->name('cra.datacollection');
    Route::post('cra/store', [CRAController::class, 'store'])->name('cra.store');

    // death
    Route::get('death/index', [DeathController::class, 'index'])->name('death.index');
    Route::get('death/details/{id}', [DeathController::class, 'deathDetails'])->name('death.details');
    Route::post('death/store', [DeathController::class, 'store'])->name('death.store');
    Route::put('death/update/{id}', [DeathController::class, 'update'])->name('death.update');
    Route::delete('death/destroy/{id}', [DeathController::class, 'destroy'])->name('death.destroy');

    Route::post('/check-email-unique', function (Request $request) {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json(['unique' => !$exists]);
    });
    Route::patch('/user/{user}/toggle-account', [UserController::class, 'toggleAccount'])
    ->name('user.toggle');

    // residents
    Route::resource('user', UserController::class);
    Route::resource('resident', ResidentController::class);
    Route::resource('document', DocumentController::class);
    Route::resource('household', HouseholdController::class);
    Route::resource('senior_citizen', SeniorCitizenController::class);
    Route::resource('family_relation', FamilyRelationController::class);
    Route::resource('family', FamilyController::class);
    Route::resource('vehicle', VehicleController::class);
    Route::resource('education', EducationController::class);
    Route::resource('occupation', OccupationController::class);
    Route::resource('medical', MedicalInformationController::class);
    Route::resource('livelihood', LivelihoodController::class);
    Route::resource('medical_condition', ResidentMedicalConditionController::class);
    Route::resource('medication', ResidentMedicationController::class);
    Route::resource('vaccination', ResidentVaccinationController::class);
    Route::resource('disability', DisabilityController::class);
    Route::resource('allergy', AllergyController::class);
    Route::resource('pregnancy', PregnancyRecordController::class);
    Route::resource('child_record', ChildHealthMonitoringController::class);

    // Katarungnang Pambarangay
    Route::get('summon/elevate/{id}', [SummonController::class, 'elevate'])->name('summon.elevate');
    Route::get('blotter_report/generateform/{id}', [BlotterController::class, 'generateForm'])->name('blotter_report.generateForm');
    Route::get('summon/generateform/{id}', [SummonController::class, 'generateForm'])->name('summon.generateForm');
    Route::resource('blotter_report', BlotterController::class);
    Route::resource('case_participant', CaseParticipantController::class);
    Route::resource('summon', SummonController::class);

    // barangay
    Route::resource('barangay_official', BarangayOfficialController::class);
    Route::resource('barangay_profile', BarangayProfileController::class);
    Route::resource('barangay_project', BarangayProjectController::class);
    Route::resource('barangay_infrastructure', BarangayInfrastructureController::class);
    Route::resource('barangay_facility', BarangayFacilityController::class);
    Route::resource('barangay_road', BarangayRoadController::class);
    Route::resource('barangay_institution', BarangayInstitutionController::class);
    Route::resource('inventory', InventoryController::class);
    Route::resource('institution_member', InstitutionMemberController::class);
});
Route::middleware(['auth', 'role:barangay_officer'])->group(function () {
    Route::get('barangay_officer/dashboard', [DashboardController::class, 'dashboard'])->name('barangay_officer.dashboard');
});

Route::middleware(['auth', 'role:cdrrmo_admin'])->prefix('cdrrmo_admin')->group(function () {
    Route::get('dashboard', [CDRRMOAdminController::class, 'index'])
        ->name('cdrrmo_admin.dashboard');
        Route::get('alldatacollection', [CDRRMOAdminController::class, 'allDataCollectionSummary'])
        ->name('cdrrmo_admin.datacollection');
});



// Resident-only routes
Route::middleware(['auth', 'role:resident'])->group(function () {
    Route::get('/dashboard', [ResidentAccountController::class, 'dashboard'])->name('resident_account.dashboard');
    Route::get('/certificates', [ResidentAccountController::class, 'residentCertificates'])->name('resident_account.certificates');
    Route::resource('resident_account', ResidentAccountController::class);
    Route::get('/document/fetchplaceholders/{id}', [DocumentController::class, 'fetchPlaceholders'])
    ->name('resident.document.placeholders');
    Route::post('/certificate-request', [ResidentAccountController::class, 'requestCertificate'])
    ->name('resident.certificate.store');
});

// Routes accessible to both resident and admin users (verified users)
Route::middleware(['auth', 'verified', 'role:resident|barangay_officer'])->group(function () {
    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome'); // Welcome page accessible to both admin and resident

require __DIR__ . '/auth.php';

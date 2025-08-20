<?php

use App\Http\Controllers\BarangayInfrastructureController;
use App\Http\Controllers\BarangayFacilityController;
use App\Http\Controllers\BarangayInstitutionController;
use App\Http\Controllers\BarangayOfficialController;
use App\Http\Controllers\BarangayProfileController;
use App\Http\Controllers\BarangayProjectController;
use App\Http\Controllers\BarangayRoadController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentGenerationController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\FamilyRelationController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\MedicalInformationController;
use App\Http\Controllers\OccupationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportGenerationController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\SeniorCitizenController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Models\BarangayInfrastructure;
use App\Models\BarangayInstitution;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin-only routes
Route::middleware(['auth', 'role:barangay_officer'])->prefix('barangay_officer')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('barangay_officer.dashboard');

    Route::get('/document/fill/{resident}/{template}', [DocumentGenerationController::class, 'generateFilledDocument'])
        ->name('document.fill');

    // axios documents
    Route::get('/document/preview/{id}', [DocumentController::class, 'preview'])->name('document.preview');
    Route::get('/document/fetchdocuments', [DocumentController::class, 'fetchDocuments'])->name('document.fetchdocs');
    Route::get('/document/fetchdocumentpath/{id}', [DocumentController::class, 'fetchDocumentPath'])->name('document.documentpath');
    Route::get('/document/fetchplaceholders/{id}', [DocumentController::class, 'fetchPlaceholders'])->name('document.placeholders');

    Route::get('/certificate/{id}/download', [CertificateController::class, 'download'])->name('certificate.download');
    Route::get('/certificate/{id}/print', [CertificateController::class, 'print'])->name('certificate.print');
    Route::get('/certificate/index', [CertificateController::class, 'index'])->name('certificate.index');
    Route::post('/certificate/store', [CertificateController::class, 'storeFromPost'])->name('certificate.store');


    // family
    Route::get('familytree/{resident}', [ResidentController::class, 'getFamilyTree'])->name('resident.familytree');
    Route::get('family/showfamily/{family}', [FamilyController::class, 'showFamily'])->name('family.showfamily');
    Route::get('family/getfamilydetails/{id}', [FamilyController::class, 'getFamilyDetails'])->name('family.getdetails');
    Route::get('family/remove/{id}', [FamilyController::class, 'remove'])->name('family.remove');

    // resident
    Route::get('resident/createresident', [ResidentController::class, 'createResident'])->name('resident.createresident');
    Route::post('resident/storehousehold', [ResidentController::class, 'storeHousehold'])->name('resident.storehousehold');
    Route::get('resident/showresident/{id}', [ResidentController::class, 'showResident'])->name('resident.showresident');
    Route::get('resident/fetchresidents', [ResidentController::class, 'fetchResidents'])->name('resident.fetchresidents');
    Route::get('resident/chartdata', [ResidentController::class, 'chartData'])->name('resident.chartdata');

    // barangay
    Route::get('barangay_profile/barangaydetails', [BarangayProfileController::class, 'barangayDetails'])->name('barangay.details');
    Route::get('barangay_official/officialsinfo/{id}', [BarangayOfficialController::class, 'getOfficialInformation'])->name('barangay.officialinfo');

    // household
    Route::get('household/getlatesthead/{id}', [HouseholdController::class, 'getLatestHead'])->name('household.latesthead');
    Route::get('household/remove/{id}', [HouseholdController::class, 'remove'])->name('household.remove');


    // senior
    Route::get('senior_citizen/seniordetails/{id}', [SeniorCitizenController::class, 'seniordetails'])->name('senior_citizen.details');

    // education
    Route::get('education/history/{id}', [EducationController::class, 'educationHistory'])->name('education.history');

    // occupation
    Route::get('occupation/details/{id}', [OccupationController::class, 'occupationDetails'])->name('occupation.details');

    // vehicle
    Route::get('vehicle/details/{id}', [VehicleController::class, 'vehicleDetails'])->name('vehicle.details');

    // user
    Route::post('user/confirmpassword', [UserController::class, 'confirmPassword'])->name('user.confirm');

    // reports
    Route::get('report', [ReportGenerationController::class, 'index'])->name('report.index');

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

    // barangay
    Route::resource('barangay_official', BarangayOfficialController::class);
    Route::resource('barangay_profile', BarangayProfileController::class);
    Route::resource('barangay_project', BarangayProjectController::class);
    Route::resource('barangay_infrastructure', BarangayInfrastructureController::class);
    Route::resource('barangay_facility', BarangayFacilityController::class);
    Route::resource('barangay_road', BarangayRoadController::class);
    Route::resource('barangay_institution', BarangayInstitutionController::class);

});

// Resident-only routes
Route::middleware(['auth', 'role:resident'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
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

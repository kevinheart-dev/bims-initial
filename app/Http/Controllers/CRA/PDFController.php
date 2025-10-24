<?php

namespace App\Http\Controllers\CRA;

use App\Http\Controllers\Controller;
use App\Models\CommunityRiskAssessment;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\CRAPopulationGender;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    /**
     * Generate and download CRA PDF for a specific record
     *
     * @param int $craId
     * @return \Illuminate\Http\Response
     */
    public function download($craId)
    {
        // 1️⃣ Fetch the CRA record and eager load all related data
        $cra = CommunityRiskAssessment::with([
            'barangay',
            'populationAgeGroups',
            'generalPopulation',
            'populationGender',
            'houseBuild',
            'houseOwnership',
            'primaryLivelihood',
            'houseService',
            'infraFacility',
            'primaryFacility',
            'publicTransportation',
            'roadNetwork',
            'institutionInventory',
            'humanResources',


            'populationImpact',
            'effectImpact',
            'disasterDamage',
            'agriDamage',
            'lifelines',
            'disasterOccurance',

            'hazardRisk'
        ])->where('year', $craId)->first();


        // 2️⃣ Normalize populationGender by gender (lowercase keys)
        $populationGender = $cra->populationGender->keyBy(function ($item) {
            return strtolower($item->gender);
        });

        // 3️⃣ Pass the normalized data to the Blade view
        $pdf = Pdf::loadView('cra.pdf', [
            'cra' => $cra,
            'populationGender' => $populationGender,
        ]);

        // Optional: set paper size and orientation
        $pdf->setPaper('A4', 'portrait');

        // $disasters = $cra->disasterOccurance;
        // dd($disasters);

        // 4️⃣ Return the PDF as download
        return $pdf->download("CRA_{$cra->year}.pdf");
    }
}

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
        // get it by barangay being log in
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

            'hazardRisk',
            'assessmentMatrix',
            'populationExposure',
            'disabilityStatistic',
            'familyatRisk',
        ])->where('year', $craId)->first();


        $populationGender = $cra->populationGender->keyBy(function ($item) {
            return strtolower($item->gender);
        });

        $pdf = Pdf::loadView('cra.pdf', [
            'cra' => $cra,
            'populationGender' => $populationGender,
        ]);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("CRA_{$cra->year}.pdf");
    }
}

<?php

namespace App\Http\Controllers\CRA;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
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
    public function download($year)
    {
        $barangayId = auth()->user()->barangay_id; // or passed $brgy_id

        $cra = CommunityRiskAssessment::with([
            'progress' => function ($q) use ($barangayId) {
                $q->where('barangay_id', $barangayId)
                    ->with('barangay'); // load the barangay details
            },
            'populationAgeGroups' => fn($q) => $q->where('barangay_id', $barangayId),
            'generalPopulation'   => fn($q) => $q->where('barangay_id', $barangayId),
            'populationGender'    => fn($q) => $q->where('barangay_id', $barangayId),
            'houseBuild'          => fn($q) => $q->where('barangay_id', $barangayId),
            'houseOwnership'      => fn($q) => $q->where('barangay_id', $barangayId),
            'primaryLivelihood'   => fn($q) => $q->where('barangay_id', $barangayId),
            'houseService'        => fn($q) => $q->where('barangay_id', $barangayId),
            'infraFacility'       => fn($q) => $q->where('barangay_id', $barangayId),
            'primaryFacility'     => fn($q) => $q->where('barangay_id', $barangayId),
            'publicTransportation' => fn($q) => $q->where('barangay_id', $barangayId),
            'roadNetwork'         => fn($q) => $q->where('barangay_id', $barangayId),
            'institutionInventory' => fn($q) => $q->where('barangay_id', $barangayId),
            'humanResources'      => fn($q) => $q->where('barangay_id', $barangayId),
            'populationImpact'    => fn($q) => $q->where('barangay_id', $barangayId),
            'effectImpact'        => fn($q) => $q->where('barangay_id', $barangayId),
            'disasterDamage'      => fn($q) => $q->where('barangay_id', $barangayId),
            'agriDamage'          => fn($q) => $q->where('barangay_id', $barangayId),
            'lifelines'           => fn($q) => $q->where('barangay_id', $barangayId),
            'disasterOccurance'   => fn($q) => $q->where('barangay_id', $barangayId),
            'hazardRisk'          => fn($q) => $q->where('barangay_id', $barangayId),
            'assessmentMatrix'    => fn($q) => $q->where('barangay_id', $barangayId),
            'populationExposure'  => fn($q) => $q->where('barangay_id', $barangayId),
            'disabilityStatistic' => fn($q) => $q->where('barangay_id', $barangayId),
            'illnessesStat'       => fn($q) => $q->where('barangay_id', $barangayId),
            'riskPopulation'      => fn($q) => $q->where('barangay_id', $barangayId),
            'disasterInventory'   => fn($q) => $q->where('barangay_id', $barangayId),
            'evacuationCenter'    => fn($q) => $q->where('barangay_id', $barangayId),
            'evacuationInventory' => fn($q) => $q->where('barangay_id', $barangayId),
            'affectedArea'        => fn($q) => $q->where('barangay_id', $barangayId),
            'livelihoodEvacuation' => fn($q) => $q->where('barangay_id', $barangayId),
            'prepositionedInventory' => fn($q) => $q->where('barangay_id', $barangayId),
            'reliefDistribution'  => fn($q) => $q->where('barangay_id', $barangayId),
            'distributionProcess' => fn($q) => $q->where('barangay_id', $barangayId),
            'bdrrmcTraining'      => fn($q) => $q->where('barangay_id', $barangayId),
            'equipmentInventory'  => fn($q) => $q->where('barangay_id', $barangayId),
            'bdrrmcDirectory'     => fn($q) => $q->where('barangay_id', $barangayId),
            'evacuationPlan'      => fn($q) => $q->where('barangay_id', $barangayId),
        ])
            ->whereHas('progress', fn($q) => $q->where('barangay_id', $barangayId))
            ->where('year', $year)
            ->first();


        if (!$cra) {
            abort(404, 'CRA not found for this barangay and year.');
        }
        if ($cra) {
            $cra->setRelation(
                'familyAtRiskData',
                collect($cra->getOverallFamilyAtRisk($year, $barangayId ?? null)->toArray())
            );
        }

        $populationGender = $cra->populationGender->keyBy(function ($item) {
            return strtolower($item->gender);
        });

        $pdf = Pdf::loadView('cra.pdf', [
            'cra' => $cra,
            'populationGender' => $populationGender,
        ]);
        $pdf->setPaper('A4', 'portrait');

        $barangayName = strtoupper(optional($cra->progress->first()->barangay)->barangay_name ?? 'UNKNOWN BARANGAY');

        $fileName = "{$barangayName} CRA {$cra->year}.pdf";
        dd($cra["populationImpact"]);

        return $pdf->download($fileName);
    }

    //     public function download($year)
    // {
    //     $brgy_id = auth()->user()->barangay_id;

    //     // get it by barangay being log in
    //     $cra = Barangay::with([
    //         'generalPopulation',
    //         'bdrrmcDirectories',
    //         'bdrrmcTrainings',
    //         'populationGenders',
    //         'populationAgeGroups',
    //         'populationExposures',
    //         'disasterOccurances',
    //         'disasterAgriDamages',
    //         'disasterDamages',
    //         'disasterEffectImpacts',
    //         'disasterInventories',
    //         'disasterLifelines',
    //         'disasterPopulationImpacts',
    //         'disasterRiskPopulations',
    //         'primaryFacilities',
    //         'infraFacilities',
    //         'institutions',
    //         'roadNetworks',
    //         'publicTransportations',
    //         'houseBuilds',
    //         'houseOwnerships',
    //         'householdServices',
    //         'livelihoodStatistics',
    //         'livelihoodEvacuationSites',
    //         'reliefDistributions',
    //         'reliefDistributionProcesses',
    //         'equipmentInventories',
    //         'evacuationCenters',
    //         'evacuationInventories',
    //         'evacuationPlans',
    //         'familiesAtRisk',
    //         'hazardRisks',
    //         'illnessesStats',
    //         'disabilityStatistics',
    //         'humanResources',
    //         'affectedPlaces',
    //         'prepositionedInventories',
    //         'communityriskassessment' // eager load the CRA as well
    //     ])
    //     ->whereHas('communityriskassessment', function ($query) use ($year) {
    //         $query->where('year', $year);
    //     })
    //     ->findOrFail($brgy_id);


    //     $populationGender = $cra->populationGender->keyBy(function ($item) {
    //         return strtolower($item->gender);
    //     });

    //     $pdf = Pdf::loadView('cra.pdf', [
    //         'cra' => $cra,
    //         'populationGender' => $populationGender,
    //     ]);
    //     $pdf->setPaper('A4', 'portrait');

    //     return $pdf->download("CRA_{$cra->year}.pdf");
    // }
}

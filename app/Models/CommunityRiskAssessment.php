<?php

namespace App\Models;

use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRiskAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'barangay_id', // make sure this is fillable
    ];
    public function progress()
    {
        return $this->hasMany(CRAProgress::class, 'cra_id');
    }
    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }
    public function populationAgeGroups()
    {
        return $this->hasMany(CRAPopulationAgeGroup::class, 'cra_id');
    }

    public function generalPopulation()
    {
        return $this->hasOne(CRAGeneralPopulation::class, 'cra_id');
    }

    public function populationGender()
    {
        return $this->hasMany(CRAPopulationGender::class, 'cra_id');
    }

    public function houseBuild()
    {
        return $this->hasMany(CRAHouseBuild::class, 'cra_id');
    }

    public function houseOwnership()
    {
        return $this->hasMany(CRAHouseOwnership::class, 'cra_id');
    }

    public function primaryLivelihood()
    {
        return $this->hasMany(CRALivelihoodStatistic::class, 'cra_id');
    }

    public function houseService()
    {
        return $this->hasMany(CRAHouseholdService::class, 'cra_id');
    }

    public function infraFacility()
    {
        return $this->hasMany(CRAInfraFacility::class, 'cra_id');
    }

    public function primaryFacility()
    {
        return $this->hasMany(CRAPrimaryFacility::class, 'cra_id');
    }

    public function publicTransportation()
    {
        return $this->hasMany(CRAPublicTransportation::class, 'cra_id');
    }

    public function roadNetwork()
    {
        return $this->hasMany(CRARoadNetwork::class, 'cra_id');
    }

    public function institutionInventory()
    {
        return $this->hasMany(CRAInstitution::class, 'cra_id');
    }

    public function humanResources()
    {
        return $this->hasMany(CRAHumanResource::class, 'cra_id');
    }

    // PCRA
    public function populationImpact()
    {
        return $this->hasMany(CRADisasterPopulationImpact::class, 'cra_id');
    }

    public function effectImpact()
    {
        return $this->hasMany(CRADisasterEffectImpact::class, 'cra_id');
    }

    public function disasterDamage()
    {
        return $this->hasMany(CRADisasterDamage::class, 'cra_id');
    }

    public function agriDamage()
    {
        return $this->hasMany(CRADisasterAgriDamage::class, 'cra_id');
    }

    public function lifelines()
    {
        return $this->hasMany(CRADisasterLifeline::class, 'cra_id');
    }
    public function disasterOccurance()
    {
        return $this->hasMany(CRADisasterOccurance::class, 'cra_id');
    }


    public function hazardRisk()
    {
        return $this->hasMany(CRAHazardRisk::class, 'cra_id');
    }

    public function assessmentMatrix()
    {
        return $this->hasMany(CRAAssessmentMatrix::class, 'cra_id');
    }

    public function populationExposure()
    {
        return $this->hasMany(CRAPopulationExposure::class, 'cra_id');
    }

    public function disabilityStatistic()
    {
        return $this->hasMany(CRADisabilityStatistic::class, 'cra_id');
    }

    public function getOverallFamilyAtRisk($year = null)
    {
        $year = $year ?? $this->year;

        $cra = $this->where('year', $year)->first();

        if (!$cra) {
            return collect();
        }

        // Overall summary grouped by barangay and indicator
        $overallData = DB::table('c_r_a_family_at_risks as f')
            ->join('barangays as b', 'b.id', '=', 'f.barangay_id')
            ->select(
                'b.id as barangay_id',
                'b.barangay_name',
                'f.indicator',
                DB::raw('SUM(f.count) as total_count')
            )
            ->where('f.cra_id', $cra->id)
            ->groupBy('b.id', 'b.barangay_name', 'f.indicator')
            ->orderBy('b.barangay_name')
            ->orderByDesc('total_count')
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($rows, $barangayName) {
                return [
                    'barangay_name' => $barangayName,
                    'indicators' => $rows->values()->map(function ($row, $index) {
                        return [
                            'no' => $index + 1,
                            'indicator' => $row->indicator,
                            'total_count' => (int) $row->total_count,
                        ];
                    }),
                ];
            });

        return $overallData;
    }

    public function illnessesStat()
    {
        return $this->hasMany(CRAIllnessesStat::class, 'cra_id');
    }

    public function riskPopulation()
    {
        return $this->hasMany(CRADisasterRiskPopulation::class, 'cra_id');
    }

    public function disasterInventory()
    {
        return $this->hasMany(CRADisasterInventory::class, 'cra_id');
    }

    public function evacuationCenter()
    {
        return $this->hasMany(CRAEvacuationCenter::class, 'cra_id');
    }

    public function evacuationInventory()
    {
        return $this->hasMany(CRAEvacuationInventory::class, 'cra_id');
    }

    public function affectedArea()
    {
        return $this->hasMany(CRAAffectedPlaces::class, 'cra_id');
    }

    public function livelihoodEvacuation()
    {
        return $this->hasMany(CRALivelihoodEvacuationSite::class, 'cra_id');
    }

    public function prepositionedInventory()
    {
        return $this->hasMany(CRAPrepositionedInventory::class, 'cra_id');
    }

    public function reliefDistribution()
    {
        return $this->hasMany(CRAReliefDistribution::class, 'cra_id');
    }

    public function distributionProcess()
    {
        return $this->hasMany(CRAReliefDistributionProcess::class, 'cra_id');
    }

    public function bdrrmcTraining()
    {
        return $this->hasMany(CRABdrrmcTraining::class, 'cra_id');
    }

    public function equipmentInventory()
    {
        return $this->hasMany(CRAEquipmentInventory::class, 'cra_id');
    }

    public function bdrrmcDirectory()
    {
        return $this->hasMany(CRABdrrmcDirectory::class, 'cra_id');
    }

    public function evacuationPlan()
    {
        return $this->hasMany(CRAEvacuationPlan::class, 'cra_id');
    }
}

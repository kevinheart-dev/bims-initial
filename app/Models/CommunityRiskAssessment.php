<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRiskAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'cra_id');
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
}

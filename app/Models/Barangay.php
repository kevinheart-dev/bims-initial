<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayFactory> */
    use HasFactory;

    public function generalPopulation()
    {
        return $this->hasOne(CRAGeneralPopulation::class);
    }

    public function populationGenders()
    {
        return $this->hasMany(CRAPopulationGender::class);
    }

    public function populationAgeGroups()
    {
        return $this->hasMany(CRAPopulationAgeGroup::class);
    }

    public function householdServices()
    {
        return $this->hasMany(CRAHouseholdService::class);
    }

    public function houseBuilds()
    {
        return $this->hasMany(CRAHouseBuild::class);
    }

    public function houseOwnerships()
    {
        return $this->hasMany(CRAHouseOwnership::class);
    }

    // CRA Relationships
    public function affectedPlaces()
    {
        return $this->hasMany(CRAAffectedPlaces::class);
    }
    public function assessmentMatrices()
    {
        return $this->hasMany(CRAAssessmentMatrix::class);
    }
    public function bdrrmcDirectories()
    {
        return $this->hasMany(CRABdrrmcDirectory::class);
    }
    public function bdrrmcTrainings()
    {
        return $this->hasMany(CRABdrrmcTraining::class);
    }
    // Disability
    public function disabilityStatistics()
    {
        return $this->hasMany(CRADisabilityStatistic::class);
    }

    // Disasters (parent table)
    public function disasterOccurances()
    {
        return $this->hasMany(CRADisasterOccurance::class);
    }

    // Disaster-related hasMany relationships
    public function disasterAgriDamages()
    {
        return $this->hasMany(CRADisasterAgriDamage::class);
    }

    public function disasterDamages()
    {
        return $this->hasMany(CRADisasterDamage::class);
    }

    public function disasterEffectImpacts()
    {
        return $this->hasMany(CRADisasterEffectImpact::class);
    }

    public function disasterInventories()
    {
        return $this->hasMany(CRADisasterInventory::class);
    }

    public function disasterLifelines()
    {
        return $this->hasMany(CRADisasterLifeline::class);
    }

    public function disasterPopulationImpacts()
    {
        return $this->hasMany(CRADisasterPopulationImpact::class);
    }

    public function disasterRiskPopulations()
    {
        return $this->hasMany(CRADisasterRiskPopulation::class);
    }

    // Equipment & Facilities
    public function equipmentInventories()
    {
        return $this->hasMany(CRAEquipmentInventory::class);
    }

    public function evacuationCenters()
    {
        return $this->hasMany(CRAEvacuationCenter::class);
    }

    public function evacuationInventories()
    {
        return $this->hasMany(CRAEvacuationInventory::class);
    }

    public function evacuationPlans()
    {
        return $this->hasMany(CRAEvacuationPlan::class);
    }

    // Risk & Hazard
    public function familiesAtRisk()
    {
        return $this->hasMany(CRAFamilyAtRisk::class);
    }

    public function hazardRisks()
    {
        return $this->hasMany(CRAHazardRisk::class);
    }

     // CRA Relationships
    public function humanResources()
    {
        return $this->hasMany(CRAHumanResource::class);
    }

    public function illnessesStats()
    {
        return $this->hasMany(CRAIllnessesStat::class);
    }

    public function infraFacilities()
    {
        return $this->hasMany(CRAInfraFacility::class);
    }

    public function institutions()
    {
        return $this->hasMany(CRAInstitution::class);
    }

    public function livelihoodEvacuationSites()
    {
        return $this->hasMany(CRALivelihoodEvacuationSite::class);
    }

    public function livelihoodStatistics()
    {
        return $this->hasMany(CRALivelihoodStatistic::class);
    }

    public function populationExposures()
    {
        return $this->hasMany(CRAPopulationExposure::class);
    }
        // Prepositioned Inventories
    public function prepositionedInventories()
    {
        return $this->hasMany(CRAPrepositionedInventory::class);
    }

    // Primary Facilities
    public function primaryFacilities()
    {
        return $this->hasMany(CRAPrimaryFacility::class);
    }

    // Public Transportations
    public function publicTransportations()
    {
        return $this->hasMany(CRAPublicTransportation::class);
    }

    // Relief Distributions
    public function reliefDistributions()
    {
        return $this->hasMany(CRAReliefDistribution::class);
    }

    // Relief Distribution Processes
    public function reliefDistributionProcesses()
    {
        return $this->hasMany(CRAReliefDistributionProcess::class);
    }

    // Road Networks
    public function roadNetworks()
    {
        return $this->hasMany(CRARoadNetwork::class);
    }

    public function dataCollection()
    {
        $general = $this->generalPopulation()->first();

        return [
        'barangay' => [
            'id' => $this->id,
            'name' => $this->barangay_name, // ✅ use correct field from migration
            'population' => $general?->total_population ?? 0,
            'households_population' => $general?->total_households ?? 0,
            'families_population' => $general?->total_families ?? 0,
        ],

            // BDRRMC
            'bdrrmc_directory' => $this->bdrrmcDirectories()->get(),
            'bdrrmc_trainings' => $this->bdrrmcTrainings()->get(),

            // Population
            'general_population' => $this->generalPopulation()->first(),
            'population_genders' => $this->populationGenders()->get(),
            'population_age_groups' => $this->populationAgeGroups()->get(),
            'population_exposures' => $this->populationExposures()->get(),

            // Disaster Related
            'disaster_occurances' => $this->disasterOccurances()->get(),
            'disaster_agri_damages' => $this->disasterAgriDamages()->get(),
            'disaster_damages' => $this->disasterDamages()->get(),
            'disaster_effect_impacts' => $this->disasterEffectImpacts()->get(),
            'disaster_inventories' => $this->disasterInventories()->get(),
            'disaster_lifelines' => $this->disasterLifelines()->get(),
            'disaster_population_impacts' => $this->disasterPopulationImpacts()->get(),
            'disaster_risk_populations' => $this->disasterRiskPopulations()->get(),

            // Facilities & Infra
            'primary_facilities' => $this->primaryFacilities()->get(),
            'infra_facilities' => $this->infraFacilities()->get(),
            'institutions' => $this->institutions()->get(),
            'road_networks' => $this->roadNetworks()->get(),
            'public_transportations' => $this->publicTransportations()->get(),

            // Household & Housing
            'house_builds' => $this->houseBuilds()->get(),
            'house_ownerships' => $this->houseOwnerships()->get(),
            'household_services' => $this->householdServices()->get(),

            // Livelihood
            'livelihood_statistics' => $this->livelihoodStatistics()->get(),
            'livelihood_evacuation_sites' => $this->livelihoodEvacuationSites()->get(),

            // Relief
            'relief_distributions' => $this->reliefDistributions()->get(),
            'relief_distribution_processes' => $this->reliefDistributionProcesses()->get(),

            // Equipment & Evacuation
            'equipment_inventories' => $this->equipmentInventories()->get(),
            'evacuation_centers' => $this->evacuationCenters()->get(),
            'evacuation_inventories' => $this->evacuationInventories()->get(),
            'evacuation_plans' => $this->evacuationPlans()->get(),

            // Risk & Hazard
            'families_at_risk' => $this->familiesAtRisk()->get(),
            'hazard_risks' => $this->hazardRisks()->get(),

            // Health
            'illnesses_stats' => $this->illnessesStats()->get(),
            'disability_statistics' => $this->disabilityStatistics()->get(),

            // Human Resources
            'human_resources' => $this->humanResources()->get(),

            // Affected Places
            'affected_places' => $this->affectedPlaces()->get(),

            // Prepositioned Inventories
            'prepositioned_inventories' => $this->prepositionedInventories()->get(),
        ];
    }
}

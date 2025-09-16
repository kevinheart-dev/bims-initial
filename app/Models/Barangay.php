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
}

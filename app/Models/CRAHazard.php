<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHazard extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHazardFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'hazard_name',
    ];
    public function disasterInventories()
    {
        return $this->hasMany(CRADisasterInventory::class, 'hazard_id');
    }

    public function disasterRiskPopulations()
    {
        return $this->hasMany(CRADisasterRiskPopulation::class, 'hazard_id');
    }
    public function populationExposures()
    {
        return $this->hasMany(CRAPopulationExposure::class);
    }
}

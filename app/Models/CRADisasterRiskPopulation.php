<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterRiskPopulation extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterRiskPopulationFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'hazard_id',
        'purok_number',
        'low_families',
        'low_individuals',
        'medium_families',
        'medium_individuals',
        'high_families',
        'high_individuals',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}

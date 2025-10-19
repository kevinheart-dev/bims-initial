<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAAffectedPlaces extends Model
{
    /** @use HasFactory<\Database\Factories\CRAAffectedPlacesFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'hazard_id',
        'risk_level',
        'purok_number',
        'total_families',
        'total_individuals',
        'at_risk_families',
        'at_risk_individuals',
        'safe_evacuation_area',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}

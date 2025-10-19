<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHazardRisk extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHazardRiskFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'hazard_id',
        'probability_no',
        'effect_no',
        'management_no',
        'basis',
        'average_score',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}

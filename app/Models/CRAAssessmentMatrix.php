<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAAssessmentMatrix extends Model
{
    /** @use HasFactory<\Database\Factories\CRAAssessmentMatrixFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'hazard_id',
        'matrix_type',
        'people',
        'properties',
        'services',
        'environment',
        'livelihood',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}


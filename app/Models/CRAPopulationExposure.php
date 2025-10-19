<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAPopulationExposure extends Model
{
    /** @use HasFactory<\Database\Factories\CRAPopulationExposureFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'hazard_id',
        'purok_number',
        'total_families',
        'total_individuals',
        'individuals_male',
        'individuals_female',
        'individuals_lgbtq',
        'age_0_6_male',
        'age_0_6_female',
        'age_7m_2y_male',
        'age_7m_2y_female',
        'age_3_5_male',
        'age_3_5_female',
        'age_6_12_male',
        'age_6_12_female',
        'age_13_17_male',
        'age_13_17_female',
        'age_18_59_male',
        'age_18_59_female',
        'age_60_up_male',
        'age_60_up_female',
        'pwd_male',
        'pwd_female',
        'diseases_male',
        'diseases_female',
        'pregnant_women',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}

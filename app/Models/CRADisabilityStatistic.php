<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisabilityStatistic extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisabilityStatisticFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disability_type',
        'age_0_6_male',
        'age_0_6_female',
        'age_7m_2y_male',
        'age_7m_2y_female',
        'age_3_5_male',
        'age_3_5_female',
        'age_6_12_male',
        'age_6_12_female',
        'age_6_12_lgbtq',
        'age_13_17_male',
        'age_13_17_female',
        'age_13_17_lgbtq',
        'age_18_59_male',
        'age_18_59_female',
        'age_18_59_lgbtq',
        'age_60up_male',
        'age_60up_female',
        'age_60up_lgbtq',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRALivelihoodStatistic extends Model
{
    /** @use HasFactory<\Database\Factories\CRALivelihoodStatisticFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'livelihood_type',
        'male_without_disability',
        'male_with_disability',
        'female_without_disability',
        'female_with_disability',
        'lgbtq_without_disability',
        'lgbtq_with_disability',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

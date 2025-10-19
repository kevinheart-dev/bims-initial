<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterEffectImpact extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterEffectImpactFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_id',
        'effect_type',
        'value',
        'source',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function disaster(){
        return $this->belongsTo(CRADisasterOccurance::class);
    }
}

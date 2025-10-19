<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterPopulationImpact extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterPopulationImpactFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_id',
        'category',
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

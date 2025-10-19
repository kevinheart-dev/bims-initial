<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterOccurance extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterOccuranceFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_name',
        'year',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function agriDamages()
    {
        return $this->hasMany(CRADisasterAgriDamage::class, 'disaster_id');
    }

    public function damages()
    {
        return $this->hasMany(CRADisasterDamage::class, 'disaster_id');
    }

    public function effectImpacts()
    {
        return $this->hasMany(CRADisasterEffectImpact::class, 'disaster_id');
    }

    public function lifelines()
    {
        return $this->hasMany(CRADisasterLifeline::class, 'disaster_id');
    }

    public function populationImpacts()
    {
        return $this->hasMany(CRADisasterPopulationImpact::class, 'disaster_id');
    }

}

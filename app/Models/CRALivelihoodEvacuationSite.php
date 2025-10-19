<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRALivelihoodEvacuationSite extends Model
{
    /** @use HasFactory<\Database\Factories\CRALivelihoodEvacuationSiteFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'livelihood_type',
        'evacuation_site',
        'place_of_origin',
        'capacity_description',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

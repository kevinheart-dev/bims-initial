<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAInfraFacility extends Model
{
    /** @use HasFactory<\Database\Factories\CRAInfraFacilityFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'category',
        'infrastructure_name',
        'quantity',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

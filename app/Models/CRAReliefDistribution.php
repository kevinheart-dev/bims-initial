<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAReliefDistribution extends Model
{
    /** @use HasFactory<\Database\Factories\CRAReliefDistributionFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'evacuation_center',
        'relief_good',
        'quantity',
        'unit',
        'beneficiaries',
        'address',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

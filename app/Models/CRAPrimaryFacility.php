<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAPrimaryFacility extends Model
{
    /** @use HasFactory<\Database\Factories\CRAPrimaryFacilityFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'facility_name',
        'quantity',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

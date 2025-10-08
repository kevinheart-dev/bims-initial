<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayFacility extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayFacilityFactory> */
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'barangay_id',
        'facility_image',
        'name',
        'facility_type',
        'quantity',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHouseholdService extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHouseholdServiceFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'category',
        'service_name',
        'households_quantity',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

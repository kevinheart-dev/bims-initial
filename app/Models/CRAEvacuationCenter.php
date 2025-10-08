<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAEvacuationCenter extends Model
{
    /** @use HasFactory<\Database\Factories\CRAEvacuationCenterFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'name',
        'capacity_families',
        'capacity_individuals',
        'owner_type',
        'inspected_by_engineer',
        'has_mou',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

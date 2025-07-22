<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'resident_id',
        'vehicle_type',
        'vehicle_class',
        'usage_status',
        'is_registered',
        'created_at',
        'updated_at'
    ];
    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

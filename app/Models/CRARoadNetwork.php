<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRARoadNetwork extends Model
{
    /** @use HasFactory<\Database\Factories\CRARoadNetworkFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'road_type',
        'length_km',
        'maintained_by'
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

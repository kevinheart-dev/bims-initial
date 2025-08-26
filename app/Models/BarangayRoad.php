<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayRoad extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayRoadFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'road_image',
        'road_type',
        'length',
        'status',
        'condition',
        'maintained_by',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

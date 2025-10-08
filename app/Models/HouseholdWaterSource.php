<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdWaterSource extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdWaterSourceFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'water_source_type',
        'created_at',
        'updated_at',
    ];

    public function household(){
        return $this->belongsTo(Household::class);
    }
}

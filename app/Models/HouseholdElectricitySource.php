<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdElectricitySource extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdElectricitySourceFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'electricity_type',
        'created_at',
        'updated_at',
    ];

    public function household(){
        return $this->belongsTo(Household::class);
    }
}

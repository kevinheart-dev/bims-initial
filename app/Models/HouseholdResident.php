<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdResident extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdResidentFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'household_id',
        'relationship_to_head',
        'household_position',
        'created_at',
        'updated_at',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    // Each HouseholdResident belongs to a single household
    public function household()
    {
        return $this->belongsTo(Household::class);
    }
}

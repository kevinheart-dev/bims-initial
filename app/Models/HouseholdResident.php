<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdResident extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdResidentFactory> */
    use HasFactory;

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

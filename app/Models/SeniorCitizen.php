<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeniorCitizen extends Model
{
    /** @use HasFactory<\Database\Factories\SeniorCitizenFactory> */
    use HasFactory;

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

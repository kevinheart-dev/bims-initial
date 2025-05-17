<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    /** @use HasFactory<\Database\Factories\OccupationFactory> */
    use HasFactory;
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function occupationType()
    {
        return $this->belongsTo(OccupationType::class);
    }

}

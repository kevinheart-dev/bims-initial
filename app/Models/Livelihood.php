<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livelihood extends Model
{
    /** @use HasFactory<\Database\Factories\LivelihoodFactory> */
    use HasFactory;
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function livelihoodType()
    {
        return $this->belongsTo(LivelihoodType::class);
    }
}

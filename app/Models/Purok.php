<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purok extends Model
{
    /** @use HasFactory<\Database\Factories\PurokFactory> */
    use HasFactory;

    public function households()
    {
        return $this->hasMany(Household::class);
    }
        public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

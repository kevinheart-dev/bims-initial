<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Street extends Model
{
    /** @use HasFactory<\Database\Factories\StreetFactory> */
    use HasFactory;

    public function households()
    {
        return $this->hasMany(Household::class);
    }
    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }
}

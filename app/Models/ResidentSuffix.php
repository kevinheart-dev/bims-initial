<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentSuffix extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentSuffixFactory> */
    use HasFactory;

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

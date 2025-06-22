<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disability extends Model
{
    /** @use HasFactory<\Database\Factories\DisabilityFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'disability_type',
        'created_at',
    ];
    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

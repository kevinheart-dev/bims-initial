<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeniorCitizen extends Model
{
    /** @use HasFactory<\Database\Factories\SeniorCitizenFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'osca_id_number',
        'is_pensioner',
        'pension_type',
        'living_alone',
        'created_at',
        'updated_at',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

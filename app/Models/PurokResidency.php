<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurokResidency extends Model
{
    /** @use HasFactory<\Database\Factories\PurokResidencyFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'purok_id',
        'date_of_residency',
        'created_at',
        'updated_at',
    ];
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }
}

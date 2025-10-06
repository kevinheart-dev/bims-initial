<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deceased extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'date_of_death',
        'cause_of_death',
        'place_of_death',
        'burial_place',
        'burial_date',
        'death_certificate_number',
        'remarks',
    ];

    /**
     * A deceased record belongs to a resident.
     */
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

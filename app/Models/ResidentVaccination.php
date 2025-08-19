<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentVaccination extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentVaccinationFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'vaccine',
        'vaccination_date',
    ];

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

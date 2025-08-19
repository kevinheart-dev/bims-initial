<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentMedication extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentMedicationFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'medication',
        'start_date',
        'end_date',
    ];

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

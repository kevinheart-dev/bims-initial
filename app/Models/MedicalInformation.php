<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalInformation extends Model
{
    /** @use HasFactory<\Database\Factories\MedicalInformationFactory> */
    use HasFactory;

    protected $table = 'medical_information'; // optional if table name is non-standard

    protected $primaryKey = 'medical_information_id'; // optional if different from 'id'

    public function resident()
    {
        return $this->belongsTo(Resident::class, 'resident_id', 'id');
    }
}

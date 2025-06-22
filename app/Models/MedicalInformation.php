<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalInformation extends Model
{
    /** @use HasFactory<\Database\Factories\MedicalInformationFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'weight_kg',
        'height_cm',
        'bmi',
        'nutrition_status',
        'emergency_contact_number',
        'emergency_contact_name',
        'emergency_contact_relationship',
        'is_smoker',
        'is_alcohol_user',
        'blood_type',
        'has_philhealth',
        'philhealth_id_number',
        'pwd_id_number',
        'updated_at',
        'created_at',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

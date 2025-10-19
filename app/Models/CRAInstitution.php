<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAInstitution extends Model
{
    /** @use HasFactory<\Database\Factories\CRAInstitutionFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'name',
        'male_members',
        'female_members',
        'lgbtq_members',
        'head_name',
        'contact_no',
        'registered',
        'programs_services',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

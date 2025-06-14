<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationalHistory extends Model
{
    /** @use HasFactory<\Database\Factories\EducationalHistoryFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'school_name',
        'enrolled_now',
        'school_type',
        'educational_attainment',
        'education_status',
        'dropout_reason',
        'als_participant',
        'start_year',
        'end_year',
        'year_graduated',
        'program',
    ];
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

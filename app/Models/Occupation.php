<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occupation extends Model
{
    /** @use HasFactory<\Database\Factories\OccupationFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'occupation',
        'employment_type',
        'work_arrangement',
        'employer',
        'job_sector',
        'occupation_status',
        'is_ofw',
        'started_at',
        'ended_at',
        'monthly_income',
        'updated_at',
        'created_at',
    ];
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

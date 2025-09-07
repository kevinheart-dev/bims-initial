<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlotterReport extends Model
{
    /** @use HasFactory<\Database\Factories\BlotterReportFactory> */
    use HasFactory;
   protected $fillable = [
        'barangay_id',
        'report_type',
        'type_of_incident',
        'narrative_details',
        'actions_taken',
        'report_status',
        'location',
        'incident_date',
        'resolution',
        'recommendations',
        'recorded_by',
    ];

    public $timestamps = true;

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(BarangayOfficial::class, 'recorded_by');
    }

    public function summons()
    {
        return $this->hasMany(Summon::class);
    }

    // Convenience scopes
    public function complainants()
    {
        return $this->participants()->where('role_type', 'complainant');
    }

    public function respondents()
    {
        return $this->participants()->where('role_type', 'respondent');
    }

    public function witnesses()
    {
        return $this->participants()->where('role_type', 'witness');
    }

    public function participants()
    {
        return $this->hasMany(CaseParticipant::class, 'blotter_id');
    }


    public function latestComplainant()
    {
        return $this->hasOne(CaseParticipant::class, 'blotter_id')
                    ->where('role_type', 'complainant')
                    ->latestOfMany();
    }

    public function latestRespondent()
    {
        return $this->hasOne(CaseParticipant::class, 'blotter_id')
                    ->where('role_type', 'respondent')
                    ->latestOfMany();
    }
}

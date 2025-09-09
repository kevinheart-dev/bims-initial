<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SummonParticipantAttendance extends Model
{
    /** @use HasFactory<\Database\Factories\SummonParticipantAttendanceFactory> */
    use HasFactory;
    public $timestamps = true;

    protected $fillable = [
        'take_id',
        'participant_id',
        'attendance_status',
    ];

    /**
     * Attendance belongs to a specific summon take (hearing session).
     */
    public function take()
    {
        return $this->belongsTo(SummonTake::class, 'take_id');
    }

    /**
     * Attendance belongs to a specific case participant.
     */
    public function participant()
    {
        return $this->belongsTo(CaseParticipant::class, 'participant_id');
    }
}

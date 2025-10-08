<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SummonTake extends Model
{
    /** @use HasFactory<\Database\Factories\SummonTakeFactory> */
    use HasFactory;
    public $timestamps = true;

    protected $fillable = [
        'summon_id',
        'session_number',
        'hearing_date',
        'session_status',
        'session_remarks',
    ];

    /**
     * A summon take belongs to a summon.
     */
    public function summon()
    {
        return $this->belongsTo(Summon::class);
    }

    /**
     * A summon take has many participant attendances.
     */
    public function attendances()
    {
        return $this->hasMany(SummonParticipantAttendance::class, 'take_id');
    }
}

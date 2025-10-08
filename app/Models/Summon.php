<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Summon extends Model
{
    /** @use HasFactory<\Database\Factories\SummonFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'blotter_id',
        'status',
        'issued_by',
    ];

    /**
     * A summon belongs to a blotter report.
     */
    public function blotter()
    {
        return $this->belongsTo(BlotterReport::class, 'blotter_id');
    }

    /**
     * A summon is issued by a barangay official.
     */
    public function issuedBy()
    {
        return $this->belongsTo(BarangayOfficial::class, 'issued_by');
    }

    public function sessions()
    {
        return $this->hasMany(SummonTake::class, 'summon_id');
    }

    /**
     * A summon can have many hearing sessions (summon takes).
     */
    public function takes()
    {
        return $this->hasMany(SummonTake::class, 'summon_id');
    }
    public function latestTake()
    {
        return $this->hasOne(SummonTake::class, 'summon_id')
            ->latestOfMany('session_number'); // picks the highest session_number
    }

}

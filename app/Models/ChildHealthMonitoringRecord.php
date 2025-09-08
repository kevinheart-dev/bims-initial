<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChildHealthMonitoringRecord extends Model
{
    /** @use HasFactory<\Database\Factories\ChildHealthMonitoringRecordFactory> */
    use HasFactory;
    protected $fillable = [
        'resident_id',
        'head_circumference',
        'developmental_milestones',
    ];

    public $timestamps = true;

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

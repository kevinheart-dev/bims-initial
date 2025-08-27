<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PregnancyRecords extends Model
{
    /** @use HasFactory<\Database\Factories\PregnancyRecordsFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'status',
        'expected_due_date',
        'delivery_date',
        'notes',
    ];

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

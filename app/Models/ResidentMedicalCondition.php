<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentMedicalCondition extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentMedicalConditionFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'condition',
        'status',
        'diagnosed_date',
        'resolved_date',
    ];

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

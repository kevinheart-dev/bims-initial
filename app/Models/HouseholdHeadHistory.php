<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdHeadHistory extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdHeadHistoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'resident_id',
        'start_date',
        'end_date',
        'created_at',
        'updated_at',
    ];
    public function household(){
        return $this->belongsTo(Household::class);
    }
        public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseholdWasteManagement extends Model
{
    /** @use HasFactory<\Database\Factories\HouseholdWasteManagementFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'waste_management_type',
        'created_at',
        'updated_at',
    ];

    public function household(){
        return $this->belongsTo(Household::class);
    }
}

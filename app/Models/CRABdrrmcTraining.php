<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRABdrrmcTraining extends Model
{
    /** @use HasFactory<\Database\Factories\CRABdrrmcTrainingFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'title',
        'status',
        'duration',
        'agency',
        'inclusive_dates',
        'number_of_participants',
        'participants',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

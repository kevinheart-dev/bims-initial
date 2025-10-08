<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livelihood extends Model
{
    /** @use HasFactory<\Database\Factories\LivelihoodFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'livelihood_type',
        'description',
        'is_main_livelihood',
        'started_at',
        'ended_at',
        'monthly_income',
        'satus',
        'created_at',
        'updated_at'
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAGeneralPopulation extends Model
{
    /** @use HasFactory<\Database\Factories\CRAGeneralPopulationFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'total_population',
        'total_households',
        'total_families',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

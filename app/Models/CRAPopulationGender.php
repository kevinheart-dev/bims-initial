<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAPopulationGender extends Model
{
    /** @use HasFactory<\Database\Factories\CRAPopulationGenderFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'gender',
        'quantity'
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

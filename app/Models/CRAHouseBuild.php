<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHouseBuild extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHouseBuildFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'house_type',
        'one_floor',
        'two_or_more_floors',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterAgriDamage extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterAgriDamageFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_id',
        'description',
        'value',
        'source',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function disaster(){
        return $this->belongsTo(CRADisasterOccurance::class);
    }
}

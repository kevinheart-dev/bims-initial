<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterLifeline extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterLifelineFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_id',
        'category',
        'description',
        'value',
        'source',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function disaster(){
        return $this->belongsTo(CRADisasterOccurance::class);
    }
}

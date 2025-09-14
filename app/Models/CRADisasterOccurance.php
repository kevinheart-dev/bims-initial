<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterOccurance extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterOccuranceFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'disaster_name',
        'year',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

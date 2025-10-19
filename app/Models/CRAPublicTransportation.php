<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAPublicTransportation extends Model
{
    /** @use HasFactory<\Database\Factories\CRAPublicTransportationFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'transpo_type',
        'quantity',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

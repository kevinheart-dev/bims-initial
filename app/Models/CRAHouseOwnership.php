<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHouseOwnership extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHouseOwnershipFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'ownership_type',
        'quantity',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

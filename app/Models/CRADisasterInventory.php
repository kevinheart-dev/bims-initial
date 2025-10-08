<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRADisasterInventory extends Model
{
    /** @use HasFactory<\Database\Factories\CRADisasterInventoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'hazard_id',
        'category',
        'item_name',
        'total_in_barangay',
        'percentage_at_risk',
        'location',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
    public function hazard(){
        return $this->belongsTo(CRAHazard::class);
    }
}

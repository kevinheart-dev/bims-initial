<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAEquipmentInventory extends Model
{
    /** @use HasFactory<\Database\Factories\CRAEquipmentInventoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'item',
        'availability',
        'quantity',
        'location',
        'remarks',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

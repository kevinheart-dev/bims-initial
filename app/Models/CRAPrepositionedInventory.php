<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAPrepositionedInventory extends Model
{
    /** @use HasFactory<\Database\Factories\CRAPrepositionedInventoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'item_name',
        'quantity',
        'remarks',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

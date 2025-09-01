<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'barangay_id',
        'item_name',
        'item_category',
        'quantity',
        'unit',
        'received_date',
        'supplier',
        'satus',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

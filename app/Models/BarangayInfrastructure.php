<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayInfrastructure extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayInfrastructureFactory> */
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'barangay_id',
        'infrastructure_image',
        'infrastructure_type',
        'infrastructure_category',
        'quantity',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

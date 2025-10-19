<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAFamilyAtRisk extends Model
{
    /** @use HasFactory<\Database\Factories\CRAFamilyAtRiskFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'purok_number',
        'indicator',
        'count',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

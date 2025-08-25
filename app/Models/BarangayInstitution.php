<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayInstitution extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayInstitutionFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'name',
        'type',
        'description',
        'year_established',
        'status',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

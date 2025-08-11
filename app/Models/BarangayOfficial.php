<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayOfficial extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayOfficialFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'term_id',
        'position',
        'status',
        'appointment_type',
        'appointted_by',
        'appointment_reason',
        'remarks',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
    public function term()
    {
        return $this->belongsTo(BarangayOfficialTerm::class);
    }

    public function designation()
    {
        return $this->hasOne(Designation::class, 'barangay_kagawad_id');
    }
}

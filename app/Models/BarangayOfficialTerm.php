<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayOfficialTerm extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayOfficialTermFactory> */
    use HasFactory;

    protected $fillable = [
        'barangay_id',
        'term_start',
        'term_end',
        'status',
    ];
    public function barangayOfficials()
    {
        return $this->hasMany(BarangayOfficial::class, 'term_id');
    }
}

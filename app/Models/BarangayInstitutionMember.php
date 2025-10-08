<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayInstitutionMember extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayInstitutionMemberFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'institution_id',
        'resident_id',
        'is_head',
        'member_since',
        'status',
    ];

    public function institution()
    {
        return $this->belongsTo(BarangayInstitution::class);
    }
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}

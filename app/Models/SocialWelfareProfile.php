<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialWelfareProfile extends Model
{
    /** @use HasFactory<\Database\Factories\SocialWelfareProfileFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'barangay_id',
        'is_4ps_beneficiary',
        'is_indigent',
        'is_solo_parent',
        'solo_parent_id_number',
        'orphan_status',
        'philsys_card_no',
        'created_at',
        'updated_at',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

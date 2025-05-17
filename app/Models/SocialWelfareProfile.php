<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialWelfareProfile extends Model
{
    /** @use HasFactory<\Database\Factories\SocialWelfareProfileFactory> */
    use HasFactory;

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

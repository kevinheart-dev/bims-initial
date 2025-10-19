<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRiskAssessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'barangay_id',
        'year',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

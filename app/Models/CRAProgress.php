<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAProgress extends Model
{
    /** @use HasFactory<\Database\Factories\CRAProgressFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'percentage',
        'submitted_at',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay_id');
    }

    public function communityRiskAssessment()
    {
        return $this->belongsTo(CommunityRiskAssessment::class, 'cra_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAReliefDistributionProcess extends Model
{
    /** @use HasFactory<\Database\Factories\CRAReliefDistributionProcessFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'step_no',
        'distribution_process',
        'origin_of_goods',
        'remarks',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

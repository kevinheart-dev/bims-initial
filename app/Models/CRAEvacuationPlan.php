<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAEvacuationPlan extends Model
{
    /** @use HasFactory<\Database\Factories\CRAEvacuationPlanFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'activity_no',
        'things_to_do',
        'responsible_person',
        'remarks',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

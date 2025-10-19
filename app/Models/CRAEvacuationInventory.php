<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAEvacuationInventory extends Model
{
    /** @use HasFactory<\Database\Factories\CRAEvacuationInventoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'cra_id',
        'purok_number',
        'total_families',
        'total_individuals',
        'families_at_risk',
        'individuals_at_risk',
        'plan_a_center',
        'plan_a_capacity_families',
        'plan_a_capacity_individuals',
        'plan_a_unaccommodated_families',
        'plan_a_unaccommodated_individuals',
        'plan_b_center',
        'plan_b_unaccommodated_families',
        'plan_b_unaccommodated_individuals',
        'remarks',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

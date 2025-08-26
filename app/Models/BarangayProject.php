<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayProject extends Model
{
    /** @use HasFactory<\Database\Factories\BarangayProjectFactory> */
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'barangay_id',
        'project_image',
        'title',
        'description',
        'status',
        'category',
        'responsible_institution_id',
        'budget',
        'funding_source',
        'start_date',
        'end_date',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function institution()
    {
        return $this->belongsTo(BarangayInstitution::class, 'responsible_institution_id');
    }
}

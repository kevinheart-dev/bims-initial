<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAIllnessesStat extends Model
{
    /** @use HasFactory<\Database\Factories\CRAIllnessesStatFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'illness',
        'children',
        'adults',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

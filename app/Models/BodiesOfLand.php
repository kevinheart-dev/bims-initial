<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BodiesOfLand extends Model
{
    /** @use HasFactory<\Database\Factories\BodiesOfLandFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'name',
        'exists',
        'type',
    ];
}

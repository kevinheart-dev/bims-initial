<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRAHazard extends Model
{
    /** @use HasFactory<\Database\Factories\CRAHazardFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'hazard_name',
    ];
}

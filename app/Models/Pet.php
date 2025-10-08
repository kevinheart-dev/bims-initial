<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    /** @use HasFactory<\Database\Factories\PetFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'pet_type',
        'is_vaccinated',
        'created_at',
        'updated_at',
    ];

    public function household(){
        return $this->belongsTo(Household::class);
    }
}

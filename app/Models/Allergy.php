<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allergy extends Model
{
    /** @use HasFactory<\Database\Factories\AllergyFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'allergy_name',
        'reaction_description',
    ];

    public function resident(){
        return $this->belongsTo(Resident::class);
    }
}

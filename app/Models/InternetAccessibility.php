<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternetAccessibility extends Model
{
    /** @use HasFactory<\Database\Factories\InternetAccessibilityFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'household_id',
        'type_of_internet',
        'created_at',
        'updated_at',
    ];

    public function household(){
        return $this->belongsTo(Household::class);
    }
}

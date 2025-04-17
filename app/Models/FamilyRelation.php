<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyRelation extends Model
{
    /** @use HasFactory<\Database\Factories\FamilyRelationFactory> */
    use HasFactory;

    public function residentInvo()
    {
        return $this->belongsTo(Resident::class, 'resident_id');
    }

    public function relatedTo()
    {
        return $this->belongsTo(Resident::class, 'related_to');
    }
}

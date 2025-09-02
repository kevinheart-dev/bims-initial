<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\CaseParticipantFactory> */
    use HasFactory;
    protected $fillable = [
        'blotter_id',
        'resident_id',
        'name',
        'role_type',
        'notes',
    ];

    protected $appends = ['display_name']; // automatically include display_name when serialized

    public function blotter()
    {
        return $this->belongsTo(BlotterReport::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->resident?->full_name ?? $this->name ?? '';
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\CaseParticipantFactory> */
    use HasFactory;
    protected $table = 'case_participants';
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
        // 1. If linked to a resident, use full_name
        if ($this->resident) {
            return $this->resident->full_name;
        }

        // 2. If name column is filled, use it
        if (!empty($this->name)) {
            return $this->name;
        }

        // 3. If display_name is filled, use it
        return $this->attributes['display_name'] ?? '';
    }
}

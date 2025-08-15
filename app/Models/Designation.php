<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    /** @use HasFactory<\Database\Factories\DesignationFactory> */
    use HasFactory;

        use HasFactory;

    protected $fillable = [
        'official_id',
        'purok_id',
        'started_at',
        'ended_at',
    ];

    public function official()
    {
        return $this->belongsTo(BarangayOfficial::class, 'official_id');
    }

    public function purok()
    {
        return $this->belongsTo(Purok::class);
    }
}

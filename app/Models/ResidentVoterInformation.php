<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentVoterInformation extends Model
{
    /** @use HasFactory<\Database\Factories\ResidentVoterInformationFactory> */
    use HasFactory;

    public $timestamps = true;
    protected $fillable = [
        'resident_id',
        'registered_barangay_id',
        'voter_id_number',
        'voting_status',
        'updated_at',
        'created_at',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }


}

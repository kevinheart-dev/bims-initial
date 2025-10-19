<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CRABdrrmcDirectory extends Model
{
    /** @use HasFactory<\Database\Factories\CRABdrrmcDirectoryFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $fillable = [
        'barangay_id',
        'designation_team',
        'name',
        'contact_no',
        'cra_id',
    ];

    public function barangay(){
        return $this->belongsTo(Barangay::class);
    }
}

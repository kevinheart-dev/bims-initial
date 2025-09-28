<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory;

    protected $fillable = [
        'barangay_id',
        'name',
        'file_path',
        'description',
        'specific_purpose'
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}

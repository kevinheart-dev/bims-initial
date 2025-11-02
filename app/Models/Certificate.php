<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Certificate extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateFactory> */
    use HasFactory;
    public $timestamps = true;
    protected $casts = [
        'dynamic_values' => 'array', // store as array
    ];
    protected $fillable = [
        'resident_id',
        'document_id',
        'barangay_id',
        'request_status',
        'purpose',
        'issued_at',
        'issued_by',
        'docx_path',
        'pdf_path',
        'control_number',
        'dynamic_values'
    ];

    protected static function booted()
    {
        static::deleting(function ($certificate) {
            if ($certificate->docx_path && Storage::disk('public')->exists($certificate->docx_path)) {
                Storage::disk('public')->delete($certificate->docx_path);
            }
        });
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
    public function document()
    {
        return $this->belongsTo(Document::class);
    }
    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
    public function issuedBy()
    {
        return $this->belongsTo(BarangayOfficial::class, 'issued_by');
    }
}

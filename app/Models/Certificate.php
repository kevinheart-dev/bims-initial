<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    /** @use HasFactory<\Database\Factories\CertificateFactory> */
    use HasFactory;

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
    ];

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

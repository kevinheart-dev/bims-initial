<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificateRequestFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'resident_id'  => 'nullable|exists:residents,id',
            'barangay_id'  => 'required|exists:barangays,id',
            'document_id'  => 'required|exists:documents,id',
            'purpose'      => 'required|string|max:255',
            'placeholders' => 'nullable|array',
        ];
    }

    /**
     * Custom attribute names for error messages
     */
    public function attributes(): array
    {
        return [
            'resident_id' => 'resident',
            'barangay_id' => 'barangay',
            'document_id' => 'certificate',
        ];
    }
}

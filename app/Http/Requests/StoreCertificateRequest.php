<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow logged-in users
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'resident_id'   => 'nullable|exists:residents,id',
            'document_id'   => 'required|exists:documents,id',
            'purpose'       => 'required|string|max:255',
            'placeholders'  => 'nullable|array',
            'dynamicValues'  => 'nullable|array',
        ];
    }

    /**
     * Custom messages for validation errors (optional)
     */
    public function messages(): array
    {
        return [
            'document_id.required' => 'Please select a certificate.',
            'document_id.exists'   => 'The selected certificate is invalid.',
            'purpose.required'     => 'Please provide the purpose of the certificate.',
            'placeholders.array'   => 'Invalid format for additional information fields.',
        ];
    }
}

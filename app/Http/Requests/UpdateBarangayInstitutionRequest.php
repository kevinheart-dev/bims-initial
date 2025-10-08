<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBarangayInstitutionRequest extends FormRequest
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
            'institution_id'                  => ['required', 'exists:barangay_institutions,id'],
            'institutions.*.name'             => ['required', 'string', 'max:255'],
            'institutions.*.type'             => ['required', 'string', 'max:100'],
            'institutions.*.description'      => ['nullable', 'string'],
            'institutions.*.year_established' => ['nullable', 'digits:4', 'integer', 'before_or_equal:' . date('Y')],
            'institutions.*.status'           => ['required', Rule::in(['active', 'inactive','dissolved'])],
        ];
    }
    public function attributes(): array
    {
        return [
            'institutions.*.name'             => 'institution name',
            'institutions.*.type'             => 'institution type',
            'institutions.*.description'      => 'institution description',
            'institutions.*.year_established' => 'year established',
            'institutions.*.status'           => 'status',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'             => 'The institution name is required.',
            'year_established.digits'   => 'The year must be a valid 4-digit year.',
            'year_established.before_or_equal' => 'The year established cannot be in the future.',
            'status.in'                 => 'Invalid status selected.',
        ];
    }
}

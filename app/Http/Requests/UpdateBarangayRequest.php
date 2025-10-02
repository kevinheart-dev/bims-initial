<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangayRequest extends FormRequest
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
    public function rules(){
        return [
            'barangay_name'   => ['required', 'string', 'max:50'],
            'contact_number'  => ['nullable', 'string', 'max:15'],
            'area_sq_km'      => ['nullable', 'numeric', 'between:0,999.99'],
            'email'           => ['nullable', 'email', 'max:50'],
            'logo_path'       => ['nullable', 'image', 'max:5120'],
            'founded_year'    => ['nullable', 'digits:4', 'integer', 'before_or_equal:' . now()->year],
            'barangay_code'   => ['nullable', 'string', 'max:20'],
            'barangay_type'   => ['required', 'in:rural,urban'],
        ];
    }

    public function messages(): array
    {
        return [
            'barangay_name.required'   => 'The barangay name is required.',
            'barangay_name.max'        => 'The barangay name may not exceed 50 characters.',

            'contact_number.max'       => 'The contact number may not exceed 15 characters.',

            'area_sq_km.numeric'       => 'The area must be a number.',
            'area_sq_km.between'       => 'The area must be between 0 and 999.99 square kilometers.',

            'email.email'              => 'The email must be a valid email address.',
            'email.max'                => 'The email may not exceed 50 characters.',

            'founded_year.digits'      => 'The founded year must be exactly 4 digits.',
            'founded_year.integer'     => 'The founded year must be a valid year.',
            'founded_year.before_or_equal' => 'The founded year cannot be in the future.',

            'barangay_code.max'        => 'The barangay code may not exceed 20 characters.',

            'barangay_type.required'   => 'The barangay type is required.',
            'barangay_type.in'         => 'The barangay type must be either rural or urban.',
        ];
    }

}

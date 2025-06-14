<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResidentRequest extends FormRequest
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
        // SECTION 1: Personal Information
        'resident_image' => ['nullable', 'image', 'max:5120'], // 5MB max
        'lastname' => ['required', 'string', 'max:55'],
        'firstname' => ['required', 'string', 'max:55'],
        'middlename' => ['nullable', 'string', 'max:55'],
        'suffix' => ['nullable', Rule::in(['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'])],
        'birthdate' => ['required', 'date', 'before:today'],
        'birthplace' => ['required', 'string', 'max:150'],
        'civil_status' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated', 'annulled'])],
        'gender' => ['required', Rule::in(['male', 'female', 'LGBTQ'])],
        'maiden_middle_name' => ['nullable', 'string', 'max:100'],
        'citizenship' => ['required', 'string', 'max:55'],
        'religion' => ['required', 'string', 'max:55'],
        'ethnicity' => ['nullable', 'string', 'max:55'],
        'contactNumber' => ['nullable', 'string', 'max:15'],
        'email' => ['nullable', 'email', 'max:55'],
        'residency_type' => ['required', Rule::in(['permanent', 'temporary', 'migrant'])],
        'residency_date' => ['required', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'purok_number' => ['required', 'string', 'max:2'],
        'registered_voter' => ['required', 'boolean'],


        // SECTION 2: Educational Information
        'is_student'         => ['required', 'boolean'],
        'school_name'        => ['nullable', 'string', 'max:155'],
        'school_type'        => ['nullable', Rule::in(['public', 'private'])],
        'current_level'      => ['nullable', Rule::in([
            'elementary', 'high_school', 'college', 'vocational', 'post_grad', 'no_formal_education'
        ])],
        'education_status'   => ['nullable', Rule::in(['graduate', 'undergraduate'])],
        'osc'                => ['nullable', 'boolean'],
        'osy'                => ['nullable','boolean'],
        'year_started'       => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'year_ended'         => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'year_graduated'     => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'program'            => ['nullable', 'string', 'max:55'],
    ];
}

}

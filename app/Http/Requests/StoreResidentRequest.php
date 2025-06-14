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
        'resident_image' => ['nullable', 'image', 'max:2048'], // 2MB max
        'lastname' => ['required', 'string', 'max:55'],
        'firstname' => ['required', 'string', 'max:55'],
        'middlename' => ['nullable', 'string', 'max:55'],
        'suffix' => ['nullable', Rule::in(['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'])],
        'birthdate' => ['required', 'date', 'before:today'],
        'birthplace' => ['required', 'string', 'max:150'],
        'civil_status' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated', 'annulled'])],
        'gender' => ['required', Rule::in(['male', 'female', 'LGBTQ'])],
        'maiden_middle_name' => ['nullable', 'string', 'max:100'],
        'religion' => ['required', 'string', 'max:55'],
        'ethnicity' => ['nullable', 'string', 'max:55'],
        'citizenship' => ['required', 'string', 'max:55'],
        'contactNumber' => ['nullable', 'string', 'max:15'],
        'email' => ['nullable', 'email', 'max:55'],
    ];
}

}

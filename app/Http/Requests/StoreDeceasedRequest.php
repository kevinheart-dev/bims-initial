<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeceasedRequest extends FormRequest
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
            'resident_id' => ['required', 'exists:residents,id', 'unique:deceaseds,resident_id'],
            'date_of_death' => ['required', 'date', 'before_or_equal:today'],
            'cause_of_death' => ['nullable', 'string', 'max:255'],
            'place_of_death' => ['nullable', 'string', 'max:255'],
            'burial_place' => ['nullable', 'string', 'max:255'],
            'burial_date' => ['nullable', 'date', 'after_or_equal:date_of_death'],
            'death_certificate_number' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident.',
            'resident_id.exists' => 'The selected resident does not exist.',
            'resident_id.unique' => 'This resident already has a death record.',

            'date_of_death.required' => 'The date of death is required.',
            'date_of_death.date' => 'Please enter a valid date for the date of death.',
            'date_of_death.before_or_equal' => 'The date of death cannot be in the future.',

            'cause_of_death.max' => 'The cause of death must not exceed 255 characters.',
            'place_of_death.max' => 'The place of death must not exceed 255 characters.',
            'burial_place.max' => 'The burial place must not exceed 255 characters.',

            'burial_date.date' => 'Please enter a valid burial date.',
            'burial_date.after_or_equal' => 'The burial date must be on or after the date of death.',

            'death_certificate_number.max' => 'The death certificate number must not exceed 255 characters.',

            'remarks.string' => 'Remarks must be a valid text.',
        ];
    }
}

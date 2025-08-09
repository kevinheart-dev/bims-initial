<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeniorCitizenRequest extends FormRequest
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
            'resident_id' => ['required', 'exists:residents,id'],
            'is_pensioner' => ['required', 'in:yes,no,pending'],
            'living_alone' => ['required', 'boolean'],

            // Conditionally required if pensioner is yes
            'osca_id_number' => ['required_if:is_pensioner,yes', 'nullable', 'string', 'max:50'],
            'pension_type' => ['required_if:is_pensioner,yes', 'nullable', 'string', 'in:SSS,DSWD,GSIS,private,none'],
        ];
    }

    public function attributes(): array
    {
        return [
            'resident_id' => 'resident',
            'is_pensioner' => 'pensioner status',
            'living_alone' => 'living alone',
            'osca_id_number' => 'OSCA ID number',
            'pension_type' => 'type of pension',
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident.',
            'resident_id.exists' => 'The selected resident does not exist.',

            'is_pensioner.required' => 'Please select pensioner status.',
            'is_pensioner.in' => 'Invalid pensioner status selected.',

            'living_alone.required' => 'Please select if the resident lives alone.',
            'living_alone.boolean' => 'Living alone must be yes or no.',

            'osca_id_number.required_if' => 'OSCA ID number is required when pensioner is marked as yes.',
            'pension_type.required_if' => 'Pension type is required when pensioner is marked as yes.',
            'pension_type.in' => 'Invalid pension type selected.',
        ];
    }
}

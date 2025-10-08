<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEducationalHistoryRequest extends FormRequest
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

            'educational_histories' => ['required', 'array', 'min:1'],
            'educational_histories.*.education' => ['required', 'string'],
            'educational_histories.*.education_status' => ['nullable', 'string'],
            'educational_histories.*.school_name' => ['nullable', 'string', 'max:255'],
            'educational_histories.*.school_type' => ['nullable', 'in:public,private'],
            'educational_histories.*.year_started' => ['nullable', 'digits:4'],
            'educational_histories.*.year_ended' => ['nullable', 'digits:4'],
            'educational_histories.*.program' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident.',
            'educational_histories.required' => 'At least one educational history is required.',
            'educational_histories.*.education.required' => 'Educational attainment is required for each entry.',
            'educational_histories.*.year_started.digits' => 'Year started must be a 4-digit year.',
            'educational_histories.*.year_ended.digits' => 'Year ended must be a 4-digit year.',
        ];
    }
}

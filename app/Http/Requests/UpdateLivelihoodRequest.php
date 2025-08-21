<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLivelihoodRequest extends FormRequest
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

            'livelihoods' => ['required', 'array', 'min:1'],
            'livelihoods.*.livelihood_type' => ['required', 'string', 'max:155'],
            'livelihoods.*.description' => ['nullable', 'string', 'max:255'],

            'livelihoods.*.is_main_livelihood' => ['required', Rule::in([0, 1])],

            'livelihoods.*.status' => ['required', Rule::in(['active', 'inactive', 'seasonal', 'ended'])],

            'livelihoods.*.started_at' => ['nullable', 'date', 'before_or_equal:today'],
            'livelihoods.*.ended_at' => ['nullable', 'date', 'after:livelihoods.*.started_at'],

            'livelihoods.*.average_monthly_income' => ['nullable', 'numeric', 'min:0'],

            // if you support income + frequency
            'livelihoods.*.income' => ['nullable', 'numeric', 'min:0'],
            'livelihoods.*.income_frequency' => [
                'nullable',
                Rule::in(['daily', 'bi_weekly', 'weekly', 'monthly', 'annually']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Resident is required.',
            'resident_id.exists' => 'Selected resident does not exist.',
            'livelihoods.required' => 'At least one livelihood must be added.',
            'livelihoods.*.livelihood_type.required' => 'Livelihood type is required.',
            'livelihoods.*.status.in' => 'Invalid status selected.',
            'livelihoods.*.is_main_livelihood.in' => 'Is main livelihood must be Yes or No.',
            'livelihoods.*.income_frequency.in' => 'Income frequency must be one of daily, bi-weekly, weekly, monthly, or annually.',
        ];
    }
}

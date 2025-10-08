<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildHealthMonitoringRecordRequest extends FormRequest
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

            // Medical Information
            'weight_kg' => ['required', 'numeric', 'min:1'],
            'height_cm' => ['required', 'numeric', 'min:10'],
            'bmi' => ['nullable', 'numeric'],
            'nutrition_status' => ['nullable', 'string', 'max:50'],

            // Child Health Monitoring
            'head_circumference' => ['nullable', 'numeric', 'min:1'],
            'developmental_milestones' => ['nullable', 'string'],

            // Vaccinations
            'vaccinations' => ['nullable', 'array'],
            'vaccinations.*.vaccine' => ['required_with:vaccinations.*.vaccination_date', 'string', 'max:100'],
            'vaccinations.*.vaccination_date' => ['required_with:vaccinations.*.vaccine', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident.',
            'resident_id.exists' => 'The selected resident does not exist.',
            'weight_kg.required' => 'Weight is required.',
            'height_cm.required' => 'Height is required.',
            'immunizations_updated.required' => 'Please specify if immunizations are updated.',
            'vaccinations.*.vaccine.required_with' => 'Vaccine name is required when vaccination date is provided.',
            'vaccinations.*.vaccination_date.required_with' => 'Vaccination date is required when vaccine name is provided.',
        ];
    }
}

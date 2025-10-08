<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChildHealthMonitoringRecordRequest extends FormRequest
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
            'id' => ['required', 'exists:child_health_monitoring_records,id'],
            'resident_id' => ['required', 'exists:residents,id'],

            // Monitoring record
            'head_circumference' => ['nullable', 'numeric', 'between:20,70'],
            'developmental_milestones' => ['nullable', 'string', 'max:1000'],

            // Medical info
            'weight_kg' => ['nullable', 'numeric', 'between:1,200'],
            'height_cm' => ['nullable', 'numeric', 'between:30,250'],
            'bmi' => ['nullable', 'numeric', 'between:5,100'],
            'nutrition_status' => ['nullable', 'string', 'max:50'],

            // Vaccinations (array of objects)
            'vaccinations' => ['nullable', 'array'],
            'vaccinations.*.id' => ['nullable', 'exists:resident_vaccinations,id'],
            'vaccinations.*.vaccine' => ['required_with:vaccinations.*.vaccination_date', 'string', 'max:255'],
            'vaccinations.*.vaccination_date' => ['required_with:vaccinations.*.vaccine', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Resident is required.',
            'resident_id.exists' => 'Selected resident does not exist.',
            'head_circumference.numeric' => 'Head circumference must be a number.',
            'weight_kg.numeric' => 'Weight must be a valid number.',
            'height_cm.numeric' => 'Height must be a valid number.',
            'vaccinations.*.vaccine.required_with' => 'Vaccine name is required when date is provided.',
            'vaccinations.*.vaccination_date.required_with' => 'Vaccination date is required when vaccine name is provided.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePregnancyRecordsRequest extends FormRequest
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
    public function rules()
    {
        return [
            'resident_id' => ['required', 'exists:residents,id'],
            'pregnancy_records' => ['required', 'array', 'min:1'],
            'pregnancy_records.*.status' => ['required', 'in:ongoing,delivered,miscarried,aborted'],
            'pregnancy_records.*.expected_due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'pregnancy_records.*.delivery_date' => ['nullable', 'date', 'after_or_equal:pregnancy_records.*.expected_due_date'],
            'pregnancy_records.*.notes' => ['nullable', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'resident_id.required' => 'Resident selection is required.',
            'resident_id.exists' => 'The selected resident is invalid.',
            'pregnancy_records.*.status.required' => 'Pregnancy status is required.',
            'pregnancy_records.*.status.in' => 'The selected status is invalid.',
            'pregnancy_records.*.expected_due_date.date' => 'Expected due date must be a valid date.',
            'pregnancy_records.*.expected_due_date.after_or_equal' => 'Expected due date cannot be in the past.',
            'pregnancy_records.*.delivery_date.date' => 'Delivery date must be a valid date.',
            'pregnancy_records.*.delivery_date.after_or_equal' => 'Delivery date cannot be before the expected due date.',
        ];
    }
}

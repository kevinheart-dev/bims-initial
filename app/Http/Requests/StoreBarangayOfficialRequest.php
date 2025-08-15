<?php

namespace App\Http\Requests;

use App\Models\BarangayOfficial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBarangayOfficialRequest extends FormRequest
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
            'resident_image'      => ['nullable', 'image', 'max:5120'], // 5MB max
            'resident_id'         => ['required', 'exists:residents,id'],
            'position'            => ['required', 'string', 'max:100'],
            'contact_number'      => ['nullable', 'string', 'regex:/^09\d{9}$/'],
            'email'               => ['nullable', 'email', 'max:255'],

            // Validate array of designations for certain positions
            'designations'        => ['required_if:position,barangay_kagawad,sk_kagawad', 'array'],
            'designations.*.designation' => ['required_if:position,barangay_kagawad,sk_kagawad', 'exists:puroks,id'],

            'term'                => ['required', 'exists:barangay_official_terms,id'],
            'appointment_type'    => ['required', Rule::in(['elected', 'appointed', 'succession'])],

            // If appointed, additional fields are required
            'appointed_by'       => ['required_if:appointment_type,appointed', 'nullable', 'string', 'max:255'],
            'appointment_reason' => ['required_if:appointment_type,appointed', 'nullable', 'string', 'max:255'],
            'remarks'             => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident name.',
            'position.required'    => 'Please select an official position.',
            'designations.required_if' => 'Please add at least one designation.',
            'designations.*.designation.required_if' => 'Please select the designated purok.',
            'term.required'        => 'Please select the official term.',
            'appointment_type.required' => 'Please choose an appointment type.',
            'appointed_by.required_if' => 'The appointed by field is required when the appointment type is appointed.',
            'appointment_reason.required_if' => 'The appointment reason is required when the appointment type is appointed.',
        ];
    }
     public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $restrictedPositions = ['barangay_captain', 'barangay_secretary', 'barangay_treasurer', 'sk_chairman'];

            if (in_array($this->position, $restrictedPositions)) {
                $exists = BarangayOfficial::where('term_id', $this->term)
                    ->where('position', $this->position)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'position',
                        ucfirst(str_replace('_', ' ', $this->position)) . ' already exists for the selected term.'
                    );
                }
            }
        });
    }
}

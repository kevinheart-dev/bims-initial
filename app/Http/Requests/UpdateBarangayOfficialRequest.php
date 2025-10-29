<?php

namespace App\Http\Requests;

use App\Models\BarangayOfficial;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBarangayOfficialRequest extends FormRequest
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
            'position'    => ['required', 'string', 'max:100'],

            // Designations for certain positions
            'designations' => ['required_if:position,barangay_kagawad,sk_kagawad', 'array'],
            'designations.*.designation' => ['required_if:position,barangay_kagawad,sk_kagawad', 'exists:puroks,id'],
            'designations.*.term_start'  => ['nullable','digits:4','integer','min:1900','max:'.now()->year],
            'designations.*.term_end'    => ['nullable','digits:4','integer','min:1900','max:'.now()->year],

            'term'             => ['required','exists:barangay_official_terms,id'],
            'appointment_type' => ['required', Rule::in(['elected','appointed','succession'])],

            // If appointed
            'appointed_by'     => ['nullable','string','max:255'],
            'appointment_reason'=> ['nullable','string','max:255'],
            'remarks'          => ['nullable','string','max:500'],
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
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $restrictedPositions = ['barangay_captain', 'barangay_secretary', 'barangay_treasurer', 'sk_chairman'];

            if (in_array($this->position, $restrictedPositions)) {

                $currentOfficial = $this->route('barangay_official'); // use snake_case like the route

                // Only validate uniqueness if position or term changed
                if ($currentOfficial->position !== $this->position || $currentOfficial->term_id != $this->term) {

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
            }
        });
    }
}

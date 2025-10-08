<?php

namespace App\Http\Requests;

use App\Models\Resident;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateDeceasedRequest extends FormRequest
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
        $residentId = $this->route('id'); // from route {id}, this is resident_id

        return [
            'resident_id' => [
                'required',
                'exists:residents,id',
                Rule::unique('deceaseds', 'resident_id')->ignore($residentId, 'resident_id'),
            ],
            'date_of_death' => ['required', 'date'],
            'cause_of_death' => ['nullable', 'string'],
            'place_of_death' => ['nullable', 'string'],
            'burial_place' => ['nullable', 'string'],
            'burial_date' => ['nullable', 'date'],
            'death_certificate_number' => ['nullable', 'string'],
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

    public function withValidator($validator)
    {
        $validator->after(function (Validator $validator) {
            $residentId  = $this->input('resident_id');
            $dateOfDeath = $this->input('date_of_death');

            if ($residentId && $dateOfDeath) {
                $resident = Resident::find($residentId);

                if ($resident && $resident->birthdate) {
                    $deathDate = Carbon::parse($dateOfDeath);
                    $birthDate = Carbon::parse($resident->birthdate);

                    if ($deathDate->lt($birthDate)) {
                        $validator->errors()->add(
                            'date_of_death',
                            'The date of death cannot be before the resident’s birthdate.'
                        );
                    }
                }
            }
        });
    }
}

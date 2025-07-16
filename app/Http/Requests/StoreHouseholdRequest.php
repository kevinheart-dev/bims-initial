<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHouseholdRequest extends FormRequest
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
            // SECTION 5: Housing Information
            'resident_id' => ['required', 'exists:residents,id'],
            'housenumber' => ['required', 'string', 'max:55', 'unique:households,house_number'],
            'street_id' => ['required', 'exists:streets,id'],
            'purok_id' => ['required', 'exists:puroks,id'],
            'subdivision' => ['nullable', 'string', 'max:100'],

            'ownership_type' => ['required', 'string', 'max:55'],
            'housing_condition' => ['required', Rule::in(['good', 'needs repair', 'dilapidated'])],
            'house_structure' => ['required', Rule::in(['concrete', 'semi_concrete', 'wood', 'makeshift'])],
            'year_established' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'number_of_rooms' => ['required', 'integer', 'min:1', 'max:100'],
            'number_of_floors' => ['required', 'integer', 'min:1', 'max:10'],
            'bath_and_wash_area' => ['required', 'string', 'max:100'],
            'waste_management_types' => ['required','array'],
            'waste_management_types.*.waste_management_type' => ['required', 'string', 'max:55'],
            'toilets' => ['required','array'],
            'toilets.*.toilet_type' => ['required', 'string', 'max:55'],
            'electricity_types' => ['required','array'],
            'electricity_types.*.electricity_type' => ['required', 'string', 'max:55'],
            'water_source_types' => ['required','array'],
            'water_source_types.*.water_source_type' => ['required', 'string', 'max:55'],
            'type_of_internet' => ['required', 'string', 'max:100'],


            // SECTION 5.1: Livestock information
            'livestocks' => ['nullable', 'array'],
            'livestocks.*.livestock_type' => ['nullable', 'string', 'max:100'],
            'livestocks.*.quantity' => ['nullable', 'integer', 'min:1', 'max:100'],

            // SECTION 5.2: Pets information
            'pets' => ['nullable', 'array'],
            'pets.*.pet_type' => ['nullable', 'string', 'max:100'],
            'pets.*.is_vaccinated' => ['nullable', 'boolean'],
            'pets.*.quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}

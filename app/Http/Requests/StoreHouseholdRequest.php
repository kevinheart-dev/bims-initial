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
            'housing_condition' => ['required', Rule::in(['good', 'needs_repair', 'dilapidated'])],
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
            'livestocks.*.purpose' => ['nullable', 'string', 'max:55'],

            // SECTION 5.2: Pets information
            'pets' => ['nullable', 'array'],
            'pets.*.pet_type' => ['nullable', 'string', 'max:100'],
            'pets.*.is_vaccinated' => ['nullable', 'boolean'],
        ];
    }
    public function messages(): array
    {
        return [
            // SECTION 5: Housing Information
            'resident_id.required' => 'Please select a resident.',
            'resident_id.exists' => 'The selected resident does not exist in our records.',

            'housenumber.required' => 'Please enter the house number.',
            'housenumber.string' => 'The house number must be a valid string.',
            'housenumber.max' => 'The house number must not exceed 55 characters.',
            'housenumber.unique' => 'This house number is already registered.',

            'street_id.required' => 'Please select a street.',
            'street_id.exists' => 'The selected street does not exist.',

            'purok_id.required' => 'Please select a purok.',
            'purok_id.exists' => 'The selected purok does not exist.',

            'subdivision.string' => 'The subdivision must be a valid string.',
            'subdivision.max' => 'The subdivision name must not exceed 100 characters.',

            'ownership_type.required' => 'Please select an ownership type.',
            'ownership_type.string' => 'The ownership type must be a valid string.',
            'ownership_type.max' => 'The ownership type must not exceed 55 characters.',

            'housing_condition.required' => 'Please select the housing condition.',
            'housing_condition.in' => 'The housing condition must be good, needs repair, or dilapidated.',

            'house_structure.required' => 'Please select the house structure.',
            'house_structure.in' => 'The house structure must be concrete, semi_concrete, wood, or makeshift.',

            'year_established.digits' => 'The year established must be exactly 4 digits.',
            'year_established.integer' => 'The year established must be a valid number.',
            'year_established.min' => 'The year established cannot be earlier than 1900.',
            'year_established.max' => 'The year established cannot be later than the current year.',

            'number_of_rooms.required' => 'Please enter the number of rooms.',
            'number_of_rooms.integer' => 'The number of rooms must be an integer.',
            'number_of_rooms.min' => 'There must be at least 1 room.',
            'number_of_rooms.max' => 'The number of rooms must not exceed 100.',

            'number_of_floors.required' => 'Please enter the number of floors.',
            'number_of_floors.integer' => 'The number of floors must be an integer.',
            'number_of_floors.min' => 'There must be at least 1 floor.',
            'number_of_floors.max' => 'The number of floors must not exceed 10.',

            'bath_and_wash_area.required' => 'Please specify the bath and wash area.',
            'bath_and_wash_area.string' => 'The bath and wash area must be a valid string.',
            'bath_and_wash_area.max' => 'The bath and wash area must not exceed 100 characters.',

            'waste_management_types.required' => 'Please select at least one waste management type.',
            'waste_management_types.array' => 'Waste management types must be in an array format.',
            'waste_management_types.*.waste_management_type.required' => 'Please provide a waste management type.',
            'waste_management_types.*.waste_management_type.string' => 'Waste management type must be a valid string.',
            'waste_management_types.*.waste_management_type.max' => 'Waste management type must not exceed 55 characters.',

            'toilets.required' => 'Please select at least one toilet type.',
            'toilets.array' => 'Toilets must be in an array format.',
            'toilets.*.toilet_type.required' => 'Please provide a toilet type.',
            'toilets.*.toilet_type.string' => 'Toilet type must be a valid string.',
            'toilets.*.toilet_type.max' => 'Toilet type must not exceed 55 characters.',

            'electricity_types.required' => 'Please select at least one electricity type.',
            'electricity_types.array' => 'Electricity types must be in an array format.',
            'electricity_types.*.electricity_type.required' => 'Please provide an electricity type.',
            'electricity_types.*.electricity_type.string' => 'Electricity type must be a valid string.',
            'electricity_types.*.electricity_type.max' => 'Electricity type must not exceed 55 characters.',

            'water_source_types.required' => 'Please select at least one water source type.',
            'water_source_types.array' => 'Water source types must be in an array format.',
            'water_source_types.*.water_source_type.required' => 'Please provide a water source type.',
            'water_source_types.*.water_source_type.string' => 'Water source type must be a valid string.',
            'water_source_types.*.water_source_type.max' => 'Water source type must not exceed 55 characters.',

            'type_of_internet.required' => 'Please specify the type of internet.',
            'type_of_internet.string' => 'The type of internet must be a valid string.',
            'type_of_internet.max' => 'The type of internet must not exceed 100 characters.',

            // SECTION 5.1: Livestock information
            'livestocks.array' => 'Livestocks must be in an array format.',
            'livestocks.*.livestock_type.string' => 'The livestock type must be a valid string.',
            'livestocks.*.livestock_type.max' => 'The livestock type must not exceed 100 characters.',
            'livestocks.*.quantity.integer' => 'The quantity must be an integer.',
            'livestocks.*.quantity.min' => 'The quantity must be at least 1.',
            'livestocks.*.quantity.max' => 'The quantity must not exceed 100.',
            'livestocks.*.purpose.string' => 'The purpose must be a valid string.',
            'livestocks.*.purpose.max' => 'The purpose must not exceed 55 characters.',

            // SECTION 5.2: Pets information
            'pets.array' => 'Pets must be in an array format.',
            'pets.*.pet_type.string' => 'The pet type must be a valid string.',
            'pets.*.pet_type.max' => 'The pet type must not exceed 100 characters.',
            'pets.*.is_vaccinated.boolean' => 'The vaccination field must be true or false.',
        ];
    }
}

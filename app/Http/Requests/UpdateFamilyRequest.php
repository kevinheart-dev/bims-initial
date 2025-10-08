<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFamilyRequest extends FormRequest
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
            // Head of Household
            'resident_id' => ['required', 'exists:residents,id'],

            // Family Members (array of members)
            'members' => ['required', 'array'],
            'members.*.resident_id' => ['required', 'exists:residents,id'],
            'members.*.relationship_to_head' => ['required', 'string'],
            'members.*.household_position' => ['required', 'string'],
        ];
    }

    public function attributes(): array
    {
        $attributes = [
            'resident_id' => 'household head',
            'resident_name' => 'household head name',
            'resident_image' => 'household head image',
            'birthdate' => 'household head birthdate',
            'purok_number' => 'purok number',
            'house_number' => 'house number',
        ];

        // Add member-specific labels
        if ($this->has('members')) {
            foreach ($this->input('members') as $index => $member) {
                $row = $index + 1;
                $attributes["members.$index.resident_id"] = "member #$row resident";
                $attributes["members.$index.resident_name"] = "member #$row name";
                $attributes["members.$index.resident_image"] = "member #$row image";
                $attributes["members.$index.birthdate"] = "member #$row birthdate";
                $attributes["members.$index.purok_number"] = "member #$row purok number";
                $attributes["members.$index.relationship_to_head"] = "member #$row relationship to head";
                $attributes["members.$index.household_position"] = "member #$row household position";
            }
        }

        return $attributes;
    }

    public function messages(): array
    {
        return [
            'members.required' => 'Please add at least one family member.',
            'members.*.resident_id.required' => 'Each member must have a resident selected.',
            'resident_id.exists' => 'The selected resident is invalid.',
            'members.*.relationship_to_head.required' => 'Relationship to head is required.',
            'members.*.household_position.required' => 'Household position is required.',
        ];
    }
}

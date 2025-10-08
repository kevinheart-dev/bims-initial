<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FamilyTreeStoreRequest extends FormRequest
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
            'resident_id' => 'required|exists:residents,id',
            'related_to' => 'required|exists:residents,id',
            'relationship' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Please select a resident.',
            'resident_id.exists' => 'Selected resident is invalid.',
            'related_to.required' => 'Please select a related resident.',
            'related_to.exists' => 'Selected related resident is invalid.',
            'relationship.required' => 'Relationship field is required.',
        ];
    }
}

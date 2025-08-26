<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBarangayFacilityRequest extends FormRequest
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
            'facilities' => ['required', 'array', 'min:1'],
            'facilities.*.facility_image' => ['nullable', 'image', 'max:5120'],
            'facilities.*.name' => ['required', 'string', 'max:100'],
            'facilities.*.facility_type' => ['required', 'string', 'max:55'],
            'facilities.*.quantity' => ['required', 'integer', 'min:0'],
        ];
    }
    public function attributes(): array
    {
        return [
            'facilities' => 'facilities list',
            'facilities.*.facility_image' => 'facility image',
            'facilities.*.name' => 'facility name',
            'facilities.*.facility_type' => 'facility type',
            'facilities.*.quantity' => 'facility quantity',
        ];
    }

    public function messages(): array
    {
        return [
            'facilities.required' => 'At least one facility must be provided.',
            'facilities.*.name.required' => 'Facility name is required.',
            'facilities.*.facility_type.required' => 'Facility type is required.',
            'facilities.*.quantity.required' => 'Facility quantity is required.',
        ];
    }
}

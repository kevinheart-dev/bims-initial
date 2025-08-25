<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangayInfrastructureRequest extends FormRequest
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
            'infrastructure_id' => ['required', 'exists:barangay_infrastructures,id'],
            'infrastructures' => ['required', 'array', 'min:1'],
            'infrastructures.*.infrastructure_image' => ['nullable', 'image', 'max:5120'],
            'infrastructures.*.infrastructure_type' => ['required', 'string', 'max:100'],
            'infrastructures.*.infrastructure_category' => ['required', 'string', 'max:55'],
            'infrastructures.*.quantity' => ['required', 'integer', 'min:0'],
        ];
    }
    public function attributes(): array
    {
        return [
            'infrastructures' => 'infrastructures list',
            'infrastructures.*.infrastructure_image' => 'infrastructure image',
            'infrastructures.*.infrastructure_type' => 'infrastructure type',
            'infrastructures.*.infrastructure_category' => 'infrastructure category',
            'infrastructures.*.quantity' => 'infrastructure quantity',
        ];
    }
    public function messages(): array
    {
        return [
            'infrastructures.required' => 'Please add at least one infrastructure.',
            'infrastructures.*.infrastructure_type.required' => 'The type of infrastructure is required.',
            'infrastructures.*.infrastructure_category.required' => 'The category of infrastructure is required.',
            'infrastructures.*.quantity.required' => 'Please enter the quantity.',
            'infrastructures.*.quantity.integer' => 'Quantity must be a number.',
            'infrastructures.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}

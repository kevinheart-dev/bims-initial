<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBodiesOFWaterRequest extends FormRequest
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
            'water_id' =>  ['nullable', 'integer'],
            'bodiesOfWater' => ['required', 'array', 'min:1'],
            'bodiesOfWater.*.name' => ['required', 'string', 'max:255'],
            'bodiesOfWater.*.type' => ['required', 'string', 'max:255'],
            'bodiesOfWater.*.exists' => ['nullable', 'boolean'],
            'barangay_id' => ['nullable', 'integer', 'exists:barangays,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'bodiesOfWater.*.name' => 'body of water name',
            'bodiesOfWater.*.type' => 'body of water type',
        ];
    }

    public function messages(): array
    {
        return [
            'bodiesOfWater.required' => 'Please add at least one body of water entry.',
            'bodiesOfWater.*.name.required' => 'The body of water name is required.',
            'bodiesOfWater.*.type.required' => 'The body of water type is required.',
        ];
    }
}

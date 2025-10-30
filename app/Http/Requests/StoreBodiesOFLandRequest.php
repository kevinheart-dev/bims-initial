<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBodiesOFLandRequest extends FormRequest
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
            'bodiesOfLand' => ['required', 'array', 'min:1'],
            'bodiesOfLand.*.name' => ['required', 'string', 'max:255'],
            'bodiesOfLand.*.type' => ['required', 'string', 'max:255'],
            'bodiesOfLand.*.exists' => ['nullable', 'boolean'],
            'barangay_id' => ['nullable', 'integer', 'exists:barangays,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'bodiesOfLand.*.name' => 'body of water name',
            'bodiesOfLand.*.type' => 'body of water type',
        ];
    }

    public function messages(): array
    {
        return [
            'bodiesOfLand.required' => 'Please add at least one body of water entry.',
            'bodiesOfLand.*.name.required' => 'The body of water name is required.',
            'bodiesOfLand.*.type.required' => 'The body of water type is required.',
        ];
    }
}

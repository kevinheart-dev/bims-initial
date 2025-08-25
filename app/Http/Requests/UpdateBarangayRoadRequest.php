<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangayRoadRequest extends FormRequest
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
            'road_id' => ['required', 'exists:barangay_roads,id'],
            'roads.*.road_type' => ['required', 'in:asphalt,concrete,gravel,natural_earth_surface'],
            'roads.*.length' => ['required', 'numeric', 'min:0.10', 'max:999999.99'],
            'roads.*.condition' => ['required', 'in:good,fair,poor,under_construction,impassable'],
            'roads.*.status' => ['required', 'in:active,inactive'],
            'roads.*.maintained_by' => ['nullable', 'string', 'max:155'],
        ];
    }

    public function attributes(): array
    {
        return [
            'road_id'   => 'road',
            'roads.*.road_type'     => 'road type',
            'roads.*.length'        => 'road length',
            'roads.*.condition'     => 'road condition',
            'roads.*.status'        => 'road status',
            'roads.*.maintained_by' => 'maintained by',
        ];
    }

    public function messages(): array
    {
        return [
            'road_id.exists'   => 'The selected :attribute does not exist.',
            'roads.*.road_type.required'   => 'Please select a :attribute.',
            'roads.*.road_type.in'         => 'The :attribute must be one of asphalt, concrete, gravel, or natural earth surface.',

            'roads.*.length.required'      => 'The :attribute is required.',
            'roads.*.length.numeric'       => 'The :attribute must be a number.',
            'roads.*.length.min'           => 'The :attribute must be at least :min kilometers.',
            'roads.*.length.max'           => 'The :attribute may not exceed :max kilometers.',

            'roads.*.condition.required'   => 'The :attribute is required.',
            'roads.*.condition.in'         => 'The :attribute must be one of good, fair, poor, under construction, or impassable.',

            'roads.*.status.required'      => 'The :attribute is required.',
            'roads.*.status.in'            => 'The :attribute must be either active or inactive.',

            'roads.*.maintained_by.string' => 'The :attribute must be a valid text.',
            'roads.*.maintained_by.max'    => 'The :attribute may not exceed :max characters.',
        ];
    }
}

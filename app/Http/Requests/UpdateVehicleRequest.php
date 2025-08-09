<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
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
            'resident_id' => ['required', 'exists:residents,id'],
            'vehicles' => ['required', 'array', 'min:1'],
            'vehicles.*.vehicle_type' => ['required', 'in:Motorcycle,Tricycle,Car,Jeep,Truck,Bicycle'],
            'vehicles.*.vehicle_class' => ['required', 'in:private,public'],
            'vehicles.*.usage_status' => ['required', 'in:personal,public_transport,business_use'],
            'vehicles.*.is_registered' => ['required', Rule::in([1, 0])],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'Resident selection is required.',
            'resident_id.exists' => 'The selected resident does not exist.',
            'vehicles.required' => 'At least one vehicle must be added.',
            'vehicles.*.vehicle_type.required' => 'Vehicle type is required.',
            'vehicles.*.vehicle_class.required' => 'Vehicle classification is required.',
            'vehicles.*.usage_status.required' => 'Vehicle usage purpose is required.',
            'vehicles.*.is_registered' => 'vehicle registration status',
        ];
    }

    public function attributes(): array
    {
        $attributes = [
            'resident_id' => 'resident',
        ];

        foreach (range(0, 10) as $i) {
            $attributes["vehicles.$i.vehicle_type"] = "Vehicle Type #" . ($i + 1);
            $attributes["vehicles.$i.vehicle_class"] = "Classification #" . ($i + 1);
            $attributes["vehicles.$i.usage_status"] = "Usage Purpose #" . ($i + 1);
            $attributes["vehicles.$i.is_registered"] = "Registration Status #" . ($i + 1);
        }

        return $attributes;
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMedicalInformationRequest extends FormRequest
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

            // SECTION 4: Health Information
            'weight_kg' => ['required', 'numeric', 'min:0', 'max:300'],
            'height_cm' => ['required', 'numeric', 'min:0', 'max:500'],
            'bmi' => ['nullable', 'numeric'], // better to calculate in backend
            'nutrition_status' => ['required', Rule::in([
                'normal', 'underweight', 'severely_underweight', 'overweight', 'obese'
            ])],

            'emergency_contact_number' => ['required', 'string', 'max:11'],
            'emergency_contact_name' => ['required', 'string', 'max:255'],
            'emergency_contact_relationship' => ['required', 'string', 'max:100'],
            'blood_type' => ['nullable', Rule::in([
                'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
            ])],

            'has_philhealth' => ['required', Rule::in([0, 1])],
            'philhealth_id_number' => ['nullable', 'string', 'max:50'],

            'is_alcohol_user' => ['required', Rule::in([0, 1])],
            'is_smoker' => ['required', Rule::in([0, 1])],

            'is_pwd' => ['required', Rule::in([0, 1])],
            'pwd_id_number' => ['required_if:is_pwd,1', 'string', 'max:15'],

            'disabilities' => ['required_if:is_pwd,1', 'array'],
            'disabilities.*.disability_type' => ['required_with:disabilities', 'string', 'max:100'],

            'has_allergies' => ['required', Rule::in([0, 1])],
            'allergies' => ['required_if:has_allergies,1', 'array'],
            'allergies.*.allergy_name' => ['required_with:allergies', 'string', 'max:100'],
            'allergies.*.reaction_description' => ['nullable', 'string', 'max:1000'],

            'has_medication' => ['required', Rule::in([0, 1])],
            'medications' => ['required_if:has_medication,1', 'array'],
            'medications.*.medication' => ['required_with:medications', 'string', 'max:100'],
            'medications.*.start_date' => ['nullable', 'date', 'before_or_equal:today'],
            'medications.*.end_date' => ['nullable', 'date', 'before_or_equal:today'],

            'has_medical_condition' => ['required', Rule::in([0, 1])],
            'medical_conditions' => ['required_if:has_medical_condition,1', 'array'],
            'medical_conditions.*.condition' => ['required_with:medical_conditions', 'string', 'max:100'],
            'medical_conditions.*.status' => ['required_with:medical_conditions', Rule::in(['active', 'resolved', 'chronic'])],
            'medical_conditions.*.diagnosed_date' => ['nullable', 'date', 'before_or_equal:today'],
            'medical_conditions.*.resolved_date' => ['nullable', 'date', 'before_or_equal:today'],

            'has_vaccination' => ['required', Rule::in([0, 1])],
            'vaccinations' => ['required_if:has_vaccination,1', 'array'],
            'vaccinations.*.vaccine' => ['required_with:vaccinations', 'string', 'max:100'],
            'vaccinations.*.vaccination_date' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'resident_id.required' => 'A resident must be selected.',
            'resident_id.exists' => 'The selected resident does not exist.',

            'weight_kg.required' => 'Weight is required.',
            'weight_kg.numeric' => 'Weight must be a number.',
            'weight_kg.max' => 'Weight cannot exceed 300 kg.',

            'height_cm.required' => 'Height is required.',
            'height_cm.numeric' => 'Height must be a number.',
            'height_cm.max' => 'Height cannot exceed 500 cm.',

            'bmi.numeric' => 'BMI must be a number.',

            'nutrition_status.required' => 'Nutrition status is required.',
            'nutrition_status.in' => 'Invalid nutrition status selected.',

            'emergency_contact_number.required' => 'Emergency contact number is required.',
            'emergency_contact_number.digits_between' => 'Emergency contact number must be between 7 and 15 digits.',
            'emergency_contact_name.required' => 'Emergency contact name is required.',
            'emergency_contact_relationship.required' => 'Emergency contact relationship is required.',

            'blood_type.in' => 'Invalid blood type selected.',

            'has_philhealth.in' => 'Invalid value for PhilHealth field.',
            'philhealth_id_number.max' => 'PhilHealth ID number cannot exceed 50 characters.',

            'is_smoker.in' => 'Invalid value for smoker field.',
            'is_alcohol_user.in' => 'Invalid value for alcohol user field.',

            'is_pwd.in' => 'Invalid value for PWD field.',
            'pwd_id_number.required_if' => 'PWD ID number is required if the resident is a PWD.',

            'disabilities.required_if' => 'Disability details are required if the resident is a PWD.',
            'disabilities.*.disability_type.required_with' => 'Each disability entry must have a type.',

            'allergies.required_if' => 'Allergy details are required if allergies exist.',
            'allergies.*.allergy.required_with' => 'Each allergy entry must have a name.',
            'allergies.*.reaction_description.string' => 'Reaction description must be text.',

            'medications.required_if' => 'Medication details are required if the resident is on medication.',
            'medications.*.medication.required_with' => 'Each medication entry must have a name.',
            'medications.*.start_date.before_or_equal' => 'Medication start date cannot be in the future.',
            'medications.*.end_date.before_or_equal' => 'Medication end date cannot be in the future.',

            'medical_conditions.required_if' => 'Medical condition details are required if medical conditions exist.',
            'medical_conditions.*.condition.required_with' => 'Each condition entry must have a name.',
            'medical_conditions.*.status.in' => 'Condition status must be active, resolved, or chronic.',
            'medical_conditions.*.diagnosed_date.before_or_equal' => 'Diagnosed date cannot be in the future.',
            'medical_conditions.*.resolved_date.before_or_equal' => 'Resolved date cannot be in the future.',

            'vaccinations.required_if' => 'Vaccination details are required if vaccinations exist.',
            'vaccinations.*.vaccine.required_with' => 'Each vaccination entry must have a vaccine name.',
            'vaccinations.*.vaccination_date.before_or_equal' => 'Vaccination date cannot be in the future.',
        ];
    }
}

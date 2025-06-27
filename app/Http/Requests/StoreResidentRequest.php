<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResidentRequest extends FormRequest
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
        // SECTION 1: Personal Information
        'resident_image' => ['nullable', 'image', 'max:5120'], // 5MB max
        'lastname' => ['required', 'string', 'max:55'],
        'firstname' => ['required', 'string', 'max:55'],
        'middlename' => ['nullable', 'string', 'max:55'],
        'suffix' => ['nullable', Rule::in(['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'])],
        'birthdate' => ['required', 'date', 'before:today'],
        'birthplace' => ['required', 'string', 'max:150'],
        'civil_status' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated', 'annulled'])],
        'gender' => ['required', Rule::in(['male', 'female', 'LGBTQ'])],
        'maiden_middle_name' => ['nullable', 'string', 'max:100'],
        'citizenship' => ['required', 'string', 'max:55'],
        'religion' => ['required', 'string', 'max:55'],
        'ethnicity' => ['nullable', 'string', 'max:55'],
        'contactNumber' => ['nullable', 'string', 'max:15'],
        'email' => ['nullable', 'email', 'max:55'],
        'residency_type' => ['required', Rule::in(['permanent', 'temporary', 'migrant'])],
        'residency_date' => ['required', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'is_household_head' => ['required', 'boolean'],
        'is_4ps_beneficiary' => ['required', 'boolean'],
        'is_solo_parent' => ['nullable', 'boolean'],
        'solo_parent_id_number' => ['nullable', 'string', 'max:55'],
        'purok_number' => ['required', 'string', 'max:2'],
        'purok_id' => ['required', 'exists:puroks,id'],
        'registered_voter' => ['required', 'boolean'],
        'voter_status' => ['nullable', Rule::in(['active', 'inactive', 'disqualified', 'medical', 'overseas', 'detained', 'deceased'])],
        'voter_id_number' => ['nullable', 'string', 'max:55'],
        'is_pensioner' => ['nullable', Rule::in(['yes', 'no', 'pending'])],
        'pension_type' => ['nullable', Rule::in(['SSS', 'GSIS', 'DSWD', 'private', 'none'])],
        'osca_id_number' => ['nullable', 'string', 'max:55'],
        'living_alone' => ['nullable', 'boolean'],

        // SECTION 1.1: Vehicle Information
        'vehicles' => ['nullable', 'array'],
        'vehicles.*.vehicle_type' => ['required_with:vehicles', 'string', 'max:100'],
        'vehicles.*.vehicle_class' => ['required_with:vehicles', 'string', 'max:100'],
        'vehicles.*.usage_type' => ['required_with:vehicles', Rule::in(['personal', 'public_transport', 'business_use'])],
        'vehicles.*.quantity' => ['required_with:vehicles', 'integer', 'min:1', 'max:99'],


        // SECTION 2: Educational Information
        'is_student'         => ['required', 'boolean'],
        'school_name'        => ['nullable', 'string', 'max:155'],
        'school_type'        => ['nullable', Rule::in(['public', 'private'])],
        'current_level'      => ['nullable', Rule::in([
            'elementary', 'high_school', 'college', 'vocational', 'post_grad', 'no_formal_education'
        ])],
        'education_status'   => ['nullable', Rule::in(['graduate', 'undergraduate'])],
        'osc'                => ['nullable', 'boolean'],
        'osy'                => ['nullable','boolean'],
        'year_started'       => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'year_ended'         => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'year_graduated'     => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'program'            => ['nullable', 'string', 'max:100'],

        // SECTION 3: Occupational Information
        'occupations' => ['nullable', 'array'],
        'occupations.*.employment_status' => [
            'required_with:occupations.*.occupation',
            Rule::in(['employed', 'unemployed', 'student']),
        ],
        'occupations.*.occupation' => ['nullable', 'string', 'max:100'],
        'occupations.*.employment_type' => [
            'nullable',
            Rule::in(['full_time', 'part_time', 'seasonal', 'contractual', 'self_employed']),
        ],
        'occupations.*.occupation_status' => [
            'nullable',
            Rule::in(['active', 'inactive', 'ended', 'retired']),
        ],
        'occupations.*.work_arrangement' => [
            'nullable',
            Rule::in(['remote', 'on_site', 'hybrid']),
        ],
        'occupations.*.employer' => ['nullable', 'string', 'max:255'],
        'occupations.*.started_at' => ['nullable', 'integer', 'min:1900', 'max:' . now()->year],
        'occupations.*.ended_at' => ['nullable', 'integer', 'min:1900', 'max:' . now()->year],
        'occupations.*.income' => ['nullable', 'numeric', 'min:0'],
        'occupations.*.income_frequency' => ['nullable',  Rule::in(['weekly', 'monthly', 'annually', 'daily', 'bi_weekly'])],

        // SECTION 4: Health Information
        'weight_kg' => ['required', 'numeric', 'min:0', 'max:300'],
        'height_cm' => ['required', 'numeric', 'min:0', 'max:500'],
        'bmi' => ['required', 'numeric'],
        'nutrition_status' => ['required', Rule::in([
            'normal', 'underweight', 'severly_underweight', 'overweight', 'obese'
        ])],

        'emergency_contact_number' => ['required', 'digits_between:7,15'],
        'emergency_contact_name' => ['required', 'string', 'max:255'],
        'emergency_contact_relationship' => ['required', 'string', 'max:100'],
        'blood_type' => ['required', Rule::in([
            'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'
        ])],

        'has_philhealth' => ['required', Rule::in([0, 1])],
        'philhealth_id_number' => ['nullable', 'string', 'max:50'],

        'is_alcohol_user' => ['required', Rule::in([0, 1])],
        'is_smoker' => ['required', Rule::in([0, 1])],

        'is_pwd' => ['required', Rule::in([0, 1])],
        'pwd_id_number' => ['required_if:is_pwd,1', 'nullable', 'string', 'max:10'],

        'disabilities' => ['required_if:is_pwd,1', 'array'],
        'disabilities.*.disability_type' => ['required_with:disabilities', 'string', 'max:100'],

        // SECTION 5: Housing Information
        'housenumber' => ['required', 'integer', 'min:1', 'max:9999'],
        'street_id' => ['required', 'exists:streets,id'],
        'subdivision' => ['nullable', 'string', 'max:100'],

        'ownership_type' => ['required_if:is_household_head,1', 'string', 'max:55'],
        'housing_condition' => ['required_if:is_household_head,1', Rule::in(['good', 'needs repair', 'dilapidated'])],
        'house_structure' => ['required_if:is_household_head,1', Rule::in(['concrete', 'semi_concrete', 'wood', 'makeshift'])],
        'year_established' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
        'number_of_rooms' => ['required_if:is_household_head,1', 'integer', 'min:1', 'max:100'],
        'number_of_floors' => ['required_if:is_household_head,1', 'integer', 'min:1', 'max:10'],
        'bath_and_wash_area' => ['nullable', 'string', 'max:100'],
        'toilet_type' => ['nullable', 'string', 'max:100'],
        'electricity_type' => ['nullable', 'string', 'max:100'],
        'water_source_type' => ['nullable', 'string', 'max:100'],
        'waste_management_type' => ['nullable', 'string', 'max:100'],
        'type_of_internet' => ['nullable', 'string', 'max:100'],

        // SECTION 5.1: Livestock information
        'livestock' => ['nullable', 'array'],
        'livestock.*.livestock_type' => ['required_with:livestock', 'string', 'max:100'],
        'livestock.*.quantity' => ['required_with:livestock', 'integer', 'min:1', 'max:100'],

        // SECTION 5.2: Pets information
        'pets' => ['nullable', 'array'],
        'pets.*.pet_type' => ['required_with:pets', 'string', 'max:100'],
        'pets.*.is_vaccinated' => ['required_with:pets', 'boolean'],
        'pets.*.quantity' => ['required_with:pets', 'integer', 'min:1', 'max:100'],
    ];
}
    public function attributes()
    {
        $attributes = [];

        foreach ($this->input('occupations', []) as $index => $occupation) {
            $attributes["occupations.$index.employment_status"] = "Employment Status #".($index + 1);
            $attributes["occupations.$index.occupation"] = "Occupation #".($index + 1);
            $attributes["occupations.$index.employer"] = "Employer Name #".($index + 1);
            $attributes["occupations.$index.employment_type"] = "Employment Type #".($index + 1);
            $attributes["occupations.$index.occupation_status"] = "Occupation Status #".($index + 1);
            $attributes["occupations.$index.work_arrangement"] = "Work Arrangement #".($index + 1);
            $attributes["occupations.$index.started_at"] = "Started At #".($index + 1);
            $attributes["occupations.$index.ended_at"] = "Ended At #".($index + 1);
            $attributes["occupations.$index.income"] = "Income #".($index + 1);
            $attributes["occupations.$index.income_frequency"] = "Income Frequency #".($index + 1);
            // Add others as needed
        }
        // Disabilities
        foreach ((array) $this->input('disabilities', []) as $index => $disability) {
            $num = $index + 1;
            $attributes["disabilities.$index.disability_type"] = "Disability Type #$num";
        }

        // Livestock and Pets
        foreach ((array) $this->input('livestocks', []) as $index => $disability) {
            $num = $index + 1;
            $attributes["livestocks.$index.livestock_type"] = "Livestock Type #$num";
        }
        foreach ((array) $this->input('pets', []) as $index => $disability) {
            $num = $index + 1;
            $attributes["pets.$index.pet_type"] = "Pet Type #$num";
        }
        return $attributes;
    }

}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResidentHouseholdRequest extends FormRequest
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
            // Household Info
            'housenumber' => ['required', 'string', 'max:55'],
            'subdivision' => ['nullable', 'string', 'max:100'],
            'street' => ['required', 'integer', 'min:1'],
            'purok' => ['required', 'integer', 'min:1'],
            'householdCount' => ['required', 'integer', 'min:1'],

            // Family Info
            'family_name' => ['required', 'string', 'max:100'],
            'family_type' => ['required', Rule::in(['nuclear', 'extended', 'single_parent', 'others'])],
            'family_monthly_income' => ['required', 'numeric', 'min:0'],
            'income_bracket' => ['required', 'string', 'max:155'],
            'income_category' => ['required', 'string', 'max:155'],

            // Housing Structure
            'ownership_type' => ['required', 'string', 'max:100'],
            'housing_condition' => ['required', Rule::in(['good', 'needs_repair', 'dilapidated'])],
            'house_structure' => ['required', Rule::in(['concrete', 'semi_concrete', 'wood', 'makeshift'])],
            'year_established' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'number_of_rooms' => ['required', 'integer', 'min:1', 'max:100'],
            'number_of_floors' => ['required', 'integer', 'min:1', 'max:10'],
            'bath_and_wash_area' => ['required', 'string', 'max:100'],
            'type_of_internet' => ['nullable', 'string', 'max:100'],

            // Utilities
            'toilets' => ['nullable', 'array'],
            'toilets.*.toilet_type' => ['required', 'string', 'max:100'],

            'electricity_types' => ['nullable', 'array'],
            'electricity_types.*.electricity_type' => ['required', 'string', 'max:100'],

            'water_source_types' => ['nullable', 'array'],
            'water_source_types.*.water_source_type' => ['required', 'string', 'max:100'],

            'waste_management_types' => ['nullable', 'array'],
            'waste_management_types.*.waste_management_type' => ['required', 'string', 'max:100'],

            // Pets
            'has_pets' => ['required', Rule::in([0, 1])],
            'pets' => ['nullable', 'array'],
            'pets.*.pet_type' => ['required', 'string', 'max:100'],
            'pets.*.is_vaccinated' => ['required', Rule::in([0, 1])],

            // Livestock
            'has_livestock' => ['required', Rule::in([0, 1])],
            'livestocks' => ['nullable', 'array'],
            'livestocks.*.livestock_type' => ['required_with:livestocks', 'string', 'max:100'],
            'livestocks.*.quantity' => ['required_with:livestocks', 'integer', 'min:1', 'max:999'],
            'livestocks.*.purpose' => ['required_with:livestocks', Rule::in(['personal_consumption', 'commercial', 'both'])],


            // Verification
            'verified' => ['required', Rule::in([0, 1])],

            // Members (residents of the household)
            'members' => ['required', 'array', 'min:1'],
            'members.*.resident_image' => ['nullable', 'image', 'max:5120'],
            'members.*.lastname' => ['required', 'string', 'max:55'],
            'members.*.firstname' => ['required', 'string', 'max:55'],
            'members.*.middlename' => ['nullable', 'string', 'max:55'],
            'members.*.suffix' => ['nullable', Rule::in(['Jr.', 'Sr.', 'I', 'II', 'III', 'IV'])],
            'members.*.birthdate' => ['required', 'date', 'before:today'],
            'members.*.birthplace' => ['required', 'string', 'max:150'],
            'members.*.civil_status' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated', 'annulled'])],
            'members.*.gender' => ['required', Rule::in(['male', 'female', 'LGBTQ'])],
            'members.*.maiden_middle_name' => ['nullable', 'string', 'max:100'],
            'members.*.citizenship' => ['required', 'string', 'max:55'],
            'members.*.religion' => ['required', 'string', 'max:55'],
            'members.*.ethnicity' => ['nullable', 'string', 'max:55'],
            'members.*.contactNumber' => ['nullable', 'string', 'max:15'],
            'members.*.email' => ['nullable', 'email', 'min:10', 'max:55', 'unique:residents,email'],
            'members.*.is_pensioner' => ['nullable', Rule::in(['yes', 'no'])],
            'members.*.osca_id_number' => ['nullable', 'string', 'max:55'],
            'members.*.pension_type' => ['nullable', Rule::in(['SSS', 'GSIS', 'DSWD', 'private', 'none'])],
            'members.*.living_alone' => ['nullable', Rule::in([0, 1])],
            'members.*.residency_type' => ['required', Rule::in(['permanent', 'temporary', 'migrant'])],
            'members.*.residency_date' => ['required', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'members.*.is_family_head' => ['required', Rule::in([0, 1])],
            'members.*.relation_to_household_head' => ['required', Rule::in(['self', 'spouse', 'child', 'sibling', 'parent', 'parent_in_law','grandparent'])],
            'members.*.registered_voter' => ['required', Rule::in([0, 1])],
            'members.*.registered_barangay' => ['required_if:members.*.registered_voter,1'],
            'members.*.voter_id_number' => ['nullable', 'string', 'max:55'],
            'members.*.voting_status' => ['nullable', Rule::in(['active', 'inactive', 'disqualified', 'medical', 'overseas', 'detained', 'deceased'])],
            'members.*.is_household_head' => ['required', Rule::in([0, 1])],
            'members.*.household_position' => ['required', 'string', 'max:55'],
            'members.*.is_4ps_benificiary' => ['required', Rule::in([0, 1])],
            'members.*.is_solo_parent' => ['required', Rule::in([0, 1])],
            'members.*.solo_parent_id_number' => ['nullable', 'string', 'max:55'],
            'members.*.has_vehicle' => ['required', Rule::in([0, 1])],
            'members.*.vehicles.*.vehicle_type' => ['required', 'string', 'max:55'],
            'members.*.vehicles.*.vehicle_class' => ['required', 'string', 'max:55'],
            'members.*.vehicles.*.usage_status' => ['required', 'string', 'max:55'],
            'members.*.vehicles.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],

            // educaiton
            'members.*.educations' => ['nullable', 'array'],
            'members.*.educations.*.education' => ['required', Rule::in(['no_education_yet','no_formal_education','prep_school','kindergarten','elementary',
                'high_school','senior_high_school','college','als','tesda','vocational','post_graduate',])],
            'members.*.educations.*.educational_status' => ['nullable', Rule::in(['graduated', 'incomplete', 'enrolled', 'dropped_out'])],
            'members.*.educations.*.school_name' => ['nullable', 'string', 'max:150'],
            'members.*.educations.*.school_type' => ['nullable', Rule::in(['public', 'private'])],
            'members.*.educations.*.year_started' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'members.*.educations.*.year_ended' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'members.*.educations.*.program' => ['nullable', 'string', 'max:150'],

            // occupations
            'members.*.occupations' => ['nullable', 'array'],
            'members.*.occupations.*.employment_status' => ['required', Rule::in(['employed', 'unemployed', 'under_employed', 'retired'])],
            'members.*.occupations.*.occupation' => ['nullable', 'string', 'max:100'],
            'members.*.occupations.*.employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'seasonal', 'contractual', 'self_employed'])],
            'members.*.occupations.*.occupation_status' => ['nullable', Rule::in(['active', 'inactive', 'ended', 'retired'])],
            'members.*.occupations.*.work_arrangement' => ['nullable', Rule::in(['remote', 'on_site', 'hybrid'])],
            'members.*.occupations.*.employer' => ['nullable', 'string', 'max:100'],
            'members.*.occupations.*.started_at' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'members.*.occupations.*.ended_at' => ['nullable', 'digits:4', 'integer', 'min:1900', 'max:' . now()->year],
            'members.*.occupations.*.frequency' => ['nullable', Rule::in(['daily', 'weekly', 'bi-weekly', 'monthly'])],
            'members.*.occupations.*.income' => ['nullable', 'numeric', 'min:0'],
            'members.*.occupations.*.monthly_income' => ['nullable', 'numeric', 'min:0'],
            'members.*.occupations.*.is_ofw' => ['required', Rule::in([0, 1])],
            'members.*.weight_kg' => ['required', 'numeric', 'min:0', 'max:300'],
            'members.*.height_cm' => ['required', 'numeric', 'min:0', 'max:300'],
            'members.*.bmi' => ['required', 'numeric', 'min:0', 'max:300'],
            'members.*.nutrition_status' => ['required', 'string', 'max:100'],
            'members.*.emergency_contact_number' => ['required', 'digits_between:7,15'],
            'members.*.emergency_contact_name' => ['required', 'string', 'max:255'],
            'members.*.emergency_contact_relationship' => ['required', 'string', 'max:100'],
            'members.*.blood_type' => ['nullable', Rule::in(['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'])],
            'members.*.has_philhealth' => ['required', Rule::in([0, 1])],
            'members.*.philhealth_id_number' => ['nullable', 'string', 'max:50'],
            'members.*.is_alcohol_user' => ['required', Rule::in([0, 1])],
            'members.*.is_smoker' => ['required', Rule::in([0, 1])],
            'members.*.is_pwd' => ['required', Rule::in([0, 1])],
            'members.*.pwd_id_number' => ['required_if:is_pwd,1', 'nullable', 'string', 'max:10'],
            'members.*.disabilities' => ['required_if:is_pwd,1', 'array'],
            'members.*.disabilities.*.disability_type' => ['required_with:disabilities', 'string', 'max:100'],
        ];
    }

    public function attributes()
    {
        $attributes = [];

        // Members
        foreach ((array) $this->input('members', []) as $index => $member) {
            $n = $index + 1;
            $attributes["members.$index.lastname"] = "Last name of household member #$n";
            $attributes["members.$index.firstname"] = "First name of household member #$n";
            $attributes["members.$index.middlename"] = "Middle name of household member #$n";
            $attributes["members.$index.suffix"] = "Suffix of household member #$n";
            $attributes["members.$index.birthdate"] = "Birthdate of household member #$n";
            $attributes["members.$index.birthplace"] = "Birthplace of household member #$n";
            $attributes["members.$index.civil_status"] = "Civil status of household member #$n";
            $attributes["members.$index.gender"] = "Gender of household member #$n";
            $attributes["members.$index.maiden_middle_name"] = "Maiden middle name of household member #$n";
            $attributes["members.$index.citizenship"] = "Citizenship of household member #$n";
            $attributes["members.$index.religion"] = "Religion of household member #$n";
            $attributes["members.$index.ethnicity"] = "Ethnicity of household member #$n";
            $attributes["members.$index.contactNumber"] = "Contact number of household member #$n";
            $attributes["members.$index.email"] = "Email of household member #$n";
            $attributes["members.$index.residency_type"] = "Residency type of household member #$n";
            $attributes["members.$index.residency_date"] = "Residency year of household member #$n";
            $attributes["members.$index.is_family_head"] = "Family status of household member #$n";
            $attributes["members.$index.relation_to_household_head"] = "Relation to the Head of household member #$n";
            $attributes["members.$index.registered_voter"] = "Voter registration of household member #$n";
            $attributes["members.$index.registered_barangay"] = "Voter Status of household member #$n";
            $attributes["members.$index.voter_id_number"] = "Voter ID number of household member #$n";
            $attributes["members.$index.voting_status"] = "Voting status of household member #$n";
            $attributes["members.$index.is_household_head"] = "Is household head for household member #$n";
            $attributes["members.$index.household_position"] = "Household position for household member #$n";
            $attributes["members.$index.is_4ps_benificiary"] = "4Ps beneficiary of household member #$n";
            $attributes["members.$index.is_solo_parent"] = "Solo parent status of household member #$n";
            $attributes["members.$index.solo_parent_id_number"] = "Solo parent ID of household member #$n";
            $attributes["members.$index.has_vehicle"] = "Has vehicle status for household member #$n";
            $attributes["members.$index.resident_image"] = "Profile photo of household member #$n";
            $attributes["members.$index.weight_kg"] = "Weight of household member #$n";
            $attributes["members.$index.height_cm"] = "Height of household member #$n";
            $attributes["members.$index.bmi"] = "BMI of household member #$n";
            $attributes["members.$index.nutrition_status"] = "Nutrition status of household member #$n";
            $attributes["members.$index.emergency_contact_number"] = "Emergency number of household member #$n";
            $attributes["members.$index.emergency_contact_name"] = "Contact name of household member #$n";
            $attributes["members.$index.emergency_contact_relationship"] = "Contact relationship of household member #$n";
            $attributes["members.$index.blood_type"] = "Blood type of household member #$n";
            $attributes["members.$index.has_philhealth"] = "PhilHealth status of household member #$n";
            $attributes["members.$index.philhealth_id_number"] = "PhilHealth ID Number of household member #$n";
            $attributes["members.$index.is_alcohol_user"] = "Alcohol usage status of household member #$n";
            $attributes["members.$index.is_smoker"] = "Smoking status of household member #$n";
            $attributes["members.$index.is_pwd"] = "Disability status of household member #$n";
            $attributes["members.$index.pwd_id_number"] = "PWD ID of household member #$n";

            // Member Vehicles
            foreach ((array) ($member['vehicles'] ?? []) as $vIndex => $vehicle) {
                $attributes["members.$index.vehicles.$vIndex.vehicle_type"] = "Vehicle type of member #$n (vehicle #".($vIndex + 1).")";
                $attributes["members.$index.vehicles.$vIndex.vehicle_class"] = "Vehicle class of member #$n (vehicle #".($vIndex + 1).")";
                $attributes["members.$index.vehicles.$vIndex.usage_status"] = "Vehicle usage status of member #$n (vehicle #".($vIndex + 1).")";
                $attributes["members.$index.vehicles.$vIndex.quantity"] = "Vehicle quantity of member #$n (vehicle #".($vIndex + 1).")";
            }

            // Member Educations
            foreach ((array) ($member['educations'] ?? []) as $eduIndex => $edu) {
                $attributes["members.$index.educations.$eduIndex.education"] = "Educational attainment of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.educational_status"] = "Educational status of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.school_name"] = "School name of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.school_type"] = "School type of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.year_started"] = "Year started of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.year_ended"] = "Year ended of member #$n (education #" . ($eduIndex + 1) . ")";
                $attributes["members.$index.educations.$eduIndex.program"] = "Finished course of member #$n (education #" . ($eduIndex + 1) . ")";
            }

            // Member Occupations
            foreach ((array) ($member['occupations'] ?? []) as $oIndex => $occupation) {
                $attributes["members.$index.occupations.$oIndex.employment_status"] = "Employment status of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.occupation"] = "Occupation of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.employment_type"] = "Employment type of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.occupation_status"] = "Occupation status of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.work_arrangement"] = "Work arrangement of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.employer"] = "Employer of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.started_at"] = "Start year of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.ended_at"] = "End year of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.frequency"] = "Income frequency of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.income"] = "Income of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.monthly_income"] = "Monthly income of member #$n (occupation #" . ($oIndex + 1) . ")";
                $attributes["members.$index.occupations.$oIndex.is_ofw"] = "OFW status of member #$n (occupation #" . ($oIndex + 1) . ")";
            }

            foreach ((array) ($member['disabilities'] ?? []) as $dIndex => $disability) {
                $attributes["members.$index.disabilities.$dIndex.disability_type"] = "Disability type of household member #$n (disability #".($dIndex + 1).")";
            }
        }

        // Toilets
        foreach ((array) $this->input('toilets', []) as $index => $toilet) {
            $attributes["toilets.$index.toilet_type"] = "Toilet type #".($index + 1);
        }

        // Electricity
        foreach ((array) $this->input('electricity_types', []) as $index => $item) {
            $attributes["electricity_types.$index.electricity_type"] = "Electricity type #".($index + 1);
        }

        // Water Sources
        foreach ((array) $this->input('water_source_types', []) as $index => $item) {
            $attributes["water_source_types.$index.water_source_type"] = "Water source type #".($index + 1);
        }

        // Waste Management
        foreach ((array) $this->input('waste_management_types', []) as $index => $item) {
            $attributes["waste_management_types.$index.waste_management_type"] = "Waste management type #".($index + 1);
        }

        // Pets
        foreach ((array) $this->input('pets', []) as $index => $item) {
            $attributes["pets.$index.pet_type"] = "Pet type #".($index + 1);
            $attributes["pets.$index.is_vaccinated"] = "Vaccination status of pet #".($index + 1);
        }

        foreach ((array) $this->input('livestocks', []) as $index => $livestock) {
            $n = $index + 1;
            $attributes["livestocks.$index.livestock_type"] = "Livestock type #$n";
            $attributes["livestocks.$index.quantity"] = "Quantity of livestock #$n";
            $attributes["livestocks.$index.purpose"] = "Purpose of livestock #$n";
        }

        return $attributes;
    }
}

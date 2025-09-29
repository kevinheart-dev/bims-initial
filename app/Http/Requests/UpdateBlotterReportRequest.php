<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlotterReportRequest extends FormRequest
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
    public function rules()
    {
        return [
            // Core report fields
            'type_of_incident'  => ['required', 'string', 'max:255'],
            'incident_date' => ['required', 'date_format:Y-m-d\TH:i'],
            'location'          => ['nullable', 'string', 'max:255'],
            'narrative_details' => ['nullable', 'string', 'min:10'],
            'actions_taken'     => ['nullable', 'string'],
            'report_status'     => ['required', Rule::in(['pending', 'on_going', 'resolved', 'elevated'])],
            'resolution'        => ['nullable', 'string'],
            'recommendations'   => ['nullable', 'string'],

            // Participants
            'complainants' => ['required', 'array', 'min:1'],
            'complainants.*.resident_id'   => ['nullable', 'exists:residents,id'],
            'complainants.*.resident_name' => ['required_without:complainants.*.resident_id', 'string', 'max:255'],
            'complainants.*.notes'   => ['nullable', 'string'],

            'respondents' => ['nullable', 'array'],
            'respondents.*.resident_id'   => ['nullable', 'exists:residents,id'],
            'respondents.*.resident_name' => ['nullable', 'string', 'max:255'],
            'respondents.*.notes'   => ['nullable', 'string'],

            'witnesses' => ['nullable', 'array'],
            'witnesses.*.resident_id'   => ['nullable', 'exists:residents,id'],
            'witnesses.*.resident_name' => ['nullable', 'string', 'max:255'],
            'witnesses.*.notes'   => ['nullable', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'complainants.*.resident_name.required_without' =>
                'Please provide the name of the complainant if no resident is selected.',
        ];
    }
}

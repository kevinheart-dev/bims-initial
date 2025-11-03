<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSummonRequest extends FormRequest
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
            // Editable fields
            'blotter_id'      => ['required', 'exists:blotter_reports,id'],
            'actions_taken'   => ['nullable', 'string', 'max:2000'],
            'recommendations' => ['nullable', 'string', 'max:2000'],
            'report_status'   => ['required', 'in:pending,on_going,resolved,elevated'],
            'summon_status'   => ['required', 'in:arbitration,medication,conciliation,issued_file_to_action,closed'],
            'summon_remarks'  => ['nullable', 'string', 'max:2000'],

            // Participants
            'complainants' => ['required', 'array', 'min:1'],

            'complainants.*.resident_id' => [
                'nullable',
                'integer',
                'exists:residents,id',
                'required_without:complainants.*.resident_name',
            ],

            'complainants.*.resident_name' => [
                'nullable',
                'string',
                'max:255',
                'required_without:complainants.*.resident_id',
            ],
            'complainants.*.notes' => ['nullable', 'string', 'max:2000'],

            'respondents' => ['required', 'array', 'min:1'],

            'respondents.*.resident_id' => [
                'nullable',
                'integer',
                'exists:residents,id',
                'required_without:respondents.*.resident_name',
            ],

            'respondents.*.resident_name' => [
                'nullable',
                'string',
                'max:255',
                'required_without:respondents.*.resident_id',
            ],
            'respondents.*.notes' => ['nullable', 'string', 'max:2000'],


            'witnesses' => ['nullable', 'array'],
            'witnesses.*.resident_id' => [
                'nullable',
                'integer',
                'exists:residents,id',
                'required_without:witnesses.*.resident_name',
            ],
            'witnesses.*.resident_name' => [
                'nullable',
                'string',
                'max:255',
                'required_without:witnesses.*.resident_id',
            ],
            'witnesses.*.notes' => ['nullable', 'string', 'max:2000'],


            // Existing summon sessions
            'summons'                   => ['nullable', 'array'],
            'summons.*.id'              => ['nullable', 'integer', 'exists:summons,id'],
            'summons.*.takes'           => ['required', 'array'],
            'summons.*.takes.*.session_number'  => ['nullable', 'integer', 'min:1'],
            'summons.*.takes.*.hearing_date'    => ['nullable', 'date'],
            'summons.*.takes.*.session_status'  => ['nullable', Rule::in(['scheduled','in_progress','completed','adjourned','cancelled','no_show'])],
            'summons.*.takes.*.session_remarks' => ['nullable', 'string', 'max:1000'],

            // New summon session
            'newSession'               => ['nullable', 'array'],
            'newSession.session_number'=> ['nullable', 'integer', 'min:1'],
            'newSession.hearing_date'  => ['nullable', 'date'],
            'newSession.session_status'=> ['nullable', Rule::in(['scheduled','in_progress','completed','adjourned','cancelled','no_show'])],
            'newSession.session_remarks'=> ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'report_status.required' => 'Please select a report status.',
            'summon_status.required' => 'Please select a summon status.',

            'complainants.required'  => 'At least one complainant is required.',
            'respondents.required'   => 'At least one respondent is required.',

            'complainants.*.resident_id.exists' => 'One or more complainants are invalid.',
            'respondents.*.resident_id.exists'  => 'One or more respondents are invalid.',
            'witnesses.*.resident_id.exists'    => 'One or more witnesses are invalid.',
        ];
    }
}

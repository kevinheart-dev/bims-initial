<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangayInstitutionMemberRequest extends FormRequest
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
            'members' => ['required', 'array', 'min:1'],
            'members.*.resident_id' => ['required', 'exists:residents,id'],
            'members.*.member_since' => ['nullable', 'date'],
            'members.*.status' => ['required', 'in:active,inactive'],
            'members.*.is_head' => ['boolean'],
        ];
    }

    public function attributes()
    {
        return [
            'members.*.resident_id'   => 'resident',
            'members.*.member_since'  => 'membership date',
            'members.*.status'        => 'status',
            'members.*.is_head'       => 'head of institution flag',
        ];
    }

    public function messages()
    {
        return [
            'members.required' => 'At least one member is required.',
            'members.*.resident_id.required' => 'Resident selection is required.',
            'members.*.resident_id.exists' => 'The selected resident does not exist.',
        ];
    }
}

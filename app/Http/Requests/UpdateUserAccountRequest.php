<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserAccountRequest extends FormRequest
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
        $userId = $this->route('user')?->id; // Get the user being updated (nullable if creating)

        return [
            'resident_id' => 'required|exists:residents,id',
            'username' => 'required|string|max:50',
            'email' => [
                'required',
                'email',
                // Only check uniqueness if email changed
                Rule::unique('users')->ignore($userId),
            ]
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreBarangayAccountRequest extends FormRequest
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
            'barangay_id' => ['required', 'integer', 'exists:barangays,id'],
            'barangay_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed', // This expects a field password_confirmation
                Password::min(8) // You can chain more rules: ->letters()->numbers()->symbols()
                    ->letters()
                    ->numbers()
                    ->symbols()
            ],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'is_disabled' => ['nullable', 'boolean'],
            'account_id' => ['nullable', 'integer', 'exists:accounts,id'],
        ];
    }

    /**
     * Customize the error messages (optional).
     */
    public function messages(): array
    {
        return [
            'barangay_id.required' => 'Barangay is required.',
            'barangay_id.exists' => 'Selected barangay does not exist.',
            'username.unique' => 'This username is already taken.',
            'email.unique' => 'This email is already in use.',
            'password.confirmed' => 'Password confirmation does not match.',
            'status.in' => 'Invalid status selected.',
        ];
    }
}

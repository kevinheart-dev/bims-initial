<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBarangayAccountRequest extends FormRequest
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
        $userId = $this->route('id'); // get user ID from route

        return [
            'barangay_id' => ['required', 'integer', 'exists:barangays,id'],
            'username'    => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'email'       => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password'    => ['nullable', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Customize the error messages.
     */
    public function messages(): array
    {
        return [
            'barangay_id.required' => 'Barangay is required.',
            'barangay_id.exists'   => 'Selected barangay does not exist.',
            'username.required'    => 'Username is required.',
            'username.unique'      => 'This username is already taken.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Please enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.confirmed'   => 'Password confirmation does not match.',
        ];
    }
}

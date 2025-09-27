<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBarangayProjectRequest extends FormRequest
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
            'projects' => ['required', 'array'],
            'projects.*.project_image' => ['nullable', 'image', 'max:5120'],
            'projects.*.title' => ['required', 'string', 'max:55'],
            'projects.*.description' => ['nullable', 'string'],
            'projects.*.status' => ['required', 'in:planning,ongoing,completed,cancelled'],
            'projects.*.category' => ['required', 'string', 'max:55'],
            'projects.*.responsible_institution' => ['nullable', 'string', 'max:155'],
            'projects.*.budget' => ['required', 'numeric', 'min:0'],
            'projects.*.funding_source' => ['required', 'string', 'max:100'],
            'projects.*.start_date' => ['required', 'date'],
            'projects.*.end_date' => ['nullable', 'date', 'after_or_equal:projects.*.start_date'],
        ];
    }
    public function attributes(): array
    {
        return [
            'projects.*.title' => 'project title',
            'projects.*.project_image' => 'project image',
            'projects.*.description' => 'project description',
            'projects.*.status' => 'status',
            'projects.*.category' => 'project category',
            'projects.*.responsible_institution' => 'responsible institution',
            'projects.*.budget' => 'budget',
            'projects.*.funding_source' => 'funding source',
            'projects.*.start_date' => 'start date',
            'projects.*.end_date' => 'end date',
        ];
    }

    public function messages(): array
    {
        return [
            'projects.*.title.required' => 'Project title is required.',
            'projects.*.status.in' => 'Status must be planning, ongoing, completed, or cancelled.',
            'projects.*.budget.min' => 'Budget must be at least 0.',
            'projects.*.end_date.after_or_equal' => 'End date cannot be before start date.',
        ];
    }
}

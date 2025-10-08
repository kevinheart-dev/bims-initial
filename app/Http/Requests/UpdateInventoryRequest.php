<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryRequest extends FormRequest
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
            'item_id' => ['exists:inventories,id'],
            'inventory_items' => ['required', 'array', 'min:1'],
            'inventory_items.*.item_name' => ['required', 'string', 'max:100'],
            'inventory_items.*.item_category' => ['required', 'string', 'max:55'],
            'inventory_items.*.quantity' => ['required', 'numeric', 'min:0'],
            'inventory_items.*.unit' => ['required', 'string', 'max:15'],
            'inventory_items.*.received_date' => ['nullable', 'date'],
            'inventory_items.*.supplier' => ['nullable', 'string', 'max:55'],
            'inventory_items.*.status' => [
                'required',
                Rule::in(['available', 'low_stock', 'out_of_stock']),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'inventory_items' => 'inventory items list',
            'inventory_items.*.item_name' => 'item name',
            'inventory_items.*.item_category' => 'item category',
            'inventory_items.*.quantity' => 'quantity',
            'inventory_items.*.unit' => 'unit of measure',
            'inventory_items.*.received_date' => 'received date',
            'inventory_items.*.supplier' => 'supplier',
            'inventory_items.*.status' => 'status',
        ];
    }

    public function messages(): array
    {
        return [
            'inventory_items.required' => 'Please add at least one inventory item.',
            'inventory_items.*.item_name.required' => 'The item name is required.',
            'inventory_items.*.item_category.required' => 'The item category is required.',
            'inventory_items.*.quantity.required' => 'Please enter the quantity.',
            'inventory_items.*.quantity.numeric' => 'Quantity must be a number.',
            'inventory_items.*.quantity.min' => 'Quantity cannot be negative.',
            'inventory_items.*.unit.required' => 'The unit of measure is required.',
            'inventory_items.*.status.required' => 'The status field is required.',
            'inventory_items.*.status.in' => 'Status must be one of: available, low stock, or out of stock.',
        ];
    }
}

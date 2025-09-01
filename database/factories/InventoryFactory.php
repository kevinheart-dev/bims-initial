<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // Common barangay supply categories
        $categories = [
            'Medical Supplies',
            'Office Supplies',
            'Cleaning Materials',
            'Relief Goods',
            'Construction Materials',
            'Electrical Supplies',
            'IT Equipment',
        ];

        // Common barangay items per category
        $items = [
            'Medical Supplies' => ['First Aid Kit', 'Alcohol', 'Face Mask', 'Thermometer', 'Medicine Pack'],
            'Office Supplies' => ['Bond Paper', 'Ballpen', 'Stapler', 'Folder', 'Printer Ink'],
            'Cleaning Materials' => ['Broom', 'Mop', 'Detergent Powder', 'Disinfectant', 'Trash Bag'],
            'Relief Goods' => ['Rice Sack', 'Canned Goods', 'Noodles Pack', 'Bottled Water', 'Blanket'],
            'Construction Materials' => ['Cement Bag', 'Nails', 'Plywood', 'Hammer', 'Paint'],
            'Electrical Supplies' => ['Light Bulb', 'Extension Cord', 'Switch', 'Wires', 'Fuse'],
            'IT Equipment' => ['Desktop Computer', 'Printer', 'Router', 'UPS', 'Keyboard'],
        ];

        $category = $this->faker->randomElement($categories);
        $item = $this->faker->randomElement($items[$category]);

        $quantity = $this->faker->numberBetween(0, 200);
        $status = match (true) {
            $quantity === 0 => 'out_of_stock',
            $quantity < 20 => 'low_stock',
            default => 'available',
        };

        return [
            'barangay_id' => 1, // or existing ID if seeding after barangays
            'item_name' => $item,
            'item_category' => $category,
            'quantity' => $quantity,
            'unit' => $this->faker->randomElement(['pcs', 'box', 'pack', 'sack', 'bottle']),
            'received_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'supplier' => $this->faker->company(),
            'status' => $status,
        ];
    }
}

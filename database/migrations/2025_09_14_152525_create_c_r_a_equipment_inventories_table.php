<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('c_r_a_equipment_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('item', 200); // Equipment item name
            $table->enum('availability', ['checked', 'cross'])->default('checked'); // ✓ or ✗
            $table->integer('quantity')->default(0); // Quantity available
            $table->string('location', 200)->nullable(); // Storage location
            $table->string('remarks', 255)->nullable(); // Remarks (e.g., serviceable, needs repair)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_equipment_inventories');
    }
};

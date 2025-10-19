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
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('item', 200); // Equipment item name
            $table->enum('availability', ['checked', 'cross'])->default('checked'); // ✓ or ✗
            $table->string('quantity', 55)->nullable(); // Quantity available
            $table->string('location', 200)->nullable(); // Storage location
            $table->string('remarks', 255)->nullable(); // Remarks (e.g., serviceable, needs repair)
            $table->timestamps();
            $table->unique(['barangay_id', 'item'], 'cra_equipment_inventory_unique');
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

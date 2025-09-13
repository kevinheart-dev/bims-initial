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
        Schema::create('c_r_a_disaster_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('category', 100); // e.g. "Food", "Medicine", "Shelter Equipment"
            $table->string('item_name', 150); // actual item, e.g. "Rice sacks", "Tents"
            $table->string('total_in_barangay', 100)->nullable(); // total stock available
            $table->string('at_risk', 100)->nullable(); // portion exposed/at risk
            $table->string('location', 150)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_inventories');
    }
};

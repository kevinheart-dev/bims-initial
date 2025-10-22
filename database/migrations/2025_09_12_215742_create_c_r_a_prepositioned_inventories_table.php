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
        Schema::create('c_r_a_prepositioned_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->text('item_name')->nullable();
            $table->text('quantity')->nullable(); // can include text like "few" or "all used"
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Unique constraint for upsert
            $table->unique(['barangay_id', 'item_name', 'cra_id'], 'cra_inventory_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_prepositioned_inventories');
    }
};

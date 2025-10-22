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

            $table->unsignedBigInteger('cra_id'); // must match community_risk_assessments.id
            $table->foreign('cra_id')
                ->references('id')
                ->on('community_risk_assessments')
                ->onDelete('cascade');

            $table->unsignedBigInteger('barangay_id'); // must match barangays.id
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays')
                ->onDelete('cascade');

            $table->string('item_name'); // not nullable for unique index
            $table->string('quantity')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Unique index (all columns must be NOT NULL)
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

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
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('category', 100)->nullable();
            $table->string('item_name', 150)->nullable();
            $table->string('total_in_barangay', 100)->nullable();
            $table->string('percentage_at_risk', 100)->nullable();
            $table->string('location', 150)->nullable();
            $table->timestamps();
            $table->unique(
    ['barangay_id', 'hazard_id', 'category', 'item_name', 'cra_id'],
                'cra_dis_inventory_unique' // short & descriptive
            );
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

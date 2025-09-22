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
        Schema::create('c_r_a_evacuation_inventories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->integer('purok_number')->nullable();

            $table->integer('total_families')->default(0);
            $table->integer('total_individuals')->default(0);
            $table->integer('families_at_risk')->default(0);
            $table->integer('individuals_at_risk')->default(0);

            // Plan A
            $table->string('plan_a_center', 150)->nullable();
            $table->integer('plan_a_capacity_families')->default(0);
            $table->integer('plan_a_capacity_individuals')->default(0);
            $table->integer('plan_a_unaccommodated_families')->default(0);
            $table->integer('plan_a_unaccommodated_individuals')->default(0);

            // Plan B
            $table->string('plan_b_center', 150)->nullable();
            $table->integer('plan_b_unaccommodated_families')->default(0);
            $table->integer('plan_b_unaccommodated_individuals')->default(0);

            $table->string('remarks', 255)->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'purok_number'], 'unique_barangay_purok_inventory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_evacuation_inventories');
    }
};

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
        Schema::create('c_r_a_evacuation_centers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('name', 150);
            $table->integer('capacity_families')->default(0);
            $table->integer('capacity_individuals')->default(0);

            $table->enum('owner_type', ['government', 'private']);
            $table->boolean('inspected_by_engineer')->default(false);
            $table->boolean('has_mou')->default(false);
            $table->timestamps();
            $table->unique(['barangay_id', 'name'], 'unique_barangay_center');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_evacuation_centers');
    }
};

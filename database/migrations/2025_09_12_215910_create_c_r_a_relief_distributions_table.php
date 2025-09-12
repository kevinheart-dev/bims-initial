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
        Schema::create('c_r_a_relief_distributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('evacuation_center', 150)->nullable();
            $table->string('relief_good', 150);
            $table->string('quantity', 100)->nullable();
            $table->string('unit', 50)->nullable(); // e.g. sacks, boxes, packs
            $table->string('beneficiaries', 150)->nullable(); // e.g. household name or "100 families"
            $table->string('address', 200)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_relief_distributions');
    }
};

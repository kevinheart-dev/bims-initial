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
        Schema::create('c_r_a_population_exposures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hazard_id')->constrained('hazards')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->integer('purok_number')->nullable();

            $table->foreignId('category_id')->constrained('c_r_a_exposure_categories')->onDelete('cascade');

            $table->integer('male')->default(0);
            $table->integer('female')->default(0);
            $table->integer('lgbtq')->default(0);

            $table->integer('total_families')->default(0);
            $table->integer('total_individuals')->default(0);

            $table->string('data_source', 255)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_population_exposures');
    }
};

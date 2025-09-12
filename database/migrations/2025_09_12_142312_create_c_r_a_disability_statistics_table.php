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
        Schema::create('c_r_a_disability_statistics', function (Blueprint $table) {
            $table->id();

            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('c_r_a_exposure_categories')->onDelete('cascade');

            $table->string('disability_type', 100);
            // can link to a disability_types table if you plan to normalize it later

            $table->integer('male')->default(0);
            $table->integer('female')->default(0);
            $table->integer('lgbtq')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disability_statistics');
    }
};

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
        Schema::create('c_r_a_population_age_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('age_group', 50); // e.g. '0-4', '5-9', '10-14', etc.
            $table->integer('male_without_disability')->default(0);
            $table->integer('male_with_disability')->default(0);
            $table->integer('female_without_disability')->default(0);
            $table->integer('female_with_disability')->default(0);
            $table->integer('lgbtq_without_disability')->default(0);
            $table->integer('lgbtq_with_disability')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_population_age_groups');
    }
};

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
        Schema::create('c_r_a_human_resources', function (Blueprint $table) {
            $table->id();

            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('c_r_a_h_r_categories')->onDelete('cascade');

            $table->string('resource_name', 55); // e.g., Doctors, Nurses, Rescue Volunteers

            $table->integer('male_without_disability')->default(0);
            $table->integer('male_with_disability')->default(0);
            $table->integer('female_without_disability')->default(0);
            $table->integer('female_with_disability')->default(0);
            $table->integer('lgbtq')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_human_resources');
    }
};

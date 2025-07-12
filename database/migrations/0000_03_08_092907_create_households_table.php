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
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('purok_id')->constrained('puroks')->onDelete('cascade');
            $table->foreignId('street_id')->constrained('streets')->onDelete('cascade');
            $table->integer('house_number');
            $table->string('ownership_type', 55);
            $table->enum('housing_condition', ['good', 'needs_repair', 'dilapidated']);
            $table->year('year_established')->nullable();
            $table->enum('house_structure', ['concrete', 'semi_concrete', 'wood', 'makeshift']);
            $table->string('bath_and_wash_area', 100)->nullable();
            $table->tinyInteger('number_of_rooms');
            $table->tinyInteger('number_of_floors');
            $table->decimal("latitude", 8, 6)->nullable();
            $table->decimal("longitude", 9, 6)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};

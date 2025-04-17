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
        Schema::create('barangay_roads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('road_type', ['asphalt', 'concrete', 'grave', 'natural earth surface']);
            $table->decimal('length', 5, 2);
            $table->string('maintained_by', 155);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_roads');
    }
};

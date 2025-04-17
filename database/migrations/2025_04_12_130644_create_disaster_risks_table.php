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
        Schema::create('disaster_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->integer('purok_covered');
            $table->enum('risk_type', ['flood', 'earthquake', 'landslide', 'fire', 'storm surge', 'typhoon', 'others']);
            $table->enum('risk_level', ['low', 'moderate', 'high', 'very high']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disaster_risks');
    }
};

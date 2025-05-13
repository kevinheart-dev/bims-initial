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
            $table->foreignId('purok_id')->constrained('puroks')->onDelete('cascade');
            $table->string('risk_type', 155);
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

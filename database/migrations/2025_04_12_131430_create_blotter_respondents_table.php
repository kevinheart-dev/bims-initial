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
        Schema::create('blotter_respondents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blotter_id')->constrained('blotters')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('respondent_name', 155);
            $table->enum('involvement', ['primary', 'accomplice', 'witness']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotter_respondents');
    }
};

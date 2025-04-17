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
        Schema::create('families', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->enum('income_bracket', [
                'Below PHP 5,000 (Survival)',
                'PHP 5,001 - PHP 10,000 (Poor)',
                'PHP 10,001 - PHP 20,000 (Low Income)',
                'PHP 20,001 - PHP 40,000 (Lower Middle Income)',
                'PHP 40,001 - PHP 70,000 (Middle Income)',
                'PHP 70,001 - PHP 120,000 (Upper Middle Income)',
                'PHP 120,001 and above (High Income)'
            ]);
            $table->string('family_name', 155);
            $table->enum('family_type', ['nuclear', 'extended', 'single-parent', 'other']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('families');
    }
};

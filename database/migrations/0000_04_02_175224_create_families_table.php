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
                'below_5000',
                '5001_10000',
                '10001_20000',
                '20001_40000',
                '40001_70000',
                '70001_120000',
                'above_120001'
            ]);
            $table->enum('income_category', [
                'survival',
                'poor',
                'low_income',
                'lower_middle_income',
                'iddle_income',
                'upper_middle_income',
                'above_high_income'
            ]);
            $table->string('family_name', 155);
            $table->string('family_type', 55);
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

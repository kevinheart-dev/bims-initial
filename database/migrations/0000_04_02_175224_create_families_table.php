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
                'below_5000_survival',
                '5001_10000_poor',
                '10001_20000_low_income',
                '20001_40000_lower_middle_income',
                '40001_70000_middle_income',
                '70001_120000_upper_middle_income',
                '120001_above_high_income'
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

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
        Schema::create('c_r_a_family_at_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->integer('purok_number'); // Purok number
            $table->string('indicator', 255); // The value field, e.g., "Number of Informal Settler Families"
            $table->integer('count')->default(0); // Number of families/individuals
            $table->timestamps();

            // Unique constraint to avoid duplicates per barangay + purok + indicator
            $table->unique(['barangay_id', 'purok_number', 'indicator', 'cra_id'], 'unique_family_risk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_family_at_risks');
    }
};

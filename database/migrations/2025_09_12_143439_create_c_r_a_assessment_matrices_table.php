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
        Schema::create('c_r_a_assessment_matrices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->enum('matrix_type', ['risk', 'vulnerability']);

            $table->integer('people')->default(0);
            $table->text('properties')->nullable();
            $table->text('services')->nullable();
            $table->text('environment')->nullable();
            $table->text('livelihood')->nullable();

            $table->timestamps();
             $table->unique(['barangay_id', 'hazard_id', 'matrix_type'], 'cra_assess_matrix_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_assessment_matrices');
    }
};

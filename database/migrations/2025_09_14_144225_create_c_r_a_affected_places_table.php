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
        Schema::create('c_r_a_affected_places', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->enum('risk_level', ['Low', 'Medium', 'High'])->default('Low');

            $table->integer('purok_number')->nullable();

            $table->integer('total_families')->default(0);
            $table->integer('total_individuals')->default(0);

            $table->integer('at_risk_families')->default(0);
            $table->integer('at_risk_individuals')->default(0);

            $table->string('safe_evacuation_area')->nullable();

            $table->timestamps();
            $table->unique(['barangay_id', 'hazard_id', 'purok_number', 'cra_id'], 'unique_affected_places');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_affected_places');
    }
};

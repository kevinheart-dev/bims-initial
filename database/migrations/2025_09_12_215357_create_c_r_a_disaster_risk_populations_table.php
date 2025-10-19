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
        Schema::create('c_r_a_disaster_risk_populations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->integer('purok_number')->nullable();

            // Low risk
            $table->integer('low_families')->default(0);
            $table->integer('low_individuals')->default(0);

            // Medium risk
            $table->integer('medium_families')->default(0);
            $table->integer('medium_individuals')->default(0);

            // High risk
            $table->integer('high_families')->default(0);
            $table->integer('high_individuals')->default(0);

            $table->timestamps();
            $table->unique(
    ['barangay_id', 'hazard_id', 'purok_number'],
                'cra_dis_risk_pop_unique' // short & descriptive
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_risk_populations');
    }
};

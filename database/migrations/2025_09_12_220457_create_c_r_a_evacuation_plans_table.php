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
        Schema::create('c_r_a_evacuation_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->integer('activity_no'); // Step/activity number
            $table->text('things_to_do');   // Actions required
            $table->text('responsible_person')->nullable(); // Person/team responsible
            $table->text('remarks')->nullable(); // Additional notes
            $table->timestamps();
            $table->unique(['barangay_id', 'activity_no', 'cra_id'], 'cra_evacuation_plan_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_evacuation_plans');
    }
};

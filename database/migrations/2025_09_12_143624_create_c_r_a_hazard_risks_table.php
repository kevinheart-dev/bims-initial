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
        Schema::create('c_r_a_hazard_risks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->integer('probability_no')->nullable();
            $table->integer('effect_no')->nullable();
            $table->integer('management_no')->nullable();

            $table->text('basis')->nullable();
            $table->decimal('average_score', 8, 2)->default(0.00);

            $table->timestamps();
            $table->unique(['barangay_id', 'hazard_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_hazard_risks');
    }
};

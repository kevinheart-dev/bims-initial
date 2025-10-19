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
        Schema::create('c_r_a_disability_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('disability_type', 100); // e.g., Deaf/Hard of Hearing, Visual Impairment

            // Fixed columns for counts by age and gender
            $table->integer('age_0_6_male')->default(0);
            $table->integer('age_0_6_female')->default(0);

            $table->integer('age_7m_2y_male')->default(0);
            $table->integer('age_7m_2y_female')->default(0);

            $table->integer('age_3_5_male')->default(0);
            $table->integer('age_3_5_female')->default(0);

            $table->integer('age_6_12_male')->default(0);
            $table->integer('age_6_12_female')->default(0);
            $table->integer('age_6_12_lgbtq')->default(0);

            $table->integer('age_13_17_male')->default(0);
            $table->integer('age_13_17_female')->default(0);
            $table->integer('age_13_17_lgbtq')->default(0);

            $table->integer('age_18_59_male')->default(0);
            $table->integer('age_18_59_female')->default(0);
            $table->integer('age_18_59_lgbtq')->default(0);

            $table->integer('age_60up_male')->default(0);
            $table->integer('age_60up_female')->default(0);
            $table->integer('age_60up_lgbtq')->default(0);

            $table->timestamps();
            $table->unique(['barangay_id', 'disability_type'], 'cra_disability_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disability_statistics');
    }
};

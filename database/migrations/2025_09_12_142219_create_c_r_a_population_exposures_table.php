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
        Schema::create('c_r_a_population_exposures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hazard_id')->constrained('c_r_a_hazards')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->integer('purok_number')->nullable();

            // Family & total counts
            $table->integer('total_families')->default(0);
            $table->integer('total_individuals')->default(0);

            // Gender counts
            $table->integer('individuals_male')->default(0);
            $table->integer('individuals_female')->default(0);
            $table->integer('individuals_lgbtq')->default(0);

            // Age groups
            $table->integer('age_0_6_male')->default(0);
            $table->integer('age_0_6_female')->default(0);

            $table->integer('age_7m_2y_male')->default(0);
            $table->integer('age_7m_2y_female')->default(0);

            $table->integer('age_3_5_male')->default(0);
            $table->integer('age_3_5_female')->default(0);

            $table->integer('age_6_12_male')->default(0);
            $table->integer('age_6_12_female')->default(0);

            $table->integer('age_13_17_male')->default(0);
            $table->integer('age_13_17_female')->default(0);

            $table->integer('age_18_59_male')->default(0);
            $table->integer('age_18_59_female')->default(0);

            $table->integer('age_60_up_male')->default(0);
            $table->integer('age_60_up_female')->default(0);

            // Special categories
            $table->integer('pwd_male')->default(0);
            $table->integer('pwd_female')->default(0);

            $table->integer('diseases_male')->default(0);
            $table->integer('diseases_female')->default(0);

            $table->integer('pregnant_women')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_population_exposures');
    }
};

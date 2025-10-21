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
        Schema::create('c_r_a_disaster_population_impacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('disaster_id')->constrained('c_r_a_disaster_occurances')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('category', 100);
            $table->integer('value')->default(0);
            $table->string('source', 150)->nullable();
            $table->timestamps();

            // Short unique index name
            $table->unique(['barangay_id', 'disaster_id', 'category', 'cra_id'], 'cra_dis_pop_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_population_impacts');
    }
};

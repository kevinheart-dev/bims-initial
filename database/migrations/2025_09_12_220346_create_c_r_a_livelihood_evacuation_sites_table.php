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
        Schema::create('c_r_a_livelihood_evacuation_sites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('livelihood_type', 150)->nullable(); // e.g., farmers, vendors, fisherfolk
            $table->string('evacuation_site', 150)->nullable(); // assigned evacuation center/site
            $table->string('place_of_origin', 150)->nullable(); // where they are relocated from
            $table->string('capacity_description', 255)->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'livelihood_type', 'cra_id'], 'cra_livelihood_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_livelihood_evacuation_sites');
    }
};

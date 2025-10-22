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
        Schema::create('c_r_a_evacuation_centers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('name', 150)->nullable();
            $table->integer('capacity_families')->nullable()->default(0);
            $table->integer('capacity_individuals')->nullable()->default(0);

            $table->enum('owner_type', ['government', 'private'])->nullable();
            $table->boolean('inspected_by_engineer')->default(false);
            $table->boolean('has_mou')->default(false);
            $table->timestamps();
            $table->unique(['barangay_id', 'name', 'cra_id'], 'unique_barangay_center');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_evacuation_centers');
    }
};

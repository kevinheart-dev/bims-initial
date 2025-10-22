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
        Schema::create('c_r_a_human_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->unsignedBigInteger('barangay_id');
            $table->string('category')->nullable();
            $table->string('resource_name')->nullable();
            $table->integer('male_without_disability')->default(0);
            $table->integer('male_with_disability')->default(0);
            $table->integer('female_without_disability')->default(0);
            $table->integer('female_with_disability')->default(0);
            $table->integer('lgbtq_without_disability')->default(0);
            $table->integer('lgbtq_with_disability')->default(0);
            $table->timestamps();
            $table->unique(
                ['barangay_id', 'category', 'resource_name', 'cra_id'],
                'cra_humanres_unique' // <- short, under 64 chars
            );
            $table->foreign('barangay_id')
                ->references('id')
                ->on('barangays')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_human_resources');
    }
};

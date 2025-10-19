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
        Schema::create('c_r_a_bdrrmc_directories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('designation_team', 150); // e.g., Response Team, Logistics, Medical
            $table->string('name', 150); // member’s full name
            $table->string('contact_no', 50)->nullable(); // contact number
            $table->timestamps();
            $table->unique(['barangay_id', 'designation_team'], 'cra_bdrrmc_directory_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_bdrrmc_directories');
    }
};

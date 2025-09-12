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
            $table->foreignId('hazard_id')
                ->constrained('c_r_a_hazards')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->integer('purok_number')->nullable(); // optional, since not all barangays use purok subdivisions

            $table->enum('risk_level', ['Low', 'Medium', 'High'])->default('Low');
            $table->integer('families')->default(0);
            $table->integer('individuals')->default(0);
            $table->timestamps();
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

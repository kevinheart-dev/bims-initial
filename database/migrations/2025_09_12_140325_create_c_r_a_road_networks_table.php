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
        Schema::create('c_r_a_road_networks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->unsignedBigInteger('barangay_id');
            $table->string('road_type');
            $table->decimal('length_km', 8, 2)->default(0);
            $table->string('maintained_by')->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'road_type']); // 👈 required
            $table->foreign('barangay_id')->references('id')->on('barangays')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_road_networks');
    }
};

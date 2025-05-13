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
        Schema::create('blotter_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_id')->nullable()->constrained('incident_reports')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('report_type', ['summon', 'complaint']);
            $table->text('narrative_details');
            $table->text('actions_taken');
            $table->enum('report_status', ['pending', 'under mediation', 'resolved', 'dismissed']);
            $table->text('location');
            $table->text('resolution');
            $table->foreignId('recorded_by')->constrained('barangay_officials')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotter_reports');
    }
};

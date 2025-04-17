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
            $table->foreignId('compliant_id')->constrained('residents')->onDelete('cascade');
            $table->string('compliant_name', 155);
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('report_type', ['summon', 'complaint']);
            $table->string('type_of_incident', 255);
            $table->text('narrative_details');
            $table->text('actions_taken');
            $table->enum('report_status', ['pending', 'under mediation', 'resolved', 'dismissed']);
            $table->text('resolution')->nullable();
            $table->foreignId('recorded_by')->constrained('barangay_officials');
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

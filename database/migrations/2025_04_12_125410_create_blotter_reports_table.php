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
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('type_of_incident', 255)->nullable();
            $table->text('narrative_details')->nullable();
            $table->text('actions_taken')->nullable();
            $table->enum('report_status', ['pending', 'on_going', 'resolved', 'elevated'])->default('pending');
            $table->string('location', 255)->nullable();
            $table->text('resolution')->nullable();
            $table->text('recommendations')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('barangay_officials')->onDelete('set null');
            $table->date('incident_date')->nullable();
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

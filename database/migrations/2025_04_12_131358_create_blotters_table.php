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
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('compliant_id')->constrained('residents')->onDelete('cascade');
            $table->string('compliant_name', 155);
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('report_type', ['summon', 'complaint']);
            $table->string('incident_type', 55);
            $table->text('incident_details');
            $table->dateTime('incident_date');
            $table->enum('report_status', ['pending', 'resolved', 'dismissed']);
            $table->text('resolution')->nullable();
            $table->foreignId('recorded_by')->constrained('barangay_officials')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};

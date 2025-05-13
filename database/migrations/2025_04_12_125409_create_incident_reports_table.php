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
        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->date('date_of_incident');
            $table->string('type_of_incident', 155);
            $table->text('narrative_details');
            $table->text('actions_taken');
            $table->text('recommendations');
            $table->foreignId('reported_by')->constrained('residents')->onDelete('cascade');
            $table->foreignId('reviewed_by')->constrained('barangay_officials')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_reports');
    }
};

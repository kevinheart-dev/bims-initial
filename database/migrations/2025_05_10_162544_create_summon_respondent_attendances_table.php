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
        Schema::create('summon_respondent_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('take_id')->constrained('summon_takes')->onDelete('cascade');
            $table->foreignId('resident_id')->nullable()->constrained('residents')->onDelete('cascade');
            $table->string('respondent_name')->nullable();
            $table->enum('attendance_status', ['pending', 'attended', 'missed', 'rescheduled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summon_respondent_attendances');
    }
};

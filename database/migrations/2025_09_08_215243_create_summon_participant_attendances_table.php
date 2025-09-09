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
        Schema::create('summon_participant_attendances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('take_id')
                ->constrained('summon_takes')
                ->cascadeOnDelete();

            // Link to case participant (complainant/respondent/witness)
            $table->foreignId('participant_id')
                ->constrained('case_participants')
                ->cascadeOnDelete();

            $table->enum('attendance_status', ['pending', 'attended', 'missed', 'rescheduled'])
                ->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summon_participant_attendances');
    }
};

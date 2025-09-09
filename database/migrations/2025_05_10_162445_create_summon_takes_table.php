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
        Schema::create('summon_takes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('summon_id')->constrained('summons')->onDelete('cascade');
            $table->tinyInteger('session_number')->nullable();
            $table->date('hearing_date');
            $table->enum('session_status', [
                'scheduled',   // hearing date is set
                'in_progress', // currently ongoing
                'completed',   // hearing session finished
                'adjourned',   // temporarily stopped, will resume
                'cancelled',   // officially cancelled
                'no_show'      // respondent/complainant did not attend
            ])->default('scheduled');
            $table->text('session_remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summon_takes');
    }
};

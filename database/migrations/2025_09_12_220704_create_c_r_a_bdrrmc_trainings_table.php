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
        Schema::create('c_r_a_bdrrmc_trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('title', 200); // Training title
            $table->enum('status', ['checked', 'cross'])->default('cross'); // checked = completed, cross = not yet
            $table->string('duration', 100)->nullable(); // e.g., "3 days"
            $table->text('agency')->nullable(); // training agency/organizer
            $table->string('inclusive_dates', 150)->nullable(); // e.g., "Jan 10-12, 2025"
            $table->integer('number_of_participants')->default(0);
            $table->text('participants')->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'title'], 'cra_bdrrmc_trainings_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_bdrrmc_trainings');
    }
};

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
        Schema::create('case_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blotter_id')->constrained('blotter_reports')->onDelete('cascade');
            $table->foreignId('resident_id')->nullable()->constrained('residents')->onDelete('set null');
            $table->string('name', 255)->nullable(); // fallback if not a resident
            $table->enum('role_type', ['complainant', 'respondent', 'witness', 'other']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_participants');
    }
};

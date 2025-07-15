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
        Schema::create('educational_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('school_name', 155)->nullable();
            $table->enum('school_type', ['private', 'public'])->nullable();
            $table->enum('educational_attainment', [
                'no_formal_education',
                'elementary',
                'high_school',
                'college',
                'vocational',
                'post_graduate',
            ])->nullable();
            $table->enum('education_status', ['graduate', 'undergraduate', 'enrolled', 'stopped'])->nullable();
            $table->year('year_started')->nullable();
            $table->year('year_ended')->nullable();
            $table->string('program', 55)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_histories');
    }
};

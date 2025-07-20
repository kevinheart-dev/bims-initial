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
                'no_education_yet',
                'no_formal_education',
                'prep_school',
                'kindergarten',
                'elementary',
                'high_school',
                'senior_high_school',
                'college',
                'als',
                'tesda',
                'vocational',
                'post_graduate',
            ])->nullable();
            $table->enum('education_status', ['enrolled','graduated','incomplete','dropped_out'])->nullable();
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

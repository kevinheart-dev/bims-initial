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
        Schema::create('deceaseds', function (Blueprint $table) {
            $table->id();

            // Foreign key to residents table
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');

            // Death-related details
            $table->date('date_of_death')->nullable();
            $table->string('cause_of_death')->nullable();
            $table->string('place_of_death')->nullable();
            $table->string('burial_place')->nullable();
            $table->date('burial_date')->nullable();
            $table->string('death_certificate_number')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deceaseds');
    }
};

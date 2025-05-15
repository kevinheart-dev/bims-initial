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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('firstname', 55);
            $table->string('middlename', 55);
            $table->string('lastname', 55);
            $table->string('maiden_name', 155)->nullable();
            $table->enum('suffix', ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'])->nullable();
            $table->enum('gender', ['male', 'female', 'LGBTQ+']);
            $table->date('birthdate');
            $table->string('birthplace', 150);
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced', 'others']);
            $table->string('civil_status_other', 55)->nullable();
            $table->boolean('registered_voter');
            $table->string('precint_number', 55);
            $table->enum('employment_status', ['employed', 'unemployed', 'student', 'retired']);
            $table->string('nationality', 55);
            $table->string('religion', 55);
            $table->string('contact_number', 15);
            $table->string('email', 55);
            $table->integer('purok_number');
            $table->foreignId('street_id')->constrained('streets')->onDelete('cascade');
            $table->date('residency_date');
            $table->enum('residency_type', ['permanent', 'temporary', 'migrant']);
            $table->text('resident_picture_path');
            $table->boolean('is_pwd');
            $table->string('ethnicity', 55)->nullable();
            $table->date('date_of_death')->nullable();
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->boolean('is_household_head');
            $table->foreignId('family_id')->constrained('families')->onDelete('cascade');
            $table->boolean('is_family_head');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};

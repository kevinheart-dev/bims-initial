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
            $table->string('middlename', 55)->nullable();
            $table->string('lastname', 55);
            $table->string('maiden_name', 155)->nullable();
            $table->enum('suffix', ['Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'])->nullable();
            $table->enum('sex', ['male', 'female']);
            $table->string('gender', 55);
            $table->date('birthdate')->nullable();
            $table->string('birthplace', 150);
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced', 'annulled']);
            $table->boolean('registered_voter');
            $table->enum('employment_status', ['employed', 'unemployed', 'self_employed', 'student', 'under_employed','child','retired','homemaker', 'not_applicable'])->nullable();
            $table->string('citizenship', 55)->nullable();
            $table->string('religion', 55)->nullable();
            $table->string('contact_number', 15)->nullable();
            $table->string('email', 55)->nullable();
            $table->integer('purok_number');
            $table->foreignId('street_id')->nullable()->constrained('streets')->onDelete('cascade');
            $table->year('residency_date')->nullable();
            $table->enum('residency_type', ['permanent', 'temporary', 'immigrant'])->nullable();
            $table->text('resident_picture_path')->nullable();
            $table->boolean('is_pwd')->default(false);
            $table->string('ethnicity', 55)->nullable();
            $table->boolean('is_deceased')->default(false)->nullable();
            $table->foreignId('household_id')->nullable()->constrained('households')->onDelete('set null');
            $table->boolean('is_household_head')->default(false);
            $table->boolean('is_family_head')->nullable()->default(false);
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('set null');
            $table->boolean('verified')->default(false);
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

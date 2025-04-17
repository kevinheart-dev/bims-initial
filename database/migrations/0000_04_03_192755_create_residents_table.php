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
            $table->enum('suffix', ['sr', 'jr', 'II', 'III', 'IV', 'V'])->nullable();
            $table->string('maiden_name', 155)->nullable();
            $table->enum('gender', ['male', 'female', 'LGBTQ+']);
            $table->date('birthdate');
            $table->string('birthplace', 150);
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced', 'others']);
            $table->string('civil_status_other', 55)->nullable();
            $table->boolean('registered_voter')->default(false);
            $table->string('precint_number', 55)->nullable();
            $table->enum('employment_status', ['employed', 'unemployed', 'student', 'retired', 'others']);
            $table->enum('educational_attainment', [
                'No Formal Education', 'Elementary Level', 'Elementary Graduate',
                'High School Level', 'High School Graduate', 'College Level',
                'College Graduate', 'Vocational', 'Post Graduate', 'ALS Graduate'
            ]);
            $table->string('nationality', 55);
            $table->string('religion', 55)->nullable();
            $table->string('contact_number', 15)->nullable();
            $table->string('email', 55)->nullable();
            $table->foreignId('purok_id')->nullable()->constrained('puroks')->onDelete('set null');
            $table->foreignId('street_id')->nullable()->constrained('streets')->onDelete('set null');
            $table->date('residency_date');
            $table->enum('residency_type', ['permanent', 'temporary', 'migrant']);
            $table->text('resident_picture_path')->nullable();
            $table->boolean('is_disabled')->default(false);
            $table->string('ethnicity', 155)->nullable();
            $table->enum('status', ['active', 'inactive', 'deceased']);
            $table->foreignId('household_id')->nullable()->constrained('households')->onDelete('set null');
            $table->boolean('is_household_head')->default(false);
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('set null');
            $table->boolean('is_family_head')->default(false);
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

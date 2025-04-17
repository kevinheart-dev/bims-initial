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
            $table->char('suffix', 5)->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->date('birthdate');
            $table->unsignedTinyInteger('age');
            $table->string('birthplace', 150);
            $table->enum('civil_status', ['single', 'married', 'widowed', 'separated', 'divorced', 'others']);
            $table->string('civil_status_other', 55)->nullable();
            $table->enum('voter_status', ['registered', 'not_registered', 'inactive', 'deceased']);
            $table->string('precint_no', 55)->nullable();
            $table->enum('employment_status', ['employed', 'unemployed', 'student', 'retired', 'others']);
            $table->enum('educational_attainment', [
                'No Formal Education', 'Elementary Level', 'Elementary Graduate',
                'High School Level', 'High School Graduate',
                'College Level', 'College Graduate',
                'Vocational', 'Post Graduate', 'ALS Graduate'
            ]);
            $table->string('nationality', 55);
            $table->string('religion', 55)->nullable();
            $table->string('contact_number', 15)->nullable();
            $table->string('email', 55)->nullable();
            $table->char('purok', 5);
            $table->date('residency_date')->nullable();
            $table->binary('resident_picture')->nullable();
            $table->boolean('is_disabled')->default(false);
            $table->string('ethnicity', 155)->nullable();
            $table->enum('status', ['active', 'inactive', 'deceased'])->default('active');
            $table->foreignId('household_id')->nullable()->constrained('households')->onDelete('set null');
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('set null');
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

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
        Schema::create('medical_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->decimal('weight_kg', 5, 2);
            $table->decimal('height_cm', 5, 2);
            $table->string('emergency_contact_number', 20);
            $table->string('emergency_contact_name', 55);
            $table->string('emergency_contact_relationship', 55);
            $table->boolean('is_smoker')->default(false);
            $table->boolean('is_alcohol_user')->default(true);
            $table->char('blood_type', 5);
            $table->boolean('has_philhealth')->default(true);
            $table->string('philhealth_id_number', 30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_information');
    }
};

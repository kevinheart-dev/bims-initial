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
            $table->string('medical_condition', 255)->nullable();
            $table->string('allergies', 255)->nullable();
            $table->char('blood_type', 5)->nullable();
            $table->boolean('is_pwd')->default(false);
            $table->string('disability_type', 155)->nullable();
            $table->text('pwd_verification')->nullable();
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

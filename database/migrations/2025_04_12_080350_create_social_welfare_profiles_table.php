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
        Schema::create('social_welfare_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->boolean('is_4ps_beneficiary')->nullable()->default(false);
            $table->boolean('is_solo_parent')->nullable()->default(false);
            $table->boolean('is_out_of_school_youth')->nullable()->default(false);
            $table->boolean('is_out_of_school_children')->nullable()->default(false);
            $table->string('solo_parent_id_number', 100)->nullable();
            $table->string('philsys_card_no', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_welfare_profiles');
    }
};

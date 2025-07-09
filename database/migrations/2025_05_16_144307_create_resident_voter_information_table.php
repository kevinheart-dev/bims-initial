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
        Schema::create('resident_voter_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('registered_barangay_id')->nullable()->constrained('barangays')->onDelete('cascade');
            $table->string('voter_id_number', 50)->nullable();
            $table->enum('voting_status', [
                'active',
                'inactive',
                'disqualified',
                'medical',
                'overseas',
                'detained',
                'deceased'
            ])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resident_voter_information');
    }
};

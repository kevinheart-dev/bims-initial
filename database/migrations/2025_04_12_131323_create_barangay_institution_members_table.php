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
        Schema::create('barangay_institution_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('barangay_institutions')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->date('member_since');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_institution_members');
    }
};

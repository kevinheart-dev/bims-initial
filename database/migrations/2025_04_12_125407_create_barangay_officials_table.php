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
        Schema::create('barangay_officials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->enum('position', [
                'barangay captain',
                'barangay secretary',
                'barangay treasurer',
                'councilor',
                'sk chairman',
                'sk member',
                'health worker',
                'tanod'
            ]);
            $table->date('term_start');
            $table->date('term_end')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_officials');
    }
};

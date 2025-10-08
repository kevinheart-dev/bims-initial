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
            $table->foreignId('institution_id')
                ->constrained('barangay_institutions')
                ->cascadeOnDelete();
            $table->foreignId('resident_id')
                ->constrained('residents')
                ->cascadeOnDelete();
            $table->boolean('is_head')->default(false);
            $table->date('member_since')->nullable(); // Optional if some members' start date is unknown
            $table->enum('status', ['active', 'inactive'])->default('active');
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

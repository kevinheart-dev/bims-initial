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
        Schema::create('barangay_institutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('name', 255);
            $table->string('type', 100)->nullable(); // youth org, coop, religious group, etc.
            $table->text('description')->nullable();
            $table->year('year_established')->nullable();
            $table->enum('status', ['active', 'inactive', 'dissolved'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_institutions');
    }
};

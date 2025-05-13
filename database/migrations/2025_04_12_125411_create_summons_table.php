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
        Schema::create('summons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blotter_id')->nullable()->constrained('blotter_reports')->onDelete('cascade');
            $table->enum('resolution_status', ['pending', 'resolved', 'dismissed']);
            $table->text('remarks');
            $table->foreignId('issued_by')->nullable()->constrained('barangay_officials')->onDelete('cascade');
            $table->date('issued_date');
            $table->date('schedule_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summons');
    }
};

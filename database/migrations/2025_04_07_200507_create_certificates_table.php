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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->enum('request_status', ['pending', 'approved', 'denied', 'issued']);
            $table->text('purpose')->nullable();
            $table->date('issued_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};

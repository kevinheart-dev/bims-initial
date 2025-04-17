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
        Schema::create('puroks', function (Blueprint $table) {
            $table->id('purok_id');
            $table->foreignId('barangay_id')->constrained('barangays', 'barangay_id')->onDelete('cascade');
            $table->integer('purok_number');
            $table->foreignId('barangay_official_id')->nullable()->constrained('officials', 'id')->nullOnDelete();
            $table->foreignId('sk_kagawad_id')->nullable()->constrained('officials', 'id')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('puroks');
    }
};

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
        Schema::create('bodies_of_lands', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');
            $table->string('type', 55);
            $table->boolean('exists')->default(false);
            $table->string('name', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bodies_of_lands');
    }
};

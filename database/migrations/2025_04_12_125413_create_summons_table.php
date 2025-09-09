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
            $table->foreignId('blotter_id')
                ->constrained('blotter_reports')
                ->cascadeOnDelete();

            $table->enum('status', ['on_going', 'closed'])
                ->default('on_going'); // overall case status

            $table->text('remarks')->nullable();

            $table->foreignId('issued_by')
                ->nullable()
                ->constrained('barangay_officials')
                ->nullOnDelete();

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

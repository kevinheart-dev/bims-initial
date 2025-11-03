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

            $table->enum('status', ['arbitration', 'medication','conciliation', 'issued_file_to_action', 'closed'])
                ->default('medication'); // overall case status

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

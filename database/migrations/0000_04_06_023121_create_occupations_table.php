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
        Schema::create('occupations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('occupation', 100);
            $table->enum('employment_type', ['full-time', 'part-time', 'seasonal', 'contractual', 'self-employed', 'others']);
            $table->string('occupation_other', 155)->nullable();
            $table->string('employer', 155)->nullable();
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->decimal('monthly_income', 11, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('occupations');
    }
};

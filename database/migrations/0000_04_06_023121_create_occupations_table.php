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
            $table->foreignId('resident_id')->nullable()->constrained('residents')->onDelete('cascade');
            $table->foreignId('occupation_type_id')->nullable()->constrained('occupation_types')->onDelete('set null');
            $table->enum('employment_type', ['full-time', 'part-time', 'seasonal', 'contractual', 'self-employed', 'others']);
            $table->enum('work_arrangement', ['remote', 'on-site', 'hybrid']);
            $table->string('occupation_other', 155)->nullable();
            $table->string('employer', 155)->nullable();
            $table->enum('job_sector', ['agriculture', 'services', 'manufacturing', 'government', 'other'])->nullable();
            $table->enum('occupation_status', ['active', 'inactive', 'ended', 'retired'])->default('active');
            $table->boolean('is_ofw')->default(false);
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

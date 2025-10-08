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
        Schema::create('livelihoods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('livelihood_type', 155);
            $table->string('description', 255)->nullable();
            $table->boolean('is_main_livelihood')->default(true);
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
            $table->decimal('monthly_income', 11, 2)->nullable();
            $table->enum('status', ['active', 'inactive', 'seasonal', 'ended'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livelihoods');
    }
};

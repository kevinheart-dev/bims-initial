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
            $table->foreignId('resident_id')->nullable()->constrained('residents'
            )->onDelete('cascade');
            $table->foreignId('livelihood_type_id')->nullable()->constrained('livelihood_types')->onDelete('set null');
            $table->decimal('monthly_income', 11, 2)->nullable();
            $table->string('other', 155)->nullable();
            $table->boolean('is_main_livelihood')->default(false);
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();
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

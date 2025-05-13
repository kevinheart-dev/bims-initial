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
        Schema::create('household_water_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->enum('water_source_type', [
                'level_ii_water_system',
                'level_iii_water_system',
                'deep_well_level_i',
                'artesian_well_level_i',
                'shallow_well_level_i',
                'commercial_water_refill_source',
                'not_mentioned_specify'
            ]);
            $table->string('other_source', 55)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_water_sources');
    }
};

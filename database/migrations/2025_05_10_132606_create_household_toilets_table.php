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
        Schema::create('household_toilets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->enum('toilet_type', [
                'flush_toilet',
                'water_sealed',
                'compost_pit_toilet',
                'shared_communal_public_toilet',
                'no_latrine',
                'not_mentioned_specify'
            ]);
            $table->string('other_type', 55)->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_toilets');
    }
};

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
        Schema::create('household_waste_management', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->enum('waste_management_type', [
                'open_dump_site',
                'sanitary_landfill',
                'compost_pits',
                'material_recovery_facility',
                'garbage_is_collected',
                'not_mentioned_specify'
            ]);
            $table->string('other_management', 55)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_waste_management');
    }
};

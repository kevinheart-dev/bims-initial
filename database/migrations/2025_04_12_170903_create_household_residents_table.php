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
        Schema::create('household_residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('household_id')->constrained('households')->onDelete('cascade');
            $table->boolean('is_household_head')->default(false);
            $table->boolean('is_family_member')->default(true);
            $table->string('relationship_to_head', 155)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('household_residents');
    }
};

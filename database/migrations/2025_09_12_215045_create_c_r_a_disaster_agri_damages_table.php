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
        Schema::create('c_r_a_disaster_agri_damages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disaster_id')
                ->constrained('c_r_a_disaster_occurances')
                ->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');
            $table->text('description')->nullable(); // e.g. rice fields, livestock, crops affected
            $table->integer('value')->default(0);    // cost or quantity of damage
            $table->string('source', 150)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_agri_damages');
    }
};

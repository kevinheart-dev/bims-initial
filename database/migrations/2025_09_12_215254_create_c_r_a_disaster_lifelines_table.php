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
        Schema::create('c_r_a_disaster_lifelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disaster_id')
                ->constrained('c_r_a_disaster_occurances')
                ->onDelete('cascade');

            $table->foreignId('category_id')
                ->constrained('c_r_a_damage_categories') // or a separate lifeline_categories table if you want
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->text('description')->nullable();   // e.g. "Power lines down in Purok 5"
            $table->string('value', 150)->nullable(); // can store status/value (e.g. "Partial outage", "5 transformers")
            $table->string('source', 150)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_lifelines');
    }
};

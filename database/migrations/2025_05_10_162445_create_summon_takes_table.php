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
        Schema::create('summon_takes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('summon_id')->constrained('summons')->onDelete('cascade');
            $table->tinyInteger('session_number');
            $table->date('summon_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('summon_takes');
    }
};

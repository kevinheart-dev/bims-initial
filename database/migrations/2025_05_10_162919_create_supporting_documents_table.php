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
        Schema::create('supporting_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blotter_id')->constrained('blotter_reports')->onDelete('cascade');
            $table->foreignId('incident_id')->constrained('incident_reports')->onDelete('cascade');
            $table->foreignId('summon_id')->constrained('summons')->onDelete('cascade');
            $table->text('supporting_document');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supporting_documents');
    }
};

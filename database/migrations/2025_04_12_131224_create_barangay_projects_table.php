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
        Schema::create('barangay_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('title', 55);
            $table->text('description');
            $table->enum('status', ['planning', 'ongoing', 'completed', 'cancelled']);
            $table->string('category', 55);
            $table->foreignId('responsible_institution_id')->nullable()->constrained('barangay_institutions')->onDelete('set null')->nullable();
            $table->decimal('budget', 12, 2);
            $table->string('funding_source', 100);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_projects');
    }
};

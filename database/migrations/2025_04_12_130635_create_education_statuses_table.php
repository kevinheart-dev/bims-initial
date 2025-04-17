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
        Schema::create('education_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->boolean('school_age')->default(true);
            $table->boolean('enrolled_in_school')->default(false);
            $table->string('educational_attainment', 100)->nullable();
            $table->text('dropout_reason')->nullable();
            $table->boolean('als_participant')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_statuses');
    }
};

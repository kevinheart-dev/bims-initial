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
        Schema::create('child_health_monitoring_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->date('record_date');
            $table->decimal('age_in_months', 5, 2);
            $table->decimal('head_circumference', 5, 2);
            $table->enum('nutrition_status', [
                'normal',
                'underweight',
                'severely_underweight',
                'overweight',
                'stunted',
                'wasted'
            ])->default('normal');
            $table->text('developmental_milestones');
            $table->boolean('immunizations_updated')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('child_health_monitoring_records');
    }
};

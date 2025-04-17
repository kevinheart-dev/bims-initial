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
        Schema::create('social_assistances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->enum('assistance_type', [
                '4Ps', 'Financial Aid', 'Livelihood Assistance', 'Educational Assistance',
                'Medical Assistance', 'Senior Citizen Pension', 'PWD Support',
                'Solo Parent Support', 'Others'
            ]);
            $table->decimal('amount', 10, 2)->nullable();
            $table->enum('assistance_status', ['active', 'inactive', 'suspended'])->default('active');
            $table->string('assistance_source')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_assistances');
    }
};

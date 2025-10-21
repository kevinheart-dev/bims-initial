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
        Schema::create('c_r_a_disaster_occurances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('disaster_name', 55);
            $table->string('year', 35);
            $table->timestamps();
            $table->unique(
                ['barangay_id', 'disaster_name', 'year', 'cra_id'],
                'cra_disaster_unique' // <- short, under 64 chars
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_occurances');
    }
};

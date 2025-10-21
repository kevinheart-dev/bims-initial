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
        Schema::create('c_r_a_disaster_effect_impacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('disaster_id')
                ->constrained('c_r_a_disaster_occurances')
                ->onDelete('cascade');

            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('effect_type', 100); // e.g. economic loss, agricultural damage, power outage, etc.
            $table->integer('value')->default(0);
            $table->string('source', 100)->nullable();
            $table->timestamps();
            $table->unique(
    ['barangay_id', 'disaster_id', 'effect_type', 'cra_id'],
                'cra_dis_eff_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_disaster_effect_impacts');
    }
};

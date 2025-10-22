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
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('disaster_id')
                ->constrained('c_r_a_disaster_occurances')
                ->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('category', 100)->nullable();
            $table->string('description', 255)->nullable();
            $table->string('value', 150)->nullable(); // can store status/value (e.g. "Partial outage", "5 transformers")
            $table->string('source', 150)->nullable();
            $table->timestamps();
            $table->unique(
    ['barangay_id', 'disaster_id', 'category', 'description', 'cra_id'],
                'cra_dis_lifelines_unique'
            );
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

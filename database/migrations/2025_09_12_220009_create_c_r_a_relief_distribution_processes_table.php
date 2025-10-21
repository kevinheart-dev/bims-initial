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
        Schema::create('c_r_a_relief_distribution_processes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->integer('step_no'); // e.g., 1, 2, 3, ...
            $table->text('distribution_process'); // detailed step description
            $table->string('origin_of_goods', 150)->nullable(); // LGU, NGO, private, etc.
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'step_no', 'cra_id'], 'cra_relief_process_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_relief_distribution_processes');
    }
};

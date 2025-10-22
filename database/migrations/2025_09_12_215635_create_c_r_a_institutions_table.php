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
        Schema::create('c_r_a_institutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cra_id')->nullable()->constrained('community_risk_assessments')->onDelete('cascade');
            $table->unsignedBigInteger('barangay_id');
            $table->string('name')->nullable(); // unique per barangay
            $table->integer('male_members')->default(0);
            $table->integer('female_members')->default(0);
            $table->integer('lgbtq_members')->default(0);
            $table->string('head_name')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('registered')->default('NO');
            $table->text('programs_services')->nullable();
            $table->timestamps();
            $table->unique(['barangay_id', 'name', 'cra_id']); // 👈 required
            $table->foreign('barangay_id')->references('id')->on('barangays')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_r_a_institutions');
    }
};

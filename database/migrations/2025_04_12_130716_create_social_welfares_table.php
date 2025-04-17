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
        Schema::create('social_welfares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->boolean('is_4ps_beneficiary')->default(false);
            $table->boolean('is_indigent')->default(false);
            $table->boolean('is_solo_parent')->default(false);
            $table->boolean('orphan_status')->default(false);
            $table->boolean('financial_assistance')->default(false);
            $table->date('beneficiary_since')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_welfares');
    }
};

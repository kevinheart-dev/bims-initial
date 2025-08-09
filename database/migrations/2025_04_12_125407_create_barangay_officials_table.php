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
        Schema::create('barangay_officials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->foreignId('term_id')->constrained('barangay_official_terms')->onDelete('cascade');
            $table->enum('position', [
                'barangay_captain',
                'barangay_secretary',
                'barangay_treasurer',
                'barangay_kagawad',
                'sk_chairman',
                'sk_kagawad',
                'health_worker',
                'tanod'
            ]);
            $table->enum('status', ['active', 'inactive']);
            $table->enum('appointment_type', ['elected', 'appointed', 'succession']);
            $table->foreignId('appointted_by')->nullable()->constrained('residents')->onDelete('cascade'); // assumes reference to a user or resident
            $table->text('appointment_reason')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_officials');
    }
};

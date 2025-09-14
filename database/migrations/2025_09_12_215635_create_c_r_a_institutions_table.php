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
            $table->foreignId('barangay_id')
                ->constrained('barangays')
                ->onDelete('cascade');

            $table->string('name', 150);
            $table->integer('male_members')->default(0);
            $table->integer('female_members')->default(0);
            $table->integer('lgbtq_members')->default(0);

            $table->string('head_name', 150)->nullable();
            $table->string('contact_no', 50)->nullable();

            $table->enum('registered', ['YES', 'NO'])->default('NO');
            $table->text('programs_services')->nullable();
            $table->timestamps();
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

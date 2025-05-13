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
        Schema::create('educational_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->string('school_name', 155);
            $table->boolean('enrolled_now')->default(true);
            $table->enum('school_type', ['private', 'public']);
            $table->enum('educational_attainment', [
                'no_formal_education',
                'elementary_level',
                'elementary_graduate',
                'high_school_level',
                'high_school_graduate',
                'college_level',
                'college_graduate',
                'vocational',
                'post_graduate',
                'als_graduate'
            ]);
            $table->text('dropout_reason')->nullable();
            $table->boolean('als_participant')->default(false);
            $table->year('start_year');
            $table->year('end_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_histories');
    }
};

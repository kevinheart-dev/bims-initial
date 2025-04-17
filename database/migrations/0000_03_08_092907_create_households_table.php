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
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->foreignId('purok_id')->constrained('puroks')->onDelete('cascade');
            $table->foreignId('street_id')->constrained('streets')->onDelete('cascade');
            $table->boolean('internet_access');
            $table->integer('house_number');
            $table->enum('ownership_type', ['owned', 'rented', 'shared', 'government-provided', 'inherited', 'others']);
            $table->string('ownership_details', 100)->nullable();
            $table->enum('housing_condition', ['good', 'needs repair', 'dilapidated']);
            $table->year('year_established')->nullable();
            $table->enum('house_structure', ['concrete', 'semi-concrete', 'wood', 'makeshift']);
            $table->enum('toilet_type', [
                'water sealed',
                'compost pit toilet',
                'shared or communal toilet/public toilet',
                'no latrine',
                'not mentioned above (specify)'
            ]);
            $table->string('toilet_other', 100)->nullable();
            $table->enum('electricity_source', [
                'distribution company (iselco-ii)',
                'generator',
                'solar (renewable energy source)',
                'battery',
                'not mentioned above (specify)',
                'none'
            ]);
            $table->string('electricity_source_other', 100)->nullable();
            $table->enum('water_source', [
                'level ii water system',
                'level iii water system',
                'deep well (level i)',
                'artesian well (level i)',
                'shallow well (level i)',
                'commercial water refill source',
                'not mentioned above (specify)'
            ]);
            $table->string('water_source_other', 100)->nullable();
            $table->enum('bath_and_wash_area', [
                'with own sink and bath',
                'shared or communal',
                'not mentioned above (specify)'
            ]);
            $table->string('bath_and_wash_area_other', 100)->nullable();
            $table->enum('waste_management', [
                'open dump site',
                'sanitary landfill',
                'compost pits',
                'material recovery facility (mrf)',
                'garbage is collected',
                'not mentioned above (specify)'
            ]);
            $table->string('waste_management_other', 100)->nullable();
            $table->tinyInteger('number_of_rooms');
            $table->tinyInteger('number_of_floors');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};

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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barangay_id')->constrained('barangays')->onDelete('cascade');
            $table->string('item_name', 100);
            $table->enum('category', ['medicine', 'relief goods', 'equipment']);
            $table->integer('quantity');
            $table->enum('unit', ['pcs', 'kg', 'liters']);
            $table->date('recieved_date');
            $table->string('supplier', 55)->nullable();
            $table->enum('status', ['available', 'low stock', 'out of stock'])->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};

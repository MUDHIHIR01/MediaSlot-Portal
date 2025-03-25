<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->increments('invoice_id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('booking_id');
            $table->decimal('total_amount', 15, 2);
            $table->string('status')->default('unpaid');
            $table->string('invoice_number')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
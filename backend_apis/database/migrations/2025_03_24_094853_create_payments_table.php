<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('payment_id');
            $table->unsignedInteger('invoice_id');
            $table->unsignedInteger('user_id'); // Captured via Auth
            $table->decimal('amount_paid', 8, 2); // User-entered amount paid
            $table->string('ref_number')->nullable(); // Reference number entered by user
            $table->string('receipt_picture')->nullable(); // URL to uploaded receipt picture
            $table->string('payment_method')->nullable(); // e.g., "credit_card", "paypal"
            $table->string('status')->default('pending'); // e.g., "pending", "completed", "failed"
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
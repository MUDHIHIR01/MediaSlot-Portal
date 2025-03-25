<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->increments('booking_id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('ad_slot_id');
            $table->integer('quantity')->default(1); // For CPM-based ads or multiple days/hours
            $table->decimal('total_cost', 15, 2);
            $table->string('duration_type'); // "hours", "days", "permanent", "impressions"
            $table->integer('duration_value')->nullable(); // Number of hours/days or impressions
            $table->string('status')->default('pending');
            $table->timestamps();

        
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
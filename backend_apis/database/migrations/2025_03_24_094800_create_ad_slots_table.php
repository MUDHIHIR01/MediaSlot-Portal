<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_slots', function (Blueprint $table) {
            $table->increments('ad_slot_id');
            $table->string('ad_type'); // e.g., "Standard Banner", "High-Impact Ad", "Special Execution"
            $table->string('ad_unit'); // e.g., "Leader board", "Roadblock", "Brand button"
            $table->string('dimensions'); // e.g., "728x90", "300x250"
            $table->string('device'); // "Desktop & Mobile", "Desktop Only", "Mobile Only"
            $table->string('platform'); // e.g., "Mwananchi", "Citizen", "MwanaSpoti", "East African"
            $table->string('placement_type'); // e.g., "RON", "MWI MSICZ"
            $table->string('rate'); // Using larger precision for TZS prices
            $table->string('rate_unit'); // "CPM USD", "TZS per hour", "TZS per day"
            $table->string('duration_limit')->nullable(); // e.g., "24 Hour Maximum", "Permanent"
            $table->boolean('available')->default(true);
            $table->string('image')->nullable(); // Preserved for ad slot preview or reference
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_slots');
    }
};
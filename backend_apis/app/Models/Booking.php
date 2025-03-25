<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $primaryKey = 'booking_id';
    public $incrementing = true;

    protected $fillable = [
        'user_id', 'ad_slot_id', 'quantity', 'total_cost', 
        'duration_type', 'duration_value', 'status',
    ];

   
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function adSlot()
    {
        return $this->belongsTo(AdSlot::class, 'ad_slot_id', 'ad_slot_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class, 'booking_id', 'booking_id');
    }
}
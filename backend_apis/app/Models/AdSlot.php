<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdSlot extends Model
{
    protected $primaryKey = 'ad_slot_id';
    public $incrementing = true;

    protected $fillable = [
        'ad_type', 'ad_unit', 'dimensions', 'device', 'platform', 
        'placement_type', 'rate', 'rate_unit', 'duration_limit', 
        'available', 'image',
    ];

   
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'ad_slot_id', 'ad_slot_id');
    }
}
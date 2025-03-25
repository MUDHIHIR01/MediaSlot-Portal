<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $primaryKey = 'invoice_id';
    public $incrementing = true;

    protected $fillable = [
        'user_id', 'booking_id', 'total_amount', 'status', 'invoice_number',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id'); 
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'booking_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'invoice_id', 'invoice_id');
    }
}
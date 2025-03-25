<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $primaryKey = 'payment_id';
    public $incrementing = true;

    protected $fillable = [
        'invoice_id', 'user_id', 'amount_paid', 'ref_number', 'receipt_picture', 'payment_method', 'status',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'invoice_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
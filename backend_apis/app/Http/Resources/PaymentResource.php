<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'payment_id' => $this->payment_id,
            'invoice_id' => $this->invoice_id,
            'user_id' => $this->user_id,
            'amount_paid' => $this->amount_paid,
            'ref_number' => $this->ref_number,
            'receipt_picture' => $this->receipt_picture,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'invoice_id' => $this->invoice_id,
            'user_id' => $this->user_id,
            'booking_id' => $this->booking_id,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'invoice_number' => $this->invoice_number,
            'booking' => new BookingResource($this->whenLoaded('booking')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
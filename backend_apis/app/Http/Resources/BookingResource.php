<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'booking_id' => $this->booking_id,
            'user_id' => $this->user_id,
            'ad_slot_id' => $this->ad_slot_id,
            'quantity' => $this->quantity,
            'total_cost' => $this->total_cost,
            'duration_type' => $this->duration_type,
            'duration_value' => $this->duration_value,
            'status' => $this->status,
            'ad_slot' => new AdSlotResource($this->whenLoaded('adSlot')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
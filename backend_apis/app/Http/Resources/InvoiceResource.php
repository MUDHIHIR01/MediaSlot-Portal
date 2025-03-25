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
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

class BookingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'booking_id' => $this->booking_id,
            'total_cost' => $this->total_cost,
            'status' => $this->status,
            'ad_slot_id' => $this->ad_slot_id,
            'ad_slot' => new AdSlotResource($this->whenLoaded('adSlot')),
            'created_at' => $this->created_at,
        ];
    }
}

class AdSlotResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ad_slot_id' => $this->ad_slot_id,
            'ad_type' => $this->ad_type,
        ];
    }
}

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'user_id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
        ];
    }
}
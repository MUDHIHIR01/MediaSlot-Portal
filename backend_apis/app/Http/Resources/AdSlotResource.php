<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdSlotResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ad_slot_id' => $this->ad_slot_id,
            'ad_type' => $this->ad_type,
            'ad_unit' => $this->ad_unit,
            'dimensions' => $this->dimensions,
            'device' => $this->device,
            'platform' => $this->platform,
            'placement_type' => $this->placement_type,
            'rate' => $this->rate,
            'rate_unit' => $this->rate_unit,
            'duration_limit' => $this->duration_limit,
            'available' => $this->available,
            'image' => $this->image,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
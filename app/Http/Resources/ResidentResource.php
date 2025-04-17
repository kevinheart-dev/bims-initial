<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResidentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'lastname' => $this->lastname,
            'suffix' => $this->suffix,
            'gender' => $this->gender,
            'birthdate' => $this->birthdate,
            'is_solo_parent' => $this->is_solo_parent,
            'nationality' => $this->nationality,
            'religion' => $this->religion,
            'educational_attainment' => $this->educational_attainment,
            'contact_number' => $this->contact_number,
            'email' => $this->email,
            'purok' => $this->purok,
            'residency_date' => $this->residency_date,
            'resident_picture' => $this->resident_picture,
            'status' => $this->status,
        ];
    }
}

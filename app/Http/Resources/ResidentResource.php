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
            // Basic Information
            'id' => $this->id,
            'barangay_id' => $this->barangay_id,
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'lastname' => $this->lastname,
            'suffix' => $this->suffix,
            'maiden_name' => $this->maiden_name,
            'gender' => $this->gender,
            'birthdate' => $this->birthdate,
            'birthplace' => $this->birthplace,
            'civil_status' => $this->civil_status,
            'registered_voter' => $this->registered_voter,
            'employment_status' => $this->employment_status,
            'citizenship' => $this->citizenship,
            'religion' => $this->religion,
            'contact_number' => $this->contact_number,
            'email' => $this->email,
            'purok_number' => $this->purok_number,
            'street_id' => $this->street_id,
            'residency_date' => $this->residency_date,
            'residency_type' => $this->residency_type,
            'resident_picture_path' => $this->resident_picture_path,
            'is_pwd' => $this->is_pwd,
            'ethnicity' => $this->ethnicity,
            'date_of_death' => $this->date_of_death,
            'household_id' => $this->household_id,
            'is_household_head' => $this->is_household_head,
            'family_id' => $this->family_id,
            'is_family_head' => $this->is_family_head,
            'verified' => $this->verified,
            // Relationships
            'voting_information' => $this->whenLoaded('votingInformation'),
            'educational_histories' => $this->whenLoaded('educationalHistories'),
            'occupations' => $this->whenLoaded('occupations'),
            'medical_information' => $this->whenLoaded('medicalInformation'),
            'disabilities' => $this->whenLoaded('disabilities'),
            'vehicles' => $this->whenLoaded('vehicles'),
            'social_welfare_profile' => $this->whenLoaded('socialwelfareprofile'),
            'senior_citizen' => $this->whenLoaded('seniorcitizen'),
            'household' => $this->whenLoaded('household'),
            'family' => $this->whenLoaded('family'),
            'street' => $this->whenLoaded('street'),
            'purok' => $this->whenLoaded('street.purok'),
            'barangay' => $this->whenLoaded('barangay'),
        ];
    }
}

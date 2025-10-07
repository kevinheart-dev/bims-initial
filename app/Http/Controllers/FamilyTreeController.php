<?php

namespace App\Http\Controllers;

use App\Http\Requests\FamilyTreeStoreRequest;
use App\Models\FamilyRelation;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;

class FamilyTreeController extends Controller
{
    public function store(FamilyTreeStoreRequest $request)
    {
        $data = $request->validated();

        // baliktad
        $residentId = $data['related_to'] ?? null;
        $relatedTo  = $data['resident_id'] ?? null;

        $relation   = strtolower(trim($data['relationship'] ?? ''));

        if (!$residentId || !$relatedTo || !$relation) {
            return redirect()->back()
                ->with('error', 'Missing required data: resident, related resident, or relationship.');
        }

        try {
            switch ($relation) {
                case 'spouse':
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $residentId,
                        'related_to' => $relatedTo,
                        'relationship' => 'spouse',
                    ]);
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $relatedTo,
                        'related_to' => $residentId,
                        'relationship' => 'spouse',
                    ]);
                    break;

                case 'parent':
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $residentId,
                        'related_to' => $relatedTo,
                        'relationship' => 'parent',
                    ]);
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $relatedTo,
                        'related_to' => $residentId,
                        'relationship' => 'child',
                    ]);
                    break;

                case 'child':
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $residentId,
                        'related_to' => $relatedTo,
                        'relationship' => 'child',
                    ]);
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $relatedTo,
                        'related_to' => $residentId,
                        'relationship' => 'parent',
                    ]);
                    break;

                case 'sibling':
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $residentId,
                        'related_to' => $relatedTo,
                        'relationship' => 'sibling',
                    ]);
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $relatedTo,
                        'related_to' => $residentId,
                        'relationship' => 'sibling',
                    ]);
                    break;

                default:
                    return redirect()->back()
                        ->with('error', 'Invalid relationship type.');
            }

            return redirect()->back()
                ->with('success', 'Family relation added successfully!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error storing family relation: ' . $e->getMessage());
        }
    }
}

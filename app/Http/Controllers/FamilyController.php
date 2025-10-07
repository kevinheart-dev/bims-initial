<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResidentResource;
use App\Models\Family;
use App\Http\Requests\StoreFamilyRequest;
use App\Http\Requests\UpdateFamilyRequest;
use App\Models\FamilyRelation;
use App\Models\HouseholdResident;
use App\Models\Purok;
use App\Models\Resident;
use DB;
use Inertia\Inertia;

class FamilyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $barangayId = auth()->user()->barangay_id;
        $request = request();

        // 🟢 Load puroks for filters
        $puroks = Purok::where('barangay_id', $barangayId)
            ->orderBy('purok_number')
            ->pluck('purok_number');

        // 🟢 Base query
        $query = Family::query()
            ->where('barangay_id', $barangayId)
            ->withCount(['members as family_member_count' => function ($q) use ($barangayId) {
                $q->where('barangay_id', $barangayId);
            }])
            ->with([
                // include `family_id` so Laravel can link relationship
                'latestHead:id,family_id,firstname,lastname,street_id,is_family_head',

                'latestHead.householdResidents.household:id,purok_id,house_number',
                'latestHead.street:id,purok_id,street_name',
                'latestHead.street.purok:id,purok_number',
            ]);

        // 🟡 Search by family name or house number
        if ($name = $request->get('name')) {
            $like = "%{$name}%";
            $query->where(function ($q) use ($like) {
                $q->where('family_name', 'like', $like)
                    ->orWhereHas('members.householdResidents.household', function ($sub) use ($like) {
                        $sub->where('house_number', 'like', $like);
                    });
            });
        }

        // 🟡 Filter by Purok
        if (($purok = $request->get('purok')) && $purok !== 'All') {
            $query->whereHas('members.householdResidents.household.purok', function ($q) use ($purok) {
                $q->where('purok_number', $purok);
            });
        }

        // 🟡 Filter by Family Type
        if (($famtype = $request->get('famtype')) && $famtype !== 'All') {
            $query->where('family_type', $famtype);
        }

        // 🟡 Filter by Income Bracket
        if (($income = $request->get('income_bracket')) && $income !== 'All') {
            $query->where('income_bracket', $income);
        }

        // 🟡 Filter by Household Head
        if (($head = $request->get('household_head')) && $head !== 'All') {
            $query->whereHas('members', function ($q) use ($head) {
                $q->where('is_household_head', $head);
            });
        }

        // 🟢 Paginate
        $families = $query->paginate(10)->withQueryString();

        return Inertia::render('BarangayOfficer/Family/Index', [
            'families' => $families,
            'queryParams' => $request->query() ?: null,
            'puroks' => $puroks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFamilyRequest $request)
    {
        $data = $request->validated();
        dd($data);
        $resident = HouseholdResident::where('resident_id', $data['resident_id'])->firstOrFail();
        $head = Resident::with('occupations')->findOrFail($data['resident_id']);

        try {
            $members = $data['members'] ?? [];

            // Collect all IDs: head + members
            $allResidentIds = collect($members)->pluck('resident_id')->push($head->id)->unique();

            // Load residents with active occupations
            $residents = Resident::with(['occupations' => function ($q) {
                $q->whereNull('ended_at')->orWhere('ended_at', '>=', now());
            }])->whereIn('id', $allResidentIds)->get();

            // Compute total monthly income from active occupations
            $allIncomes = $residents->flatMap(fn ($r) => $r->occupations)->pluck('monthly_income')->filter();

            $avgIncome = $allIncomes->avg() ?? 0;

            $incomeBracket = match (true) {
                $avgIncome < 5000 => 'below_5000',
                $avgIncome <= 10000 => '5001_10000',
                $avgIncome <= 20000 => '10001_20000',
                $avgIncome <= 40000 => '20001_40000',
                $avgIncome <= 70000 => '40001_70000',
                $avgIncome <= 120000 => '70001_120000',
                default => 'above_120001',
            };

            $incomeCategory = match (true) {
                $avgIncome <= 10000 => 'survival',
                $avgIncome <= 20000 => 'poor',
                $avgIncome <= 40000 => 'low_income',
                $avgIncome <= 70000 => 'lower_middle_income',
                $avgIncome <= 120000 => 'middle_income',
                $avgIncome <= 200000 => 'upper_middle_income',
                default => 'above_high_income',
            };

            // Create the Family record
            $resident->family?->delete();
            $family = Family::create([
                'barangay_id' => $resident->resident->barangay_id,
                'household_id' => $resident->household_id,
                'income_bracket' => $incomeBracket,
                'income_category' =>  $incomeCategory,
                'family_type' => $data['family_type'],
                'family_name' => $data['family_name'] ?? $head->lastname,
            ]);

            // Assign family_id to all residents
            Resident::whereIn('id', $allResidentIds)->update(['family_id' => $family->id]);
            $head->update(['is_family_head' => true]);

            return redirect()->route('family.index')->with('success', 'Family added successfully!');
        } catch (\Exception $e) {
            report($e);
            return back()->with('error', 'Family could not be added: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Family $family)
    {
        //
    }

    public function showFamily(Family $family)
    {
        $family->load(['household.purok', 'members.householdResidents']);

        $household_details = $family->household;

        // 🟢 Base query for members (only select needed columns)
        $query = $family->members()
            ->select([
                'id',
                'firstname',
                'middlename',
                'lastname',
                'suffix',
                'gender',
                'birthdate',
                'employment_status',
                'registered_voter',
                'is_pwd',
            ])
            ->with(['householdResidents:id,resident_id,relationship_to_head,household_position'])
            ->latest();

        // 🟡 Search by name
        if (request()->filled('name')) {
            $name = request('name');
            $query->where(function ($q) use ($name) {
                $like = "%{$name}%";
                $q->where('firstname', 'like', $like)
                    ->orWhere('lastname', 'like', $like)
                    ->orWhere('middlename', 'like', $like)
                    ->orWhere('suffix', 'like', $like)
                    ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", [$like])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", [$like]);
            });
        }

        // 🟡 Gender Filter
        if (request()->filled('gender') && request('gender') !== 'All') {
            $query->where('gender', request('gender'));
        }

        // 🟡 Employment Status
        if (request()->filled('estatus') && request('estatus') !== 'All') {
            $query->where('employment_status', request('estatus'));
        }

        // 🟡 Voter Status
        if (request()->filled('voter_status') && request('voter_status') !== 'All') {
            $query->where('registered_voter', request('voter_status'));
        }

        // 🟡 PWD Filter
        if (request()->filled('is_pwd') && request('is_pwd') !== 'All') {
            $query->where('is_pwd', request('is_pwd'));
        }

        // 🟡 Relation to Head
        if (request()->filled('relation') && request('relation') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('relationship_to_head', request('relation'));
            });
        }

        // 🟡 Household Position
        if (request()->filled('household_position') && request('household_position') !== 'All') {
            $query->whereHas('householdResidents', function ($q) {
                $q->where('household_position', request('household_position'));
            });
        }

        // 🟢 Execute query and map structure
        $members = $query->get()->map(function ($member) {
            return [
                'id' => $member->id,
                'firstname' => $member->firstname,
                'middlename' => $member->middlename,
                'lastname' => $member->lastname,
                'suffix' => $member->suffix,
                'gender' => $member->gender,
                'birthdate' => $member->birthdate,
                'employment_status' => $member->employment_status,
                'registered_voter' => $member->registered_voter,
                'is_pwd' => $member->is_pwd,
                'household_residents' => $member->householdResidents->map(fn($hr) => [
                    'relationship_to_head' => $hr->relationship_to_head,
                    'household_position' => $hr->household_position,
                ]),
            ];
        });

        return Inertia::render("BarangayOfficer/Family/ShowFamily", [
            'family_details' => [
                'id' => $family->id,
                'family_name' => $family->family_name,
                'family_type' => $family->family_type,
                'income_bracket' => $family->income_bracket,
            ],
            'household_details' => [
                'id' => $household_details?->id,
                'house_number' => $household_details?->house_number,
                'purok_number' => $household_details?->purok?->purok_number,
            ],
            'members' => $members,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Family $family)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFamilyRequest $request, Family $family)
    {
        $data = $request->validated();

        $headId = $data['resident_id'];
        $members = $data['members'] ?? [];

        try {
            // capture previous members BEFORE we change anything
            $previousMemberIds = Resident::where('family_id', $family->id)->pluck('id')->toArray();

            // all new member ids (head + members)
            $allResidentIds = collect($members)->pluck('resident_id')->push($headId)->unique()->values()->toArray();

            // Load head & residents (for income calc)
            $head = Resident::with('occupations')->findOrFail($headId);

            $residents = Resident::with(['occupations' => function ($q) {
                $q->whereNull('ended_at')->orWhere('ended_at', '>=', now());
            }])->whereIn('id', $allResidentIds)->get();

            // Compute average income
            $allIncomes = $residents->flatMap(fn ($r) => $r->occupations)->pluck('monthly_income')->filter();
            $avgIncome = $allIncomes->avg() ?? 0;

            $incomeBracket = match (true) {
                $avgIncome < 5000 => 'below_5000',
                $avgIncome <= 10000 => '5001_10000',
                $avgIncome <= 20000 => '10001_20000',
                $avgIncome <= 40000 => '20001_40000',
                $avgIncome <= 70000 => '40001_70000',
                $avgIncome <= 120000 => '70001_120000',
                default => 'above_120001',
            };

            $incomeCategory = match (true) {
                $avgIncome <= 10000 => 'survival',
                $avgIncome <= 20000 => 'poor',
                $avgIncome <= 40000 => 'low_income',
                $avgIncome <= 70000 => 'lower_middle_income',
                $avgIncome <= 120000 => 'middle_income',
                $avgIncome <= 200000 => 'upper_middle_income',
                default => 'above_high_income',
            };

            // Use a transaction to keep DB consistent
            \DB::transaction(function () use ($family, $head, $headId, $members, $allResidentIds, $previousMemberIds, $incomeBracket, $incomeCategory) {

                // 1) Update family meta
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                    'family_name' => $head->lastname,
                ]);

                // 2) Assign family_id to the new/current residents
                if (!empty($allResidentIds)) {
                    Resident::whereIn('id', $allResidentIds)->update(['family_id' => $family->id]);
                }

                // 3) Find removed members (were in family before but not in new list)
                $removed = array_values(array_diff($previousMemberIds, $allResidentIds));

                if (!empty($removed)) {
                    // clear family_id for removed residents
                    Resident::whereIn('id', $removed)->update(['family_id' => null]);

                    // remove their household pivot entries for this household
                    HouseholdResident::whereIn('resident_id', $removed)
                        ->where('household_id', $family->household_id)
                        ->delete();

                    // remove family relations involving removed residents
                    FamilyRelation::where(function ($q) use ($removed) {
                        $q->whereIn('resident_id', $removed)
                        ->orWhereIn('related_to', $removed);
                    })->delete();
                }

                // 4) Remove ALL old FamilyRelation entries for ANY previous family member
                //    (so we can rebuild from scratch for the updated list)
                if (!empty($previousMemberIds)) {
                    FamilyRelation::where(function ($q) use ($previousMemberIds) {
                        $q->whereIn('resident_id', $previousMemberIds)
                        ->orWhereIn('related_to', $previousMemberIds);
                    })->delete();
                }

                // 5) Update / Create household_resident pivot entries for current members
                foreach ($members as $member) {
                    $rid = $member['resident_id'] ?? null;
                    $rel = strtolower(trim($member['relationship_to_head'] ?? ''));
                    $pos = $member['household_position'] ?? null;

                    if (!$rid) {
                        continue;
                    }

                    // skip 'self' in members (head is handled separately)
                    if ($rel === 'self') {
                        continue;
                    }

                    HouseholdResident::updateOrCreate(
                        [
                            'resident_id' => $rid,
                            'household_id' => $family->household_id,
                        ],
                        [
                            'relationship_to_head' => $rel,
                            'household_position' => $pos,
                        ]
                    );
                }

                // 6) Ensure head pivot exists & is correct
                HouseholdResident::updateOrCreate(
                    [
                        'resident_id' => $headId,
                        'household_id' => $family->household_id,
                    ],
                    [
                        'relationship_to_head' => 'self',
                        'household_position' => 'head',
                    ]
                );

                // 7) Rebuild FamilyRelation records for the current members set
                $spouse = collect($members)->firstWhere('relationship_to_head', 'spouse');

                if ($spouse) {
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $headId,
                        'related_to'  => $spouse['resident_id'],
                        'relationship'=> 'spouse',
                    ]);
                    FamilyRelation::firstOrCreate([
                        'resident_id' => $spouse['resident_id'],
                        'related_to'  => $headId,
                        'relationship'=> 'spouse',
                    ]);
                }

                foreach ($members as $member) {
                    $residentId = $member['resident_id'] ?? null;
                    $relationship = strtolower(trim($member['relationship_to_head'] ?? ''));

                    if (!$residentId || $relationship === 'self') {
                        continue;
                    }

                    switch ($relationship) {
                        case 'child':
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $residentId,
                                'related_to' => $headId,
                                'relationship' => 'child',
                            ]);
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $headId,
                                'related_to' => $residentId,
                                'relationship' => 'parent',
                            ]);
                            if ($spouse) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $spouse['resident_id'],
                                    'relationship' => 'child',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $spouse['resident_id'],
                                    'related_to' => $residentId,
                                    'relationship' => 'parent',
                                ]);
                            }
                            break;

                        case 'parent':
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $residentId,
                                'related_to' => $headId,
                                'relationship' => 'parent',
                            ]);
                            FamilyRelation::firstOrCreate([
                                'resident_id' => $headId,
                                'related_to' => $residentId,
                                'relationship' => 'child',
                            ]);
                            break;

                        case 'grandparent':
                            $parents = $head->parents ?? collect();
                            foreach ($parents as $parent) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $parent->id,
                                    'relationship' => 'parent',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $parent->id,
                                    'related_to' => $residentId,
                                    'relationship' => 'child',
                                ]);
                            }
                            break;

                        case 'sibling':
                            $sharedParents = $head->parents ?? collect();
                            foreach ($sharedParents as $parent) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $parent->id,
                                    'related_to' => $residentId,
                                    'relationship' => 'parent',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $parent->id,
                                    'relationship' => 'child',
                                ]);
                            }
                            break;

                        case 'parent_in_law':
                            if ($spouse) {
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $residentId,
                                    'related_to' => $spouse['resident_id'],
                                    'relationship' => 'parent',
                                ]);
                                FamilyRelation::firstOrCreate([
                                    'resident_id' => $spouse['resident_id'],
                                    'related_to' => $residentId,
                                    'relationship' => 'child',
                                ]);
                            }
                            break;
                    }
                }

                // Link siblings (children) to each other
                $children = collect($members)->filter(fn ($m) => strtolower($m['relationship_to_head'] ?? '') === 'child');
                foreach ($children as $i => $childA) {
                    foreach ($children as $j => $childB) {
                        if ($i === $j) continue;
                        FamilyRelation::firstOrCreate([
                            'resident_id' => $childA['resident_id'],
                            'related_to' => $childB['resident_id'],
                            'relationship' => 'sibling',
                        ]);
                    }
                }

                // mark head flag
                $head->update(['is_household_head' => true]);
            });

            return redirect()->route('family.index')->with('success', 'Family updated successfully!');
        } catch (\Exception $e) {
            report($e);
            return back()->with('error', 'Family could not be updated: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Family $family)
    {
        DB::beginTransaction();
        try {
            // Load members and their family relations
            $family->load(['members.familyRelations']);

            // Delete each member's family relations and detach family_id
            foreach ($family->members as $member) {
                $member->familyRelations()->delete();
                $member->update(['family_id' => null]);
            }

            // Delete the family itself
            $family->delete(); // or forceDelete() if using SoftDeletes

            DB::commit();

            return redirect()
                ->route('family.index')
                ->with('success', 'Family permanently deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Family could not be deleted: ' . $e->getMessage());
        }
    }

    public function getFamilyDetails($id)
    {
        $family = Family::with([
            'members.householdResidents:id,resident_id,household_id,relationship_to_head,household_position',
            'members.householdResidents.household:id,house_number'
        ])->findOrFail($id, ['id', 'family_name', 'barangay_id', 'income_bracket', 'family_type']);

        return response()->json([
            'family_details' => $family,
        ]);
    }

    public function remove($id){
        DB::beginTransaction();

        try {
            $resident = Resident::findOrFail($id);

            // Delete all household resident links
            $resident->householdResidents()->delete(); // ✅ Use relationship method, not property
            $resident->familyRelations()->delete(); // ✅ Use relationship method, not property

            // Reset resident's household info
            $resident->update([
                'household_id' => null,
                'family_id' => null,
                'is_household_head' => 0,
            ]);

            DB::commit();

            return back()->with(
                'success', 'Resident removed from family successfully.',
            );

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with(
                'error', 'Failed to remove resident: ' . $e->getMessage(),
            );
        }
    }
    public function getResidentsAndMembersJson()
    {
        $brgyId = auth()->user()->barangay_id;

        // Household heads
        // $residents = HouseholdResident::with('resident:id,barangay_id,household_id,firstname,lastname,middlename,birthdate,purok_number,resident_picture_path', 'resident.latestHousehold')
        //     ->whereHas('resident', function ($query) use ($brgyId) {
        //         $query->where('barangay_id', $brgyId)
        //             ->where('is_household_head', true);
        //     })->select('id', 'resident_id', 'household_id')
        //     ->get();

        // All members
        $members = Resident::with('latestHousehold:household_id,house_number')
        ->where('barangay_id', $brgyId) // filter by barangay
        ->select('id', 'household_id', 'purok_number', 'resident_picture_path', 'firstname', 'middlename', 'lastname', 'birthdate', 'barangay_id')
        ->get();

        // Return as JSON
        return response()->json([
            'members' => $members,
        ]);
    }
}

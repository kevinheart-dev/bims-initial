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
use Illuminate\Support\Facades\Cache;
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

        // 🟢 Load Puroks for filter options (cached for performance)
        $puroks = Cache::rememberForever("puroks_{$barangayId}", function () use ($barangayId) {
            return Purok::where('barangay_id', $barangayId)
                ->orderBy('purok_number')
                ->pluck('purok_number');
        });

        // 🟢 Base Family Query
        $query = Family::withCount(['members as family_member_count' => function ($q) use ($barangayId) {
                $q->where('barangay_id', $barangayId);
            }])
            ->with([
                'latestHead:id,family_id,firstname,lastname,street_id,is_family_head',
                'latestHead.householdResidents.household:id,purok_id,house_number',
                'latestHead.street:id,purok_id,street_name',
                'latestHead.street.purok:id,purok_number',
            ])
            ->where('barangay_id', $barangayId);

        // 🟡 Apply Filters Dynamically
        $filters = [
            'name' => fn($value) => $query->where(function ($q) use ($value) {
                $like = "%{$value}%";
                $q->where('family_name', 'like', $like)
                ->orWhereHas('members.householdResidents.household', fn($sub) => $sub->where('house_number', 'like', $like));
            }),

            'purok' => fn($value) => $value !== 'All'
                ? $query->whereHas('members.householdResidents.household.purok', fn($q) => $q->where('purok_number', $value))
                : null,

            'famtype' => fn($value) => $value !== 'All'
                ? $query->where('family_type', $value)
                : null,

            'income_bracket' => fn($value) => $value !== 'All'
                ? $query->where('income_bracket', $value)
                : null,

            'household_head' => fn($value) => $value !== 'All'
                ? $query->whereHas('members', fn($q) => $q->where('is_household_head', $value))
                : null,
        ];

        foreach ($filters as $key => $applyFilter) {
            if ($value = $request->get($key)) {
                $applyFilter($value);
            }
        }

        // 🟢 Paginate Results
        $families = $query->paginate(10)->withQueryString();

        // 🟢 Return to View
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

        // Head = household head
        $headResidentId = $data['resident_id'];
        $headResident = Resident::with('occupations')->findOrFail($headResidentId);
        $headHouseholdResident = HouseholdResident::where('resident_id', $headResidentId)->firstOrFail();

        try {
            DB::beginTransaction();

            $members = $data['members'] ?? [];

            // Combine head and members
            $allResidentIds = collect($members)
                ->pluck('resident_id')
                ->push($headResidentId)
                ->unique();

            // Load all residents with active occupations
            $residents = Resident::with(['occupations' => function ($q) {
                $q->whereNull('ended_at')->orWhere('ended_at', '>=', now());
            }])->whereIn('id', $allResidentIds)->get();

            // Compute average income
            $avgIncome = $residents->flatMap(fn($r) => $r->occupations)->pluck('monthly_income')->filter()->avg() ?? 0;

            // Determine income levels
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

            // Delete any old family linked to this head (avoid duplicates)
            $headHouseholdResident->family?->delete();

            // Create new family record
            $family = Family::create([
                'barangay_id'     => $headResident->barangay_id,
                'household_id'    => $headHouseholdResident->household_id,
                'income_bracket'  => $incomeBracket,
                'income_category' => $incomeCategory,
                'family_type'     => $data['family_type'],
                'family_name'     => $data['family_name'] ?? $headResident->lastname,
            ]);

            // Update all residents with new family and household IDs
            Resident::whereIn('id', $allResidentIds)->update([
                'family_id' => $family->id,
                'is_family_head' => false,
            ]);

            // Update head
            $headResident->update(['is_family_head' => true]);

            // Update members' household records
            foreach ($members as $member) {
                // Determine the correct household_id
                $householdId = $headHouseholdResident->household_id;

                // Update or create the household_resident record
                HouseholdResident::updateOrCreate(
                    ['resident_id' => $member['resident_id']],
                    [
                        'family_id' => $family->id,
                        'household_id' => $householdId,
                        'relationship_to_head' => $member['relationship_to_head'] ?? null,
                        'household_position' => $member['household_position'] ?? 'primary',
                        'is_household_head' => false,
                    ]
                );

                // Also update the household_id in the residents table
                Resident::where('id', $member['resident_id'])->update([
                    'household_id' => $householdId,
                ]);
            }

            // Update head’s household record
            $isHead = $headHouseholdResident->is_household_head;
            $headHouseholdResident->update([
                'family_id' => $family->id,
                'household_id' => $headHouseholdResident->household_id,
                'relationship_to_head' => 'self',
                'household_position' => $isHead ? 'primary' : 'extended',
                'is_household_head' => $isHead,
            ]);

            DB::commit();

            return redirect()->route('family.index')->with('success', 'Family added successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
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
            $previousMemberIds = Resident::where('family_id', $family->id)->pluck('id')->toArray();
            $allResidentIds = collect($members)->pluck('resident_id')->push($headId)->unique()->values()->toArray();

            $residents = Resident::with(['occupations' => fn($q) =>
                $q->whereNull('ended_at')->orWhere('ended_at', '>=', now())
            ])->whereIn('id', $allResidentIds)->get();

            $allIncomes = $residents->flatMap(fn($r) => $r->occupations)->pluck('monthly_income')->filter();
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

            \DB::transaction(function () use (
                $family, $headId, $members, $allResidentIds,
                $previousMemberIds, $incomeBracket, $incomeCategory, $data
            ) {
                // 1) Update family metadata
                $family->update([
                    'income_bracket' => $incomeBracket,
                    'income_category' => $incomeCategory,
                    'family_type' => $data['family_type']
                ]);

                // 2) Update family_id & household_id for current residents
                if (!empty($allResidentIds)) {
                    Resident::whereIn('id', $allResidentIds)->update([
                        'family_id' => $family->id,
                        'household_id' => $family->household_id,
                    ]);
                }

                // 3) Remove old members no longer in family
                $removed = array_diff($previousMemberIds, $allResidentIds);
                if (!empty($removed)) {
                    Resident::whereIn('id', $removed)->update([
                        'family_id' => null,
                        'household_id' => null,
                    ]);

                    HouseholdResident::whereIn('resident_id', $removed)
                        ->where('household_id', $family->household_id)
                        ->delete();
                }

                // 4) Update or create household_resident for each member
                foreach ($members as $member) {
                    $rid = $member['resident_id'] ?? null;
                    if (!$rid || ($member['relationship_to_head'] ?? '') === 'self') continue;

                    HouseholdResident::updateOrCreate(
                        [
                            'resident_id' => $rid,
                            'household_id' => $family->household_id,
                        ],
                        [
                            'relationship_to_head' => strtolower($member['relationship_to_head'] ?? ''),
                            'household_position' => $member['household_position'] ?? 'primary',
                            'is_household_head' => false,
                        ]
                    );
                }

                // 5) Handle household head logic
                $isNuclear = $data['family_type'] === 'nuclear';

                HouseholdResident::updateOrCreate(
                    [
                        'resident_id' => $headId,
                        'household_id' => $family->household_id,
                    ],
                    [
                        'relationship_to_head' => 'self',
                        'household_position' => $isNuclear ? 'primary' : 'extended',
                        'is_household_head' => $isNuclear,
                    ]
                );

                Resident::where('id', $headId)->update([
                    'is_household_head' => $isNuclear,
                ]);
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

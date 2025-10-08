<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBarangayAccountRequest;
use App\Http\Requests\UpdateBarangayAccountRequest;
use App\Models\Barangay;
use App\Models\EducationalHistory;
use Illuminate\Support\Facades\DB;
use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class SuperAdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // Assuming this is inside your SuperAdminController or similar
    public function index(Request $request)
    {
        $barangayId = $request->query('barangay_id');
        $residentBaseQuery = Resident::where('is_deceased', false);
        $populationPerPurok = collect();

        if ($barangayId) {
            $barangay = Barangay::find($barangayId);
            $barangayName = $barangay ? $barangay->barangay_name : 'Unknown Barangay';
            $residentBaseQuery->where('barangay_id', $barangayId);
            $householdBaseQuery = Household::where('barangay_id', $barangayId);
            $familyBaseQuery = Family::where('barangay_id', $barangayId);
            $populationPerPurok = (clone $residentBaseQuery)
                ->selectRaw('purok_number, COUNT(*) as count')
                ->groupBy('purok_number')
                ->orderBy('purok_number')
                ->pluck('count', 'purok_number');
        } else {
            $barangayName = 'All Barangays';
            $householdBaseQuery = new Household();
            $familyBaseQuery = new Family();
        }
        $residentCount = $residentBaseQuery->count();

        $seniorCitizenCount = (clone $residentBaseQuery)
            ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) >= 60")
            ->count();

        $totalHouseholds = $householdBaseQuery->count();
        $totalFamilies = $familyBaseQuery->count();

        $populationPerBarangay = Barangay::leftJoin('residents', function ($join) {
            $join->on('barangays.id', '=', 'residents.barangay_id')
                ->where('residents.is_deceased', false);
        })
            ->select(
                'barangays.barangay_name',
                DB::raw('COUNT(residents.id) as count')
            )
            ->groupBy('barangays.id', 'barangays.barangay_name')
            ->orderBy('barangays.barangay_name')
            ->pluck('count', 'barangays.barangay_name');

        $familyIncomeData = (clone $familyBaseQuery)
            ->select('income_bracket', DB::raw('COUNT(*) as total'))
            ->groupBy('income_bracket')
            ->get()
            ->map(function ($item) {
                $labels = [
                    'below_5000' => 'Survival',
                    '5001_10000' => 'Poor',
                    '10001_20000' => 'Low Income',
                    '20001_40000' => 'Lower Middle Income',
                    '40001_70000' => 'Middle Income',
                    '70001_120000' => 'Upper Middle Income',
                    'above_120001' => 'High Income',
                ];
                return [
                    'income_bracket' => $item->income_bracket,
                    'income_category' => $labels[$item->income_bracket] ?? 'Unknown',
                    'total' => $item->total,
                ];
            });


        $pwdDistributionData = [
            'PWD' => (clone $residentBaseQuery)->whereHas('disabilities')->count(),
            'nonPWD' => (clone $residentBaseQuery)->whereDoesntHave('disabilities')->count(),
        ];


        $voterDistributionData = [
            'Registered Voters' => (clone $residentBaseQuery)->where('registered_voter', 1)->count(),
            'Unregistered Voters' => (clone $residentBaseQuery)->where('registered_voter', 0)->count(),
        ];


        $ageGroups = [
            '0-6 months' => [0, 0.5],
            '7 mos. to 2 years old' => [0.6, 2],
            '3-5 years old' => [3, 5],
            '6-12 years old' => [6, 12],
            '13-17 years old' => [13, 17],
            '18-59 years old' => [18, 59],
            '60 years old and above' => [60, 200],
        ];

        $ageDistributionData = [];
        foreach ($ageGroups as $label => [$min, $max]) {
            $ageDistributionData[$label] = (clone $residentBaseQuery)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        // Age Distribution (Categories)
        $ageCategories = [
            'Child' => [0, 14],
            'Youth' => [15, 30],
            'Adult' => [31, 59],
            'Senior' => [60, 200],
        ];

        $ageCategoryData = [];
        foreach ($ageCategories as $label => [$min, $max]) {
            $ageCategoryData[$label] = (clone $residentBaseQuery)
                ->whereRaw("TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN ? AND ?", [$min, $max])
                ->count();
        }

        // Gender Distribution
        $genderDistributionData = (clone $residentBaseQuery)
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        // Sex Distribution
        $sexDistributionData = (clone $residentBaseQuery)
            ->selectRaw('sex, COUNT(*) as count')
            ->groupBy('sex')
            ->pluck('count', 'sex');

        // Education Data
        $educationQuery = EducationalHistory::join('residents', function ($join) use ($residentBaseQuery) {
            $join->on('educational_histories.resident_id', '=', 'residents.id')
                ->whereIn('residents.id', $residentBaseQuery->pluck('id')); // Use the filtered Resident IDs
        })
            ->select('educational_attainment', 'education_status', DB::raw('COUNT(*) as total_count'))
            ->groupBy('educational_attainment', 'education_status')
            ->get()
            ->map(function ($item) {
                $educationLabels = [
                    'no_formal_education' => 'No Formal Education',
                    'no_education_yet' => 'No Education Yet',
                    'prep_school' => 'Prep School',
                    'kindergarten' => 'Kindergarten',
                    'tesda' => 'TESDA',
                    'junior_high_school' => 'JHS',
                    'senior_high_school' => 'Senior HS',
                    'elementary' => 'Elementary',
                    'high_school' => 'High School',
                    'college' => 'College',
                    'post_graduate' => 'Post Graduate',
                    'vocational' => 'Vocational',
                    'als' => 'ALS',
                ];

                $statusLabels = [
                    'graduated' => 'Graduated',
                    'enrolled' => 'Currently Enrolled',
                    'incomplete' => 'Incomplete',
                    'dropped_out' => 'Dropped Out',
                ];

                $item->educational_attainment_label = $educationLabels[$item->educational_attainment] ?? 'Unknown';
                $item->education_status_label = $statusLabels[$item->education_status] ?? 'Unknown';

                return $item;
            });

        // Ethnicity Distribution
        $ethnicityDistributionData = (clone $residentBaseQuery)
            ->selectRaw('IFNULL(NULLIF(ethnicity, ""), "Unknown") AS ethnicity, COUNT(*) AS total')
            ->groupBy('ethnicity')
            ->orderByDesc('total')
            ->pluck('total', 'ethnicity');

        // Civil Status
        $civilStatusData = (clone $residentBaseQuery)
            ->selectRaw('civil_status, COUNT(*) as count')
            ->groupBy('civil_status')
            ->pluck('count', 'civil_status');

        // Social Welfare (4Ps and Solo Parent) requires joining with the filtered Residents
        $swpBaseQuery = DB::table('social_welfare_profiles as swp')
            ->joinSub($residentBaseQuery, 'r', function ($join) {
                $join->on('swp.resident_id', '=', 'r.id');
            });

        // 4Ps Distribution
        $fourPsDistributionData = (clone $swpBaseQuery)
            ->select('swp.is_4ps_beneficiary', DB::raw('COUNT(*) as total'))
            ->groupBy('swp.is_4ps_beneficiary')
            ->pluck('total', 'swp.is_4ps_beneficiary');

        $fourPsDistributionData = [
            1 => $fourPsDistributionData[1] ?? 0,
            0 => $fourPsDistributionData[0] ?? 0,
        ];

        // Solo Parent Distribution
        $soloParentDistributionData = (clone $swpBaseQuery)
            ->select('swp.is_solo_parent', DB::raw('COUNT(*) as total'))
            ->groupBy('swp.is_solo_parent')
            ->pluck('total', 'swp.is_solo_parent');

        $soloParentDistributionData = [
            1 => $soloParentDistributionData[1] ?? 0,
            0 => $soloParentDistributionData[0] ?? 0,
        ];

        // Employment Status
        $employmentStatusData = (clone $residentBaseQuery)
            ->selectRaw('employment_status, COUNT(*) as count')
            ->groupBy('employment_status')
            ->pluck('count', 'employment_status');

        // Fetch all barangays for the dropdown
        $barangays = Barangay::select('id', 'barangay_name as name')->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            // Simple Counts
            'residentCount' => $residentCount,
            'seniorCitizenCount' => $seniorCitizenCount,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies' => $totalFamilies,
            'barangays' => $barangays,
            'selectedBarangay' => $barangayId,
            'familyIncomeAllBarangay' => $familyIncomeData,
            'pwdDistributionAllBarangay' => $pwdDistributionData,
            'voterDistributionAllBrgy' => $voterDistributionData,
            'ageDistributionAllBrgy' => $ageDistributionData,
            'ageCategoryAllBrgy' => $ageCategoryData,
            'genderDistributionAllBrgy' => $genderDistributionData,
            'sexDistibutionAllBrgy' => $sexDistributionData,
            'educationDataAllBrgy' => $educationQuery,
            'ethnicityDistributionAllBrgy' => $ethnicityDistributionData,
            'civilStatusAllBrgy' => $civilStatusData,
            'fourPsDistributionAllBrgy' => $fourPsDistributionData,
            'soloParentDistributionAllBrgy' => $soloParentDistributionData,
            'employmentStatusAllBrgy' => $employmentStatusData,
            'populationPerBarangay' => $populationPerBarangay,
            'populationPerPurok' => $populationPerPurok,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    public function accounts(Request $request)
    {
        // Base query for all Barangay Officer accounts
        $query = User::with([
            'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
        ])
            ->where('role', 'barangay_officer')
            ->select('id', 'resident_id', 'username', 'email', 'status', 'is_disabled', 'created_at', 'updated_at');

        // Filters on user fields
        if ($request->filled('session_status') && $request->session_status !== 'All') {
            $query->where('status', $request->session_status);
        }

        if ($request->filled('account_status') && $request->account_status !== 'All') {
            $query->where('is_disabled', $request->account_status);
        }

        // Name filter: if user has resident linked, search resident name; otherwise search username/email
        if ($request->filled('name')) {
            $name = $request->name;
            $query->where(function ($q) use ($name) {
                $q->where('username', 'like', "%{$name}%")
                    ->orWhere('email', 'like', "%{$name}%")
                    ->orWhereHas('resident', function ($q2) use ($name) {
                        $q2->where('firstname', 'like', "%{$name}%")
                            ->orWhere('lastname', 'like', "%{$name}%")
                            ->orWhere('middlename', 'like', "%{$name}%");
                    });
            });
        }

        $accounts = $query->paginate(10)->withQueryString();
        $barangays = Barangay::all()->select('id', 'barangay_name');

        return Inertia::render('SuperAdmin/Account/Index', [
            'accounts' => $accounts,
            'queryParams' => $request->query() ?: null,
            'barangays' => $barangays
        ]);
    }
    public function addAccount(StoreBarangayAccountRequest $request)
    {
        $data = $request->validated(); // validated data from request

        // Check if a barangay account already exists
        $existingUser = User::where('barangay_id', $data['barangay_id'])->first();
        if ($existingUser) {
            return back()
                ->withInput()
                ->with('error', 'An account for this barangay already exists.');
        }

        try {
            $user = User::create([
                'resident_id' => $data['resident_id'] ?? null, // optional if not required
                'barangay_id' => $data['barangay_id'],
                'username'    => $data['username'],
                'email'       => $data['email'],
                'password'    => bcrypt($data['password']),
                'role'        => 'barangay_officer', // default role
                'status'      => $data['status'],
                'is_disabled' => $data['is_disabled'] ?? false,
                'account_id'  => $data['account_id'] ?? null,
            ]);

            // Assign role
            $role = Role::firstOrCreate(['name' => 'barangay_officer']);
            $user->assignRole($role);

            return redirect()
                ->route('super_admin.accounts') // adjust route as needed
                ->with('success', 'Barangay account created successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Barangay account could not be created: ' . $e->getMessage());
        }
    }
    public function accountDetails($id)
    {
        try {
            $user = User::with([
                'resident:id,firstname,middlename,lastname',
                'barangay:id,barangay_name'
            ])->findOrFail($id, ['id', 'username', 'email', 'status', 'is_disabled', 'barangay_id', 'resident_id']);

            return response()->json([
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
                'is_disabled' => $user->is_disabled,
                'barangay_id' => $user->barangay_id,
                'barangay_name' => $user->barangay?->barangay_name, // safe
                'resident' => $user->resident,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User account not found or could not be retrieved.',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function updateAccount(UpdateBarangayAccountRequest $request, $id)
    {
        $data = $request->validated(); // validated data from request
        try {
            $user = User::findOrFail($id);

            // Check if another user already has this barangay_id
            $existingUser = User::where('barangay_id', $data['barangay_id'])
                ->where('id', '!=', $id)
                ->first();

            if ($existingUser) {
                return back()
                    ->withInput()
                    ->with('error', 'Another account for this barangay already exists.');
            }

            $user->update([
                'username'    => $data['username'],
                'email'       => $data['email'],
            ]);

            // Ensure role assignment
            $role = Role::firstOrCreate(['name' => 'barangay_officer']);
            if (!$user->hasRole($role)) {
                $user->assignRole($role);
            }

            return redirect()
                ->route('super_admin.accounts')
                ->with('success', 'Barangay account updated successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Barangay account could not be updated: ' . $e->getMessage());
        }
    }
}

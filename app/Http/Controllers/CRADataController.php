<?php

namespace App\Http\Controllers;

use App\Models\CommunityRiskAssessment;
use App\Models\CRADisasterEffectImpact;
use App\Models\CRADisasterPopulationImpact;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAHouseBuild;
use App\Models\CRAHouseholdService;
use App\Models\CRAHouseOwnership;
use App\Models\CRAHumanResource;
use App\Models\CRAInfraFacility;
use App\Models\CRAInstitution;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationGender;
use App\Models\CRAPrimaryFacility;
use App\Models\CRAProgress;
use App\Models\CRAPublicTransportation;
use App\Models\CRARoadNetwork;
use App\Models\CRADisasterLifeline;
use App\Models\CRADisasterAgriDamage;
use App\Models\CRADisasterDamage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CRADataController extends Controller
{
    public function getCRA()
    {
        try {
            // 🔹 Get the CRA record(s)
            $cras = CommunityRiskAssessment::select('id', 'year')->get();

            $result = [];

            foreach ($cras as $cra) {
                // 🔹 Get all progress entries for this CRA
                $progressEntries = CRAProgress::where('cra_id', $cra->id)->get();

                if ($progressEntries->isNotEmpty()) {
                    foreach ($progressEntries as $progress) {
                        $result[] = [
                            'id' => $cra->id,
                            'year' => $cra->year,
                            'barangay_id' => $progress->barangay_id,
                            'percentage' => (float) $progress->percentage,
                            'status' => $progress->percentage >= 100
                                ? 'Completed'
                                : ($progress->percentage > 0 ? 'In Progress' : 'Not started'),
                        ];
                    }
                } else {
                    // No progress yet for this CRA
                    $result[] = [
                        'id' => $cra->id,
                        'year' => $cra->year,
                        'barangay_id' => null,
                        'percentage' => 0,
                        'status' => 'Not started',
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching CRA list: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getCRAList(Request $request)
    {
        try {
            $barangayId = auth()->user()->barangay_id;

            $cras = CommunityRiskAssessment::select('id', 'year')
                ->with(['progress' => function ($query) use ($barangayId) {
                    $query->where('barangay_id', $barangayId)
                        ->select('cra_id', 'barangay_id', 'percentage'); // include barangay_id here
                }])
                ->orderBy('year', 'asc')
                ->get()
                ->map(function ($cra) {
                    return [
                        'id' => $cra->id,
                        'year' => $cra->year,
                        'percentage' => $cra->progress->first()->percentage ?? 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $cras,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching CRA list: '.$e->getMessage(),
            ], 500);
        }
    }
    public function addCRA(Request $request)
    {
        $cra = CommunityRiskAssessment::create([
            'year' => $request->year,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'CRA created successfully!',
            'data' => $cra,
        ]);
    }
    public function population(Request $request)
    {
        // Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Check if CRA data exists for the given year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        // If CRA does not exist, clear the session and return empty data
        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/PopulationTable', [
                'populationData' => [],
                'genderData' => [],
                'ageDistributionData' => [],
                'houseBuildData' => [],
                'houseOwnershipData' => [],
                'barangays' => [],
                'selectedBarangay' => null
            ]);
        }

        // Store or refresh CRA year in session
        session(['cra_year' => $cra->year]);

        $barangayId = $request->query('barangay_id');

        // Helper function to apply barangay filter
        $applyBarangayFilter = function ($query) use ($barangayId) {
            if ($barangayId) {
                $query->where('barangays.id', $barangayId);
            }
            return $query;
        };

        // Population Data
        $populationData = $applyBarangayFilter(
            CRAGeneralPopulation::select(
                'c_r_a_general_populations.id',
                'c_r_a_general_populations.barangay_id',
                'c_r_a_general_populations.total_population',
                'c_r_a_general_populations.total_households',
                'c_r_a_general_populations.total_families',
                'barangays.barangay_name'
            )
                ->join('barangays', 'c_r_a_general_populations.barangay_id', '=', 'barangays.id')
                ->where('c_r_a_general_populations.cra_id', $cra->id)
                ->orderByDesc('c_r_a_general_populations.total_population')
        )
            ->get()
            ->map(function ($item, $index) {
                $item->number = $index + 1;
                return $item;
            });

        // ✅ Compute totals
        $totalRow = (object) [
            'number' => null,
            'barangay_name' => 'TOTAL',
            'total_population' => $populationData->sum('total_population'),
            'total_households' => $populationData->sum('total_households'),
            'total_families' => $populationData->sum('total_families'),
            'barangay_id' => null,
            'id' => null,
        ];

        // ✅ Append total row at the bottom
        $populationData->push($totalRow);

        // Gender Data (Optimized)
        $genderData = $applyBarangayFilter(
            CRAPopulationGender::query()
                ->join('barangays', 'c_r_a_population_genders.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_population_genders.gender,
                    SUM(c_r_a_population_genders.quantity) AS total_quantity
                ')
                ->where('c_r_a_population_genders.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_population_genders.gender')
        )->get();

        // ✅ Group by barangay and format
        $genderData = $genderData
            ->groupBy('barangay_name')
            ->map(function ($group, $barangay) {
                $genders = $group->map(fn($item) => [
                    'gender' => $item->gender,
                    'quantity' => (int) $item->total_quantity,
                ])->values();

                return [
                    'barangay_name' => $barangay,
                    'genders' => $genders,
                    'total' => $genders->sum('quantity'),
                ];
            })
            ->sortByDesc('total')
            ->values();

        // ✅ Compute totals directly with another SQL query (faster than looping)
        $overallGenderTotals = CRAPopulationGender::query()
            ->where('cra_id', $cra->id)
            ->selectRaw('gender, SUM(quantity) as total_quantity')
            ->groupBy('gender')
            ->get()
            ->mapWithKeys(fn($item) => [$item->gender => (int) $item->total_quantity]);

        // ✅ Build total row
        $totalRow = [
            'number' => null,
            'barangay_name' => 'TOTAL',
            'genders' => $overallGenderTotals->map(fn($qty, $gender) => [
                'gender' => $gender,
                'quantity' => $qty,
            ])->values(),
            'total' => $overallGenderTotals->sum(),
        ];

        // ✅ Add numbering and append total row
        $genderData = $genderData->values()->map(function ($item, $index) {
            $item['number'] = $index + 1;
            return $item;
        });

        $genderData->push($totalRow);

        // Main data
        $ageDistributionData = $applyBarangayFilter(
            CRAPopulationAgeGroup::query()
                ->join('barangays', 'c_r_a_population_age_groups.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_population_age_groups.age_group,
                    SUM(male_without_disability + male_with_disability) AS total_male,
                    SUM(female_without_disability + female_with_disability) AS total_female,
                    SUM(lgbtq_without_disability + lgbtq_with_disability) AS total_lgbtq,
                    SUM(
                        male_without_disability + male_with_disability +
                        female_without_disability + female_with_disability +
                        lgbtq_without_disability + lgbtq_with_disability
                    ) AS total_population
                ')
                ->where('c_r_a_population_age_groups.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_population_age_groups.age_group')
                ->orderBy('barangays.barangay_name')
        )->get();

        // Group per barangay
        $ageDistributionData = $ageDistributionData
            ->groupBy('barangay_name')
            ->map(function ($group, $barangay) {
                $ageGroups = $group->map(fn($item) => [
                    'age_group' => $item->age_group,
                    'male' => (int) $item->total_male,
                    'female' => (int) $item->total_female,
                    'lgbtq' => (int) $item->total_lgbtq,
                    'total' => (int) $item->total_population,
                ])->values();

                return [
                    'barangay_name' => $barangay,
                    'age_groups' => $ageGroups,
                    'total' => $ageGroups->sum('total'),
                ];
            })
            ->sortByDesc('total')
            ->values();

        // ✅ Get total per age group (so columns won't be 0)
        $overallAgeGroups = CRAPopulationAgeGroup::query()
            ->where('cra_id', $cra->id)
            ->selectRaw('
                age_group,
                SUM(male_without_disability + male_with_disability) AS total_male,
                SUM(female_without_disability + female_with_disability) AS total_female,
                SUM(lgbtq_without_disability + lgbtq_with_disability) AS total_lgbtq,
                SUM(
                    male_without_disability + male_with_disability +
                    female_without_disability + female_with_disability +
                    lgbtq_without_disability + lgbtq_with_disability
                ) AS total_population
            ')
            ->groupBy('age_group')
            ->orderBy('age_group')
            ->get();

        // ✅ Compute grand total
        $grandTotal = $overallAgeGroups->sum('total_population');

        // ✅ Build proper total row
        $totalRow = [
            'number' => null,
            'barangay_name' => 'TOTAL',
            'age_groups' => $overallAgeGroups->map(fn($item) => [
                'age_group' => $item->age_group,
                'male' => (int) $item->total_male,
                'female' => (int) $item->total_female,
                'lgbtq' => (int) $item->total_lgbtq,
                'total' => (int) $item->total_population,
            ]),
            'total' => $grandTotal,
        ];

        // Add numbering and append total row
        $ageDistributionData = $ageDistributionData->map(function ($item, $index) {
            $item['number'] = $index + 1;
            return $item;
        });

        $ageDistributionData->push($totalRow);

        // House Build Data
        $houseBuildData = $applyBarangayFilter(
            CRAHouseBuild::query()
                ->join('barangays', 'c_r_a_house_builds.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_house_builds.house_type,
                    SUM(c_r_a_house_builds.one_floor) as total_one_floor,
                    SUM(c_r_a_house_builds.two_or_more_floors) as total_two_or_more_floors,
                    SUM(c_r_a_house_builds.one_floor + c_r_a_house_builds.two_or_more_floors) as total_houses
                ')
                ->where('c_r_a_house_builds.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_house_builds.house_type')
                ->orderBy('barangays.barangay_name')
        )->get()->groupBy('barangay_name')
            ->map(function ($group, $barangay) {
                $houseTypes = $group->map(fn($item) => [
                    'house_type' => $item->house_type,
                    'one_floor' => (int) $item->total_one_floor,
                    'two_or_more_floors' => (int) $item->total_two_or_more_floors,
                    'total' => (int) $item->total_houses,
                ])->values();

                $total = $houseTypes->sum('total');

                return [
                    'barangay_name' => $barangay,
                    'house_types' => $houseTypes,
                    'total' => $total,
                ];
            })->sortByDesc('total')
            ->values()
            ->map(function ($item, $index) {
                $item['number'] = $index + 1;
                return $item;
            });

        // House Ownership Data
        $houseOwnershipData = $applyBarangayFilter(
            CRAHouseOwnership::query()
                ->join('barangays', 'c_r_a_house_ownerships.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_house_ownerships.ownership_type,
                    SUM(c_r_a_house_ownerships.quantity) as total_quantity
                ')
                ->where('c_r_a_house_ownerships.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_house_ownerships.ownership_type')
                ->orderBy('barangays.barangay_name')
        )->get()->groupBy('barangay_name')
            ->map(function ($group, $barangay) {
                $ownerships = $group->map(fn($item) => [
                    'ownership_type' => $item->ownership_type,
                    'quantity' => (int) $item->total_quantity,
                ])->values();

                $total = $ownerships->sum('quantity');

                return [
                    'barangay_name' => $barangay,
                    'ownerships' => $ownerships,
                    'total' => $total,
                ];
            })->sortByDesc('total')
            ->values()
            ->map(function ($item, $index) {
                $item['number'] = $index + 1;
                return $item;
            });

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // Return to Inertia view
        return Inertia::render('CDRRMO/CRA/PopulationTable', [
            'populationData' => $populationData,
            'genderData' => $genderData,
            'ageDistributionData' => $ageDistributionData,
            'houseBuildData' => $houseBuildData,
            'houseOwnershipData' => $houseOwnershipData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function livelihood(Request $request)
    {
        // ✅ Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // ✅ Check if CRA data exists for the given year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/Livelihood', [
                'livelihoodStats' => [],
                'overallLivelihoodStats' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // ✅ Base livelihood query
        $query = DB::table('c_r_a_livelihood_statistics as ls')
            ->join('barangays as b', 'b.id', '=', 'ls.barangay_id')
            ->select(
                'b.barangay_name',
                'ls.livelihood_type',
                'ls.male_without_disability',
                'ls.male_with_disability',
                'ls.female_without_disability',
                'ls.female_with_disability',
                'ls.lgbtq_without_disability',
                'ls.lgbtq_with_disability',
                DB::raw('
                    (ls.male_without_disability + ls.male_with_disability +
                    ls.female_without_disability + ls.female_with_disability +
                    ls.lgbtq_without_disability + ls.lgbtq_with_disability) as total
                ')
            )
            ->where('ls.cra_id', $cra->id);

        // ✅ Apply barangay filter if selected
        if ($barangayId) {
            $query->where('ls.barangay_id', $barangayId);
        }

        $livelihoodStats = $query->orderBy('b.barangay_name')
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                // Map each livelihood record
                $livelihoods = $group->map(fn($item) => [
                    'livelihood_type' => $item->livelihood_type,
                    'male_without_disability' => (int) $item->male_without_disability,
                    'male_with_disability' => (int) $item->male_with_disability,
                    'female_without_disability' => (int) $item->female_without_disability,
                    'female_with_disability' => (int) $item->female_with_disability,
                    'lgbtq_without_disability' => (int) $item->lgbtq_without_disability,
                    'lgbtq_with_disability' => (int) $item->lgbtq_with_disability,
                    'total' => (int) $item->total,
                ])->sortByDesc('total')->values();

                // Add total row at the bottom of each barangay
                $totalRow = [
                    'livelihood_type' => 'TOTAL',
                    'male_without_disability' => $livelihoods->sum('male_without_disability'),
                    'male_with_disability' => $livelihoods->sum('male_with_disability'),
                    'female_without_disability' => $livelihoods->sum('female_without_disability'),
                    'female_with_disability' => $livelihoods->sum('female_with_disability'),
                    'lgbtq_without_disability' => $livelihoods->sum('lgbtq_without_disability'),
                    'lgbtq_with_disability' => $livelihoods->sum('lgbtq_with_disability'),
                    'total' => $livelihoods->sum('total'),
                ];

                $livelihoods->push($totalRow);

                return [
                    'barangay_name' => $barangayName,
                    'livelihoods' => $livelihoods,
                    'total' => $totalRow['total'], // for sorting
                ];
            })
            ->sortByDesc('total')
            ->values();

        // ✅ Compute overall livelihood stats only if NO barangay is selected
        $overallLivelihoodStats = collect();
        if (!$barangayId) {
            $overallLivelihoodStats = DB::table('c_r_a_livelihood_statistics as ls')
                ->join('barangays as b', 'b.id', '=', 'ls.barangay_id')
                ->select(
                    'ls.livelihood_type',
                    DB::raw('SUM(ls.male_without_disability) as male_without_disability'),
                    DB::raw('SUM(ls.male_with_disability) as male_with_disability'),
                    DB::raw('SUM(ls.female_without_disability) as female_without_disability'),
                    DB::raw('SUM(ls.female_with_disability) as female_with_disability'),
                    DB::raw('SUM(ls.lgbtq_without_disability) as lgbtq_without_disability'),
                    DB::raw('SUM(ls.lgbtq_with_disability) as lgbtq_with_disability'),
                    DB::raw('
                        SUM(
                            ls.male_without_disability + ls.male_with_disability +
                            ls.female_without_disability + ls.female_with_disability +
                            ls.lgbtq_without_disability + ls.lgbtq_with_disability
                        ) as total
                    ')
                )
                ->where('ls.cra_id', $cra->id)
                ->groupBy('ls.livelihood_type')
                ->orderByDesc('total')
                ->get()
                ->map(function ($item, $index) {
                    return [
                        'number' => $index + 1,
                        'livelihood_type' => $item->livelihood_type,
                        'male_without_disability' => (int) $item->male_without_disability,
                        'male_with_disability' => (int) $item->male_with_disability,
                        'female_without_disability' => (int) $item->female_without_disability,
                        'female_with_disability' => (int) $item->female_with_disability,
                        'lgbtq_without_disability' => (int) $item->lgbtq_without_disability,
                        'lgbtq_with_disability' => (int) $item->lgbtq_with_disability,
                        'total' => (int) $item->total,
                    ];
                });

            // ✅ Add total row
            $overallLivelihoodStats->push([
                'number' => '',
                'livelihood_type' => 'TOTAL',
                'male_without_disability' => $overallLivelihoodStats->sum('male_without_disability'),
                'male_with_disability' => $overallLivelihoodStats->sum('male_with_disability'),
                'female_without_disability' => $overallLivelihoodStats->sum('female_without_disability'),
                'female_with_disability' => $overallLivelihoodStats->sum('female_with_disability'),
                'lgbtq_without_disability' => $overallLivelihoodStats->sum('lgbtq_without_disability'),
                'lgbtq_with_disability' => $overallLivelihoodStats->sum('lgbtq_with_disability'),
                'total' => $overallLivelihoodStats->sum('total'),
            ]);
        }

        // ✅ Keep year in session
        session(['cra_year' => $cra->year]);

        // ✅ Fetch barangays for filter dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // ✅ Return data
        return Inertia::render('CDRRMO/CRA/Livelihood', [
            'livelihoodStats' => $livelihoodStats,
            'overallLivelihoodStats' => $overallLivelihoodStats,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function services(Request $request)
    {
        // Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Check if CRA data exists for the given year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        // If CRA does not exist, clear the session and return empty data
        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/Services', [
                'servicesData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // Build query
        $query = CRAHouseholdService::query()
            ->select(
                'barangays.barangay_name',
                'c_r_a_household_services.category',
                'c_r_a_household_services.service_name',
                'c_r_a_household_services.households_quantity',
                DB::raw('SUM(c_r_a_household_services.households_quantity) OVER (PARTITION BY barangays.id, c_r_a_household_services.category) as total_per_category')
            )
            ->join('barangays', 'c_r_a_household_services.barangay_id', '=', 'barangays.id')
            ->where('cra_id', $cra->id)
            ->orderBy('barangays.barangay_name')
            ->orderBy('c_r_a_household_services.category')
            ->orderByDesc('households_quantity');

        // Apply barangay filter if selected
        if ($barangayId) {
            $query->where('c_r_a_household_services.barangay_id', $barangayId);
        }

        $servicesData = $query->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                $categories = $group->groupBy('category')->map(function ($services, $category) {
                    return [
                        'category' => $category,
                        'services' => $services->map(fn($s) => [
                            'service_name' => $s->service_name,
                            'households_quantity' => $s->households_quantity,
                        ])->values(),
                        'total' => $services->sum('households_quantity'),
                    ];
                })->values();

                return [
                    'number' => null, // will set after sorting
                    'barangay_name' => $barangayName,
                    'categories' => $categories,
                    'total' => $group->sum('households_quantity'),
                ];
            })
            ->sortByDesc('total') // sort barangays by total
            ->values()
            ->map(function ($item, $index) { // assign number
                $item['number'] = $index + 1;
                return $item;
            });

        session(['cra_year' => $cra->year]);

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/Services', [
            'servicesData' => $servicesData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function infraFacilities(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/InfraFacilities', [
                'infraData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // Base query with aggregation
        $query = CRAInfraFacility::query()
            ->join('barangays', 'c_r_a_infra_facilities.barangay_id', '=', 'barangays.id')
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_infra_facilities.barangay_id', $barangayId))
            ->select(
                'barangays.barangay_name',
                'c_r_a_infra_facilities.category',
                'c_r_a_infra_facilities.infrastructure_name',
                DB::raw('SUM(c_r_a_infra_facilities.quantity) as quantity')
            )
            ->groupBy('barangays.barangay_name', 'c_r_a_infra_facilities.category', 'c_r_a_infra_facilities.infrastructure_name')
            ->orderBy('barangays.barangay_name')
            ->orderBy('c_r_a_infra_facilities.category')
            ->orderByDesc('quantity');

        $infraData = $query->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                $categories = $group->groupBy('category')->map(function ($facilities, $category) {
                    return [
                        'category' => $category,
                        'facilities' => $facilities->map(fn($f) => [
                            'infrastructure_name' => $f->infrastructure_name,
                            'quantity' => $f->quantity,
                        ])->values(),
                        'total' => $facilities->sum('quantity'),
                    ];
                })->values();

                return [
                    'number' => null, // will assign after sorting
                    'barangay_name' => $barangayName,
                    'categories' => $categories,
                    'total' => $group->sum('quantity'),
                ];
            })
            ->sortByDesc('total') // optional: sort barangays by total quantity
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/InfraFacilities', [
            'infraData' => $infraData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function primaryFacilities(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/PrimaryFacility', [
                'primaryFacilitiesData' => [],
                'publicTransportData' => [],
                'roadNetworksData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // Query primary facilities
        $primaryFacilitiesData = CRAPrimaryFacility::query()
            ->join('barangays', 'c_r_a_primary_facilities.barangay_id', '=', 'barangays.id')
            ->select('barangays.barangay_name', 'c_r_a_primary_facilities.facility_name', 'c_r_a_primary_facilities.quantity')
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_primary_facilities.barangay_id', $barangayId))
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                return [
                    'number' => null, // will assign after sorting
                    'barangay_name' => $barangayName,
                    'facilities' => $group->map(fn($f) => [
                        'facility_name' => $f->facility_name,
                        'quantity' => $f->quantity,
                    ])->values(),
                    'total' => $group->sum('quantity'),
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        // Query public transportations
        $publicTransportData = CRAPublicTransportation::query()
            ->join('barangays', 'c_r_a_public_transportations.barangay_id', '=', 'barangays.id')
            ->select('barangays.barangay_name', 'c_r_a_public_transportations.transpo_type', 'c_r_a_public_transportations.quantity')
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_public_transportations.barangay_id', $barangayId))
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                return [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'transportations' => $group->map(fn($t) => [
                        'transpo_type' => $t->transpo_type,
                        'quantity' => $t->quantity,
                    ])->values(),
                    'total' => $group->sum('quantity'),
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        // Query road networks
        $roadNetworksData = CRARoadNetwork::query()
            ->join('barangays', 'c_r_a_road_networks.barangay_id', '=', 'barangays.id')
            ->select(
                'barangays.barangay_name',
                'c_r_a_road_networks.road_type',
                'c_r_a_road_networks.length_km',
                'c_r_a_road_networks.maintained_by'
            )
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_road_networks.barangay_id', $barangayId))
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                return [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'roads' => $group->map(fn($r) => [
                        'road_type' => $r->road_type,
                        'length_km' => $r->length_km,
                        'maintained_by' => $r->maintained_by,
                    ])->values(),
                    'total_length' => $group->sum('length_km'),
                ];
            })
            ->sortByDesc('total_length')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        session(['cra_year' => $cra->year]);

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/PrimaryFacility', [
            'primaryFacilitiesData' => $primaryFacilitiesData,
            'publicTransportData' => $publicTransportData,
            'roadNetworksData' => $roadNetworksData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function institutions(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');

        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/Institution', [
                'institutionsData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // Query institutions
        $institutionsData = CRAInstitution::query()
            ->join('barangays', 'c_r_a_institutions.barangay_id', '=', 'barangays.id')
            ->select(
                'barangays.barangay_name',
                'c_r_a_institutions.name',
                'c_r_a_institutions.male_members',
                'c_r_a_institutions.female_members',
                'c_r_a_institutions.lgbtq_members',
                'c_r_a_institutions.head_name',
                'c_r_a_institutions.contact_no',
                'c_r_a_institutions.registered',
                'c_r_a_institutions.programs_services'
            )
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_institutions.barangay_id', $barangayId))
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                return [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'institutions' => $group->map(fn($i) => [
                        'name' => $i->name,
                        'male_members' => $i->male_members,
                        'female_members' => $i->female_members,
                        'lgbtq_members' => $i->lgbtq_members,
                        'head_name' => $i->head_name,
                        'contact_no' => $i->contact_no,
                        'registered' => $i->registered,
                        'programs_services' => $i->programs_services,
                        'total_members' => $i->male_members + $i->female_members + $i->lgbtq_members,
                    ])->values(),
                    'total_members' => $group->sum(fn($i) => $i->male_members + $i->female_members + $i->lgbtq_members),
                ];
            })
            ->sortByDesc('total_members')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/Institution', [
            'institutionsData' => $institutionsData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function humanResources(Request $request)
    {
        // ✅ Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // ✅ Get CRA record
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/HumanResources', [
                'humanResourcesData' => [],
                'overallHumanResourcesData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // ✅ Query human resources
        $humanResourcesData = CRAHumanResource::query()
            ->join('barangays', 'c_r_a_human_resources.barangay_id', '=', 'barangays.id')
            ->select(
                'barangays.barangay_name',
                'c_r_a_human_resources.category',
                'c_r_a_human_resources.resource_name',
                'c_r_a_human_resources.male_without_disability',
                'c_r_a_human_resources.male_with_disability',
                'c_r_a_human_resources.female_without_disability',
                'c_r_a_human_resources.female_with_disability',
                'c_r_a_human_resources.lgbtq_without_disability',
                'c_r_a_human_resources.lgbtq_with_disability'
            )
            ->where('cra_id', $cra->id)
            ->when($barangayId, fn($q) => $q->where('c_r_a_human_resources.barangay_id', $barangayId))
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                $resources = $group->map(fn($r) => [
                    'category' => $r->category,
                    'resource_name' => $r->resource_name,
                    'male_without_disability' => (int) $r->male_without_disability,
                    'male_with_disability' => (int) $r->male_with_disability,
                    'female_without_disability' => (int) $r->female_without_disability,
                    'female_with_disability' => (int) $r->female_with_disability,
                    'lgbtq_without_disability' => (int) $r->lgbtq_without_disability,
                    'lgbtq_with_disability' => (int) $r->lgbtq_with_disability,
                    'total' =>
                    $r->male_without_disability +
                        $r->male_with_disability +
                        $r->female_without_disability +
                        $r->female_with_disability +
                        $r->lgbtq_without_disability +
                        $r->lgbtq_with_disability,
                ])->values();

                // Total row per barangay
                $totalRow = [
                    'category' => 'TOTAL',
                    'resource_name' => '',
                    'male_without_disability' => $resources->sum('male_without_disability'),
                    'male_with_disability' => $resources->sum('male_with_disability'),
                    'female_without_disability' => $resources->sum('female_without_disability'),
                    'female_with_disability' => $resources->sum('female_with_disability'),
                    'lgbtq_without_disability' => $resources->sum('lgbtq_without_disability'),
                    'lgbtq_with_disability' => $resources->sum('lgbtq_with_disability'),
                    'total' => $resources->sum('total'),
                ];

                $resources->push($totalRow);

                return [
                    'number' => null, // will assign later
                    'barangay_name' => $barangayName,
                    'resources' => $resources,
                    'total' => $totalRow['total'],
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        // ✅ Compute overall human resources if no barangay selected
        $overallHumanResourcesData = collect();
        if (!$barangayId) {
            $overallHumanResourcesData = CRAHumanResource::query()
                ->select(
                    'resource_name',
                    DB::raw('SUM(male_without_disability) as male_without_disability'),
                    DB::raw('SUM(male_with_disability) as male_with_disability'),
                    DB::raw('SUM(female_without_disability) as female_without_disability'),
                    DB::raw('SUM(female_with_disability) as female_with_disability'),
                    DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                    DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability'),
                    DB::raw('
                            SUM(
                                male_without_disability + male_with_disability +
                                female_without_disability + female_with_disability +
                                lgbtq_without_disability + lgbtq_with_disability
                            ) as total
                        ')
                )
                ->where('cra_id', $cra->id)
                ->groupBy('resource_name')
                ->orderByDesc('total')
                ->get()
                ->map(fn($item, $index) => [
                    'number' => $index + 1,
                    'resource_name' => $item->resource_name,
                    'male_without_disability' => (int) $item->male_without_disability,
                    'male_with_disability' => (int) $item->male_with_disability,
                    'female_without_disability' => (int) $item->female_without_disability,
                    'female_with_disability' => (int) $item->female_with_disability,
                    'lgbtq_without_disability' => (int) $item->lgbtq_without_disability,
                    'lgbtq_with_disability' => (int) $item->lgbtq_with_disability,
                    'total' => (int) $item->total,
                ])->values();

            // Add overall total row
            $overallHumanResourcesData->push([
                'number' => '',
                'resource_name' => 'TOTAL',
                'male_without_disability' => $overallHumanResourcesData->sum('male_without_disability'),
                'male_with_disability' => $overallHumanResourcesData->sum('male_with_disability'),
                'female_without_disability' => $overallHumanResourcesData->sum('female_without_disability'),
                'female_with_disability' => $overallHumanResourcesData->sum('female_with_disability'),
                'lgbtq_without_disability' => $overallHumanResourcesData->sum('lgbtq_without_disability'),
                'lgbtq_with_disability' => $overallHumanResourcesData->sum('lgbtq_with_disability'),
                'total' => $overallHumanResourcesData->sum('total'),
            ]);
        }

        // ✅ Keep year in session
        session(['cra_year' => $cra->year]);

        // ✅ Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/HumanResources', [
            'humanResourcesData' => $humanResourcesData,
            'overallHumanResourcesData' => $overallHumanResourcesData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function populationimpact(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisasterPopulationImpacts', [
                'disasterImpactsData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster population impacts.',
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // If no barangay is selected, return empty data
        if (!$barangayId) {
            session(['cra_year' => $cra->year]);

            $allBarangays = DB::table('barangays')
                ->select('id', 'barangay_name as name')
                ->orderBy('barangay_name')
                ->get();

            return Inertia::render('CDRRMO/CRA/DisasterPopulationImpacts', [
                'disasterImpactsData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // Optimized query using eager loading
        $records = CRADisasterPopulationImpact::with(['disaster:id,disaster_name,year', 'barangay:id,barangay_name'])
            ->where('cra_id', $cra->id)
            ->where('barangay_id', $barangayId)
            ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'category', 'value', 'source']);

        $disasterImpactsData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
            ->map(function ($group, $barangayName) {
                $row = [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'disasters' => $group->map(fn($r) => [
                        'disaster_id' => $r->disaster_id,
                        'disaster_name' => $r->disaster->disaster_name,
                        'year' => $r->disaster->year,
                        'category' => $r->category,
                        'value' => $r->value,
                        'source' => $r->source,
                    ])->values(),
                    'total' => $group->sum('value'),
                ];
                return $row;
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/DisasterPopulationImpacts', [
            'disasterImpactsData' => $disasterImpactsData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function effectimpact(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record for that year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisasterEffectImpact', [
                'disasterEffectsData' => [],
                'overallDisasterEffectsData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster effect and impact data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');

        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // === CASE 1: No barangay selected → show overall summary ===
        if (!$barangayId) {
            $overall = CRADisasterEffectImpact::with('disaster:id,disaster_name,year')
                ->where('cra_id', $cra->id)
                ->get(['effect_type', 'value', 'source', 'disaster_id']);

            // Group by disaster
            $overallDisasterEffectsData = $overall->groupBy(fn($r) => $r->disaster->disaster_name)
                ->map(function ($group, $disasterName) {
                    $effects = $group->groupBy('effect_type')->map(function ($rows, $effectType) {
                        return [
                            'effect_type' => $effectType,
                            'value' => $rows->sum('value'),
                            'source' => $rows->pluck('source')->filter()->unique()->implode('; '),
                        ];
                    })->values();

                    $total = $effects->sum('value');

                    // Add Total Impact Value
                    $effects->push([
                        'effect_type' => 'Total Impact Value',
                        'value' => $total,
                        'source' => null,
                    ]);

                    return [
                        'disaster_name' => $disasterName,
                        'effects' => $effects,
                    ];
                })
                ->values();

            return Inertia::render('CDRRMO/CRA/DisasterEffectImpact', [
                'disasterEffectsData' => [],
                'overallDisasterEffectsData' => $overallDisasterEffectsData,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // === CASE 2: Show data for a specific barangay ===
        $records = CRADisasterEffectImpact::with([
            'disaster:id,disaster_name,year',
            'barangay:id,barangay_name'
        ])
            ->where('cra_id', $cra->id)
            ->where('barangay_id', $barangayId)
            ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'effect_type', 'value', 'source']);

        $disasterEffectsData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
            ->map(function ($group, $barangayName) {
                $row = [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'disasters' => $group->map(fn($r) => [
                        'disaster_id' => $r->disaster_id,
                        'disaster_name' => $r->disaster->disaster_name,
                        'year' => $r->disaster->year,
                        'effect_type' => $r->effect_type,
                        'value' => $r->value,
                        'source' => $r->source,
                    ])->values(),
                    'total' => $group->sum('value'),
                ];
                return $row;
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        return Inertia::render('CDRRMO/CRA/DisasterEffectImpact', [
            'disasterEffectsData' => $disasterEffectsData,
            'overallDisasterEffectsData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function damageproperty(Request $request)
    {
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DamageToProperty', [
                'damagePropertyData' => [],
                'overallDamagePropertyData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view property damage data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // Helper function for numeric-safe summation
        $numericValue = function ($value) {
            if (!$value) return 0;

            // Match all integers or decimals globally
            if (preg_match_all('/\d+(?:\.\d+)?/', $value, $matches)) {
                return array_sum(array_map('floatval', $matches[0]));
            }

            return 0;
        };
        // === CASE 1: Overall Summary ===
        $overallDamagePropertyData = [];
        // if (!$barangayId) {
        //     $records = DB::table('c_r_a_disaster_damages as d')
        //         ->join('c_r_a_disaster_occurances as o', 'o.id', '=', 'd.disaster_id')
        //         ->select('o.disaster_name', 'd.damage_type', 'd.category', 'd.value', 'd.source')
        //         ->where('d.cra_id', $cra->id)
        //         ->orderBy('o.disaster_name')
        //         ->get();

        //     $overallDamagePropertyData = $records
        //         ->groupBy('disaster_name')
        //         ->map(function ($group, $disasterName) use ($numericValue) {
        //             $damages = $group->map(function ($r) {
        //                 return [
        //                     'damage_type' => $r->damage_type,
        //                     'category' => $r->category,
        //                     'value' => $r->value,
        //                     'source' => $r->source,
        //                 ];
        //             });

        //             // $total = $group->sum(fn($r) => $numericValue($r->value));

        //             // $damages->push([
        //             //     'damage_type' => 'Total Damage Value',
        //             //     'category' => null,
        //             //     'value' => $total,
        //             //     'source' => null,
        //             // ]);

        //             return [
        //                 'disaster_name' => $disasterName,
        //                 'damages' => $damages->values(),
        //             ];
        //         })
        //         ->values();
        // }

        // === CASE 2: Specific Barangay ===
        $damagePropertyData = [];
        if ($barangayId) {
            $records = CRADisasterDamage::with([
                'disaster:id,disaster_name,year',
                'barangay:id,barangay_name'
            ])
            ->where('cra_id', $cra->id)
            ->where('barangay_id', $barangayId)
            ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'damage_type', 'category', 'description', 'value', 'source']);

            $damagePropertyData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
                ->map(function ($group, $barangayName) use ($numericValue) {
                    $disasters = $group->groupBy(fn($r) => $r->disaster->disaster_name)
                        ->map(function ($rows, $disasterName) use ($numericValue) {
                            $damages = $rows->map(function ($r) {
                                return [
                                    'damage_type' => $r->damage_type,
                                    'category' => $r->category,
                                    'description' => $r->description,
                                    'value' => $r->value,
                                    'source' => $r->source,
                                    'disaster_id' => $r->disaster_id,
                                    'disaster_name' => $r->disaster->disaster_name,
                                    'year' => $r->disaster->year,
                                ];
                            });

                            // $total = $rows->sum(fn($r) => $numericValue($r->value));

                            // $damages->push([
                            //     'damage_type' => 'Total Damage Value',
                            //     'category' => null,
                            //     'description' => null,
                            //     'value' => $total,
                            //     'source' => null,
                            //     'disaster_id' => $rows->first()->disaster_id,
                            //     'disaster_name' => $disasterName,
                            //     'year' => $rows->first()->disaster->year,
                            // ]);

                            return [
                                'disaster_name' => $disasterName,
                                'damages' => $damages->values(),
                            ];
                        })
                        ->values();

                    // $total = $group->sum(fn($r) => $numericValue($r->value));

                    return [
                        'number' => null,
                        'barangay_name' => $barangayName,
                        'disasters' => $disasters,
                    ];
                })
                ->sortByDesc('total')
                ->values()
                ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));
        }

        return Inertia::render('CDRRMO/CRA/DamageToProperty', [
            'damagePropertyData' => $damagePropertyData,
            'overallDamagePropertyData' => $overallDamagePropertyData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }


    public function damageagri(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record for that year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/AgriculturalDamages', [
                'disasterAgriData' => [],
                'overallDisasterAgriData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view agricultural damage data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');

        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // === CASE 1: No barangay selected → show overall summary ===
        // if (!$barangayId) {
        //     $overall = CRADisasterAgriDamage::with('disaster:id,disaster_name,year')
        //         ->where('cra_id', $cra->id)
        //         ->get(['description', 'value', 'source', 'disaster_id']);

        //     // Group by disaster
        //     $overallDisasterAgriData = $overall->groupBy(fn($r) => $r->disaster->disaster_name)
        //         ->map(function ($group, $disasterName) {
        //             $effects = $group->groupBy('description')->map(function ($rows, $desc) {
        //                 return [
        //                     'description' => $desc,
        //                     'value' => $rows->sum('value'),
        //                     'source' => $rows->pluck('source')->filter()->unique()->implode('; '),
        //                 ];
        //             })->values();

        //             $total = $effects->sum('value');

        //             // Add Total Damage Value
        //             $effects->push([
        //                 'description' => 'Total Damage Value',
        //                 'value' => $total,
        //                 'source' => null,
        //             ]);

        //             return [
        //                 'disaster_name' => $disasterName,
        //                 'effects' => $effects,
        //             ];
        //         })
        //         ->values();

        //     return Inertia::render('CDRRMO/CRA/AgriculturalDamages', [
        //         'disasterAgriData' => [],
        //         'overallDisasterAgriData' => $overallDisasterAgriData,
        //         'barangays' => $allBarangays,
        //         'selectedBarangay' => null,
        //     ]);
        // }

        // === CASE 2: Show data for a specific barangay ===
        $records = CRADisasterAgriDamage::with([
            'disaster:id,disaster_name,year',
            'barangay:id,barangay_name'
        ])
            ->where('cra_id', $cra->id)
            ->where('barangay_id', $barangayId)
            ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'description', 'value', 'source']);

        $disasterAgriData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
            ->map(function ($group, $barangayName) {
                $row = [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'disasters' => $group->map(fn($r) => [
                        'disaster_id' => $r->disaster_id,
                        'disaster_name' => $r->disaster->disaster_name,
                        'year' => $r->disaster->year,
                        'description' => $r->description,
                        'value' => $r->value,
                        'source' => $r->source,
                    ])->values(),
                ];
                return $row;
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        return Inertia::render('CDRRMO/CRA/AgriculturalDamages', [
            'disasterAgriData' => $disasterAgriData,
            'overallDisasterAgriData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function disasterlifelines(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record for that year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisasterLifelines', [
                'disasterLifelineData' => [],
                'overallDisasterLifelineData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster lifeline data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // === CASE 1: No barangay selected → Overall summary ===
        $overallDisasterLifelineData = [];
        // if (!$barangayId) {
        //     // SQL-level aggregation for performance
        //     $aggregated = DB::table('c_r_a_disaster_lifelines as l')
        //         ->join('c_r_a_disaster_occurances as o', 'o.id', '=', 'l.disaster_id')
        //         ->select(
        //             'o.disaster_name',
        //             'l.category',
        //             'l.description',
        //             DB::raw('SUM(CAST(l.value AS DECIMAL(20,2))) as total_value'),
        //             DB::raw('GROUP_CONCAT(DISTINCT l.source SEPARATOR ", ") as sources')
        //         )
        //         ->where('l.cra_id', $cra->id)
        //         ->groupBy('o.disaster_name', 'l.category', 'l.description')
        //         ->orderBy('o.disaster_name')
        //         ->get();

        //     // Group and format
        //     $overallDisasterLifelineData = collect($aggregated)
        //         ->groupBy('disaster_name')
        //         ->map(function ($group, $disasterName) {
        //             $lifelines = $group->map(fn($r) => [
        //                 'category' => $r->category,
        //                 'description' => $r->description,
        //                 'value' => (float)$r->total_value,
        //                 'source' => $r->sources,
        //             ])->values();

        //             // Add total per disaster
        //             $total = $lifelines->sum('value');
        //             $lifelines->push([
        //                 'category' => 'Total Lifeline Value',
        //                 'description' => null,
        //                 'value' => $total,
        //                 'source' => null,
        //             ]);

        //             return [
        //                 'disaster_name' => $disasterName,
        //                 'lifelines' => $lifelines,
        //             ];
        //         })
        //         ->values();

        //     return Inertia::render('CDRRMO/CRA/DisasterLifelines', [
        //         'disasterLifelineData' => [],
        //         'overallDisasterLifelineData' => $overallDisasterLifelineData,
        //         'barangays' => $allBarangays,
        //         'selectedBarangay' => null,
        //     ]);
        // }

        // === CASE 2: Specific barangay selected ===
        $records = CRADisasterLifeline::with([
        'disaster:id,disaster_name,year',
        'barangay:id,barangay_name'
    ])
    ->where('cra_id', $cra->id)
    ->where('barangay_id', $barangayId)
    ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'category', 'description', 'value', 'source']);

    $disasterLifelineData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
        ->map(function ($group, $barangayName) {

            $disasters = $group->groupBy(fn($r) => $r->disaster->disaster_name)
                ->map(function ($rows, $disasterName) {

                    // Keep raw lifeline rows only (NO TOTAL)
                    $lifelines = $rows->map(fn($r) => [
                        'disaster_id'   => $r->disaster_id,
                        'disaster_name' => $r->disaster->disaster_name,
                        'year'          => $r->disaster->year,
                        'category'      => $r->category,
                        'description'   => $r->description,
                        'value'         => (float) $r->value,
                        'source'        => $r->source,
                    ])->values();

                    // Log lifelines
                    \Log::info('Lifelines:', $lifelines->toArray());

                    return [
                        'disaster_name' => $disasterName,
                        'lifelines' => $lifelines,
                    ];
                })
                ->values();

            return [
                'number' => null,
                'barangay_name' => $barangayName,
                'disasters' => $disasters,
            ];
        })
        // ❌ Remove sorting by total (since total no longer exists)
        // ->sortByDesc('total')
        ->values()
        ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

            return Inertia::render('CDRRMO/CRA/DisasterLifelines', [
                'disasterLifelineData' => $disasterLifelineData,
                'overallDisasterLifelineData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
            ]);
        }

    public function hazardRisks(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/HazardRisks', [
                'hazardRiskData' => [],
                'overallHazardRiskData' => [],
                'barangayTopHazards' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view hazard risk data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 2️⃣ CASE 1: No barangay selected → Overall Summary
        if (!$barangayId) {
            // --- Aggregated summary for all hazards ---
            $aggregated = DB::table('c_r_a_hazard_risks as r')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
                ->selectRaw('
                    h.hazard_name,
                    ROUND(AVG(r.probability_no), 2) AS avg_probability,
                    ROUND(AVG(r.effect_no), 2) AS avg_effect,
                    ROUND(AVG(r.management_no), 2) AS avg_management,
                    ROUND(AVG(r.average_score), 2) AS avg_score,
                    GROUP_CONCAT(DISTINCT r.basis SEPARATOR "; ") AS bases
                ')
                ->where('r.cra_id', $cra->id)
                ->groupBy('h.hazard_name')
                ->orderByDesc('avg_score')
                ->orderBy('h.hazard_name')
                ->get();

            // Add ranking
            $ranked = $aggregated->map(function ($item, $index) {
                return [
                    'number' => $index + 1,
                    'rank' => $index + 1,
                    'hazard_name' => $item->hazard_name,
                    'avg_probability' => (float) $item->avg_probability,
                    'avg_effect' => (float) $item->avg_effect,
                    'avg_management' => (float) $item->avg_management,
                    'avg_score' => (float) $item->avg_score,
                    'bases' => $item->bases,
                ];
            });

            // --- NEW: Top hazard per barangay ---
           $barangayTopHazards = DB::table('c_r_a_hazard_risks as r')
            ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name as top_hazard',
                'r.average_score',
                'r.probability_no',
                'r.effect_no',
                'r.management_no'
            )
            ->where('r.cra_id', $cra->id)
            ->whereRaw('r.average_score = (
                SELECT MAX(r2.average_score)
                FROM c_r_a_hazard_risks r2
                WHERE r2.barangay_id = r.barangay_id
                AND r2.cra_id = r.cra_id
            )')
            ->orderBy('b.barangay_name')
            ->get()
            ->values() // ensures proper indexing
            ->map(function ($item, $index) {
                return [
                    'number' => $index + 1, // ✅ add sequential numbering
                    'barangay_name' => $item->barangay_name,
                    'top_hazard' => $item->top_hazard,
                    'probability_no' => (float) $item->probability_no,
                    'effect_no' => (float) $item->effect_no,
                    'management_no' => (float) $item->management_no,
                    'average_score' => (float) $item->average_score,
                ];
            });

            return Inertia::render('CDRRMO/CRA/HazardRisks', [
                'hazardRiskData' => [],
                'overallHazardRiskData' => $ranked,
                'barangayTopHazards' => $barangayTopHazards,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 3️⃣ CASE 2: Barangay-specific
        $records = DB::table('c_r_a_hazard_risks as r')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
            ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                'r.probability_no',
                'r.effect_no',
                'r.management_no',
                'r.average_score',
                'r.basis'
            )
            ->where('r.cra_id', $cra->id)
            ->where('r.barangay_id', $barangayId)
            ->orderByDesc('r.average_score')
            ->orderBy('h.hazard_name')
            ->get();

        $hazardRiskData = $records
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                $sorted = $group->sortByDesc('average_score')->values();

                $hazards = $sorted->map(function ($r, $index) {
                    return [
                        'no' => $index + 1,
                        'rank' => $index + 1,
                        'hazard_name' => $r->hazard_name,
                        'probability_no' => (int) $r->probability_no,
                        'effect_no' => (int) $r->effect_no,
                        'management_no' => (int) $r->management_no,
                        'average_score' => (float) $r->average_score,
                        'basis' => $r->basis,
                    ];
                });

                $totalAvgScore = round($hazards->avg('average_score'), 2);

                return [
                    'barangay_name' => $barangayName,
                    'hazards' => $hazards,
                    'total_avg_score' => $totalAvgScore,
                ];
            })
            ->values();

        return Inertia::render('CDRRMO/CRA/HazardRisks', [
            'hazardRiskData' => $hazardRiskData,
            'overallHazardRiskData' => [],
            'barangayTopHazards' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function riskMatrix(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/RiskMatrix', [
                'riskMatrixData' => [],
                'overallRiskMatrixData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view risk matrix data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary View)
        if (!$barangayId) {
            $hazards = DB::table('c_r_a_hazards')->pluck('hazard_name');

            // 🔹 1st Table: Hazard totals across all barangays
            $overallHazards = DB::table('c_r_a_assessment_matrices as m')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
                ->select('h.hazard_name', DB::raw('SUM(m.people) as total_people'))
                ->where('m.matrix_type', 'risk')
                ->where('m.cra_id', $cra->id)
                ->groupBy('h.hazard_name')
                ->orderByDesc('total_people')
                ->get()
                ->map(function ($row, $index) {
                    return [
                        'no' => $index + 1,
                        'hazard_name' => $row->hazard_name,
                        'total_people' => (int) $row->total_people,
                        'overall_rank' => $index + 1,
                    ];
                });

            // 🔹 2nd Table: Breakdown per barangay per hazard
            $barangayData = DB::table('c_r_a_assessment_matrices as m')
                ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
                ->select('b.barangay_name', 'h.hazard_name', DB::raw('SUM(m.people) as total_people'))
                ->where('m.matrix_type', 'risk')
                ->where('m.cra_id', $cra->id)
                ->groupBy('b.barangay_name', 'h.hazard_name')
                ->get()
                ->groupBy('barangay_name')
                ->map(function ($records, $barangayName) use ($hazards) {
                    $row = ['barangay_name' => $barangayName];
                    $total = 0;

                    foreach ($hazards as $hazard) {
                        $count = $records->firstWhere('hazard_name', $hazard)->total_people ?? 0;
                        $row[$hazard] = (int) $count;
                        $total += $count;
                    }

                    $row['total_people'] = $total;
                    return $row;
                })
                ->values();

            // Rank barangays by total people
            $rankedBarangays = $barangayData
                ->sortByDesc('total_people')
                ->values()
                ->map(function ($row, $index) {
                    $row['no'] = $index + 1;
                    $row['overall_rank'] = $index + 1;
                    return $row;
                });

            return Inertia::render('CDRRMO/CRA/RiskMatrix', [
                'riskMatrixData' => [],
                'overallRiskMatrixData' => $rankedBarangays,
                'overallHazardSummary' => $overallHazards,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Show per-hazard breakdown)
        $records = DB::table('c_r_a_assessment_matrices as m')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
            ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                'm.people',
                'm.properties',
                'm.services',
                'm.environment',
                'm.livelihood'
            )
            ->where('m.matrix_type', 'risk')
            ->where('m.cra_id', $cra->id)
            ->where('m.barangay_id', $barangayId)
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/RiskMatrix', [
                'riskMatrixData' => [],
                'overallRiskMatrixData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No risk assessment data found for the selected barangay.',
            ]);
        }

        $barangayName = $records->first()->barangay_name;

        $hazardList = $records->map(function ($r, $index) {
            return [
                'no' => $index + 1,
                'hazard_name' => $r->hazard_name,
                'people' => (int) $r->people, // numeric
                'properties' => $r->properties, // text
                'services' => $r->services,     // text
                'environment' => $r->environment, // text
                'livelihood' => $r->livelihood,   // text
            ];
        });

        // ✅ Return correct structure expected by frontend
        return Inertia::render('CDRRMO/CRA/RiskMatrix', [
            'riskMatrixData' => [
                [
                    'barangay_name' => $barangayName,
                    'hazards' => $hazardList,
                ],
            ],
            'overallRiskMatrixData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function vulnerabilityMatrix(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/VulnerabilityMatrix', [
                'vulnerabilityMatrixData' => [],
                'overallVulnerabilityMatrixData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view vulnerability matrix data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary View)
        if (!$barangayId) {
            $hazards = DB::table('c_r_a_hazards')->pluck('hazard_name');

            // 🔹 1st Table: Hazard totals across all barangays
            $overallHazards = DB::table('c_r_a_assessment_matrices as m')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
                ->select('h.hazard_name', DB::raw('SUM(m.people) as total_people'))
                ->where('m.matrix_type', 'vulnerability')
                ->where('m.cra_id', $cra->id)
                ->groupBy('h.hazard_name')
                ->orderByDesc('total_people')
                ->get()
                ->map(function ($row, $index) {
                    return [
                        'no' => $index + 1,
                        'hazard_name' => $row->hazard_name,
                        'total_people' => (int) $row->total_people,
                        'overall_rank' => $index + 1,
                    ];
                });

            // 🔹 2nd Table: Breakdown per barangay per hazard
            $barangayData = DB::table('c_r_a_assessment_matrices as m')
                ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
                ->select('b.barangay_name', 'h.hazard_name', DB::raw('SUM(m.people) as total_people'))
                ->where('m.matrix_type', 'vulnerability')
                ->where('m.cra_id', $cra->id)
                ->groupBy('b.barangay_name', 'h.hazard_name')
                ->get()
                ->groupBy('barangay_name')
                ->map(function ($records, $barangayName) use ($hazards) {
                    $row = ['barangay_name' => $barangayName];
                    $total = 0;

                    foreach ($hazards as $hazard) {
                        $count = $records->firstWhere('hazard_name', $hazard)->total_people ?? 0;
                        $row[$hazard] = (int) $count;
                        $total += $count;
                    }

                    $row['total_people'] = $total;
                    return $row;
                })
                ->values();

            // Rank barangays by total people
            $rankedBarangays = $barangayData
                ->sortByDesc('total_people')
                ->values()
                ->map(function ($row, $index) {
                    $row['no'] = $index + 1;
                    $row['overall_rank'] = $index + 1;
                    return $row;
                });

            return Inertia::render('CDRRMO/CRA/VulnerabilityMatrix', [
                'vulnerabilityMatrixData' => [],
                'overallVulnerabilityMatrixData' => $rankedBarangays,
                'overallHazardSummary' => $overallHazards,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Show per-hazard breakdown)
        $records = DB::table('c_r_a_assessment_matrices as m')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'm.hazard_id')
            ->join('barangays as b', 'b.id', '=', 'm.barangay_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                'm.people',
                'm.properties',
                'm.services',
                'm.environment',
                'm.livelihood'
            )
            ->where('m.matrix_type', 'vulnerability')
            ->where('m.cra_id', $cra->id)
            ->where('m.barangay_id', $barangayId)
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/VulnerabilityMatrix', [
                'vulnerabilityMatrixData' => [],
                'overallVulnerabilityMatrixData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No vulnerability assessment data found for the selected barangay.',
            ]);
        }

        $barangayName = $records->first()->barangay_name;

        $hazardList = $records->map(function ($r, $index) {
            return [
                'no' => $index + 1,
                'hazard_name' => $r->hazard_name,
                'people' => (int) $r->people,
                'properties' => $r->properties,
                'services' => $r->services,
                'environment' => $r->environment,
                'livelihood' => $r->livelihood,
            ];
        });

        // ✅ Return correct structure expected by frontend
        return Inertia::render('CDRRMO/CRA/VulnerabilityMatrix', [
            'vulnerabilityMatrixData' => [
                [
                    'barangay_name' => $barangayName,
                    'hazards' => $hazardList,
                ],
            ],
            'overallVulnerabilityMatrixData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }


    public function populationExposure(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/PopulationExposure', [
                'populationExposureData' => [],
                'overallPopulationExposureData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view population exposure data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary by Hazard)
        if (!$barangayId) {
            // 🔹 Overall totals grouped by hazard (sum across all barangays)
            $overallHazards = DB::table('c_r_a_population_exposures as e')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'e.hazard_id')
            ->select(
                'h.hazard_name',
                DB::raw('SUM(e.total_families) as total_families'),
                DB::raw('SUM(e.total_individuals) as total_individuals'),
                DB::raw('SUM(e.individuals_male) as male'),
                DB::raw('SUM(e.individuals_female) as female'),
                DB::raw('SUM(e.individuals_lgbtq) as lgbtq'),
                DB::raw('SUM(e.pwd_male) as pwd_male'),
                DB::raw('SUM(e.pwd_female) as pwd_female'),
                DB::raw('SUM(e.diseases_male) as diseases_male'),
                DB::raw('SUM(e.diseases_female) as diseases_female'),
                DB::raw('SUM(e.pregnant_women) as pregnant'),

                // Age group breakdowns separate male/female
                DB::raw('SUM(e.age_0_6_male) as age_0_6_male'),
                DB::raw('SUM(e.age_0_6_female) as age_0_6_female'),
                DB::raw('SUM(e.age_7m_2y_male) as age_7m_2y_male'),
                DB::raw('SUM(e.age_7m_2y_female) as age_7m_2y_female'),
                DB::raw('SUM(e.age_3_5_male) as age_3_5_male'),
                DB::raw('SUM(e.age_3_5_female) as age_3_5_female'),
                DB::raw('SUM(e.age_6_12_male) as age_6_12_male'),
                DB::raw('SUM(e.age_6_12_female) as age_6_12_female'),
                DB::raw('SUM(e.age_13_17_male) as age_13_17_male'),
                DB::raw('SUM(e.age_13_17_female) as age_13_17_female'),
                DB::raw('SUM(e.age_18_59_male) as age_18_59_male'),
                DB::raw('SUM(e.age_18_59_female) as age_18_59_female'),
                DB::raw('SUM(e.age_60_up_male) as age_60_up_male'),
                DB::raw('SUM(e.age_60_up_female) as age_60_up_female')
            )
            ->where('e.cra_id', $cra->id)
            ->groupBy('h.hazard_name')
            ->orderByDesc('total_individuals')
            ->get()
            ->map(function ($row, $index) {
                return [
                    'no' => $index + 1,
                    'hazard_name' => $row->hazard_name,
                    'total_families' => (int) $row->total_families,
                    'total_individuals' => (int) $row->total_individuals,
                    'male' => (int) $row->male,
                    'female' => (int) $row->female,
                    'lgbtq' => (int) $row->lgbtq,
                    'pwd_male' => (int) $row->pwd_male,
                    'pwd_female' => (int) $row->pwd_female,
                    'diseases_male' => (int) $row->diseases_male,
                    'diseases_female' => (int) $row->diseases_female,
                    'pregnant' => (int) $row->pregnant,
                    'overall_rank' => $index + 1,
                    'age_groups' => [
                        'age_0_6' => ['male' => (int) $row->age_0_6_male, 'female' => (int) $row->age_0_6_female],
                        'age_7m_2y' => ['male' => (int) $row->age_7m_2y_male, 'female' => (int) $row->age_7m_2y_female],
                        'age_3_5' => ['male' => (int) $row->age_3_5_male, 'female' => (int) $row->age_3_5_female],
                        'age_6_12' => ['male' => (int) $row->age_6_12_male, 'female' => (int) $row->age_6_12_female],
                        'age_13_17' => ['male' => (int) $row->age_13_17_male, 'female' => (int) $row->age_13_17_female],
                        'age_18_59' => ['male' => (int) $row->age_18_59_male, 'female' => (int) $row->age_18_59_female],
                        'age_60_up' => ['male' => (int) $row->age_60_up_male, 'female' => (int) $row->age_60_up_female],
                    ],
                ];
            });

            // 🔹 Breakdown per hazard → barangay (sum across all puroks)
            $hazardWiseData = DB::table('c_r_a_population_exposures as e')
            ->join('barangays as b', 'b.id', '=', 'e.barangay_id')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'e.hazard_id')
            ->leftJoin('puroks as p', 'p.purok_number', '=', 'e.purok_number')
            ->select(
                'h.hazard_name',
                'b.barangay_name',
                DB::raw('SUM(e.total_families) as total_families'),
                DB::raw('SUM(e.total_individuals) as total_individuals'),
                DB::raw('SUM(e.individuals_male) as male'),
                DB::raw('SUM(e.individuals_female) as female'),
                DB::raw('SUM(e.individuals_lgbtq) as lgbtq'),
                DB::raw('SUM(e.pwd_male) as pwd_male'),
                DB::raw('SUM(e.pwd_female) as pwd_female'),
                DB::raw('SUM(e.diseases_male) as diseases_male'),
                DB::raw('SUM(e.diseases_female) as diseases_female'),
                DB::raw('SUM(e.pregnant_women) as pregnant'),

                // ✅ Age group breakdowns separate male and female
                DB::raw('SUM(e.age_0_6_male) as age_0_6_male'),
                DB::raw('SUM(e.age_0_6_female) as age_0_6_female'),
                DB::raw('SUM(e.age_7m_2y_male) as age_7m_2y_male'),
                DB::raw('SUM(e.age_7m_2y_female) as age_7m_2y_female'),
                DB::raw('SUM(e.age_3_5_male) as age_3_5_male'),
                DB::raw('SUM(e.age_3_5_female) as age_3_5_female'),
                DB::raw('SUM(e.age_6_12_male) as age_6_12_male'),
                DB::raw('SUM(e.age_6_12_female) as age_6_12_female'),
                DB::raw('SUM(e.age_13_17_male) as age_13_17_male'),
                DB::raw('SUM(e.age_13_17_female) as age_13_17_female'),
                DB::raw('SUM(e.age_18_59_male) as age_18_59_male'),
                DB::raw('SUM(e.age_18_59_female) as age_18_59_female'),
                DB::raw('SUM(e.age_60_up_male) as age_60_up_male'),
                DB::raw('SUM(e.age_60_up_female) as age_60_up_female')
            )
            ->where('e.cra_id', $cra->id)
            ->groupBy('h.hazard_name', 'b.barangay_name')
            ->orderBy('h.hazard_name')
            ->orderByDesc('total_individuals')
            ->get()
            ->groupBy('hazard_name')
            ->map(function ($records, $hazardName) {
                $barangays = $records->sortByDesc('total_individuals')
                    ->values()
                    ->map(function ($r, $i) {
                        return [
                            'no' => $i + 1,
                            'barangay_name' => $r->barangay_name,
                            'total_families' => (int) $r->total_families,
                            'total_individuals' => (int) $r->total_individuals,
                            'male' => (int) $r->male,
                            'female' => (int) $r->female,
                            'lgbtq' => (int) $r->lgbtq,
                            'pwd_male' => (int) $r->pwd_male,
                            'pwd_female' => (int) $r->pwd_female,
                            'diseases_male' => (int) $r->diseases_male,
                            'diseases_female' => (int) $r->diseases_female,
                            'pregnant' => (int) $r->pregnant,
                            // ✅ Separate male/female for age groups
                            'age_groups' => [
                                'age_0_6' => ['male' => (int) $r->age_0_6_male, 'female' => (int) $r->age_0_6_female],
                                'age_7m_2y' => ['male' => (int) $r->age_7m_2y_male, 'female' => (int) $r->age_7m_2y_female],
                                'age_3_5' => ['male' => (int) $r->age_3_5_male, 'female' => (int) $r->age_3_5_female],
                                'age_6_12' => ['male' => (int) $r->age_6_12_male, 'female' => (int) $r->age_6_12_female],
                                'age_13_17' => ['male' => (int) $r->age_13_17_male, 'female' => (int) $r->age_13_17_female],
                                'age_18_59' => ['male' => (int) $r->age_18_59_male, 'female' => (int) $r->age_18_59_female],
                                'age_60_up' => ['male' => (int) $r->age_60_up_male, 'female' => (int) $r->age_60_up_female],
                            ],
                        ];
                    });

                return [
                    'hazard_name' => $hazardName,
                    'barangays' => $barangays,
                ];
            })
            ->values();

            return Inertia::render('CDRRMO/CRA/PopulationExposure', [
                'populationExposureData' => [],
                'overallPopulationExposureData' => $hazardWiseData, // ✅ grouped by hazard, barangays summed by purok
                'overallHazardSummary' => $overallHazards,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Detailed Breakdown per Hazard with Purok)
        $records = DB::table('c_r_a_population_exposures as e')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'e.hazard_id')
            ->join('barangays as b', 'b.id', '=', 'e.barangay_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                'e.purok_number',
                'e.total_families',
                'e.total_individuals',
                'e.individuals_male',
                'e.individuals_female',
                'e.individuals_lgbtq',
                'e.pwd_male',
                'e.pwd_female',
                'e.diseases_male',
                'e.diseases_female',
                'e.pregnant_women',
                'e.age_0_6_male',
                'e.age_0_6_female',
                'e.age_7m_2y_male',
                'e.age_7m_2y_female',
                'e.age_3_5_male',
                'e.age_3_5_female',
                'e.age_6_12_male',
                'e.age_6_12_female',
                'e.age_13_17_male',
                'e.age_13_17_female',
                'e.age_18_59_male',
                'e.age_18_59_female',
                'e.age_60_up_male',
                'e.age_60_up_female'
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.barangay_id', $barangayId)
            ->orderBy('h.hazard_name')
            ->orderBy('e.purok_number')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/PopulationExposure', [
                'populationExposureData' => [],
                'overallPopulationExposureData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No population exposure data found for the selected barangay.',
            ]);
        }

        $barangayName = $records->first()->barangay_name;

        // Group by hazard
        $hazardGrouped = $records->groupBy('hazard_name')->map(function ($rows, $hazardName) {
            return [
                'hazard_name' => $hazardName,
                'puroks' => $rows->map(function ($r, $index) {
            return [
                'no' => $index + 1,
                'purok_number' => $r->purok_number,
                'total_families' => (int) $r->total_families,
                'total_individuals' => (int) $r->total_individuals,
                'male' => (int) $r->individuals_male,
                'female' => (int) $r->individuals_female,
                'lgbtq' => (int) $r->individuals_lgbtq,
                'pwd_male' => (int) $r->pwd_male,
                'pwd_female' => (int) $r->pwd_female,
                'diseases_male' => (int) $r->diseases_male,
                'diseases_female' => (int) $r->diseases_female,
                'pregnant' => (int) $r->pregnant_women,

                // Age groups separated by gender
                'age_0_6_male' => (int) $r->age_0_6_male,
                'age_0_6_female' => (int) $r->age_0_6_female,
                'age_7m_2y_male' => (int) $r->age_7m_2y_male,
                'age_7m_2y_female' => (int) $r->age_7m_2y_female,
                'age_3_5_male' => (int) $r->age_3_5_male,
                'age_3_5_female' => (int) $r->age_3_5_female,
                'age_6_12_male' => (int) $r->age_6_12_male,
                'age_6_12_female' => (int) $r->age_6_12_female,
                'age_13_17_male' => (int) $r->age_13_17_male,
                'age_13_17_female' => (int) $r->age_13_17_female,
                'age_18_59_male' => (int) $r->age_18_59_male,
                'age_18_59_female' => (int) $r->age_18_59_female,
                'age_60_up_male' => (int) $r->age_60_up_male,
                'age_60_up_female' => (int) $r->age_60_up_female,
            ];
        })->values(),
            ];
        })->values(); // reset keys

        return Inertia::render('CDRRMO/CRA/PopulationExposure', [
            'populationExposureData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'hazards' => $hazardGrouped,
                ],
            ],
            'overallPopulationExposureData' => [], // you can also compute overall here if needed
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function disabilityStatistics(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisabilityStatistics', [
                'disabilityData' => [],
                'overallDisabilityData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disability statistics.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary by Disability Type)
        if (!$barangayId) {
            $orderExpression = '
                SUM(age_0_6_male + age_7m_2y_male + age_3_5_male + age_6_12_male + age_13_17_male + age_18_59_male + age_60up_male) +
                SUM(age_0_6_female + age_7m_2y_female + age_3_5_female + age_6_12_female + age_13_17_female + age_18_59_female + age_60up_female) +
                SUM(age_6_12_lgbtq + age_13_17_lgbtq + age_18_59_lgbtq + age_60up_lgbtq)
            ';

            $overallDisabilities = DB::table('c_r_a_disability_statistics as d')
                ->join('barangays as b', 'b.id', '=', 'd.barangay_id')
                ->select(
                    'd.disability_type',
                    DB::raw('SUM(age_0_6_male + age_0_6_female) as age_0_6'),
                    DB::raw('SUM(age_7m_2y_male + age_7m_2y_female) as age_7m_2y'),
                    DB::raw('SUM(age_3_5_male + age_3_5_female) as age_3_5'),
                    DB::raw('SUM(age_6_12_male + age_6_12_female + age_6_12_lgbtq) as age_6_12'),
                    DB::raw('SUM(age_13_17_male + age_13_17_female + age_13_17_lgbtq) as age_13_17'),
                    DB::raw('SUM(age_18_59_male + age_18_59_female + age_18_59_lgbtq) as age_18_59'),
                    DB::raw('SUM(age_60up_male + age_60up_female + age_60up_lgbtq) as age_60_up'),
                    DB::raw('SUM(age_0_6_male + age_7m_2y_male + age_3_5_male + age_6_12_male + age_13_17_male + age_18_59_male + age_60up_male) as male_total'),
                    DB::raw('SUM(age_0_6_female + age_7m_2y_female + age_3_5_female + age_6_12_female + age_13_17_female + age_18_59_female + age_60up_female) as female_total'),
                    DB::raw('SUM(age_6_12_lgbtq + age_13_17_lgbtq + age_18_59_lgbtq + age_60up_lgbtq) as lgbtq_total')
                )
                ->where('d.cra_id', $cra->id)
                ->groupBy('d.disability_type')
                ->orderByDesc(DB::raw($orderExpression))
                ->get();

            // 🔹 Breakdown per disability → barangay
            $disabilityByBarangay = DB::table('c_r_a_disability_statistics as d')
                ->join('barangays as b', 'b.id', '=', 'd.barangay_id')
                ->select(
                    'd.disability_type',
                    'b.barangay_name',
                    'd.age_0_6_male',
                    'd.age_0_6_female',
                    'd.age_7m_2y_male',
                    'd.age_7m_2y_female',
                    'd.age_3_5_male',
                    'd.age_3_5_female',
                    'd.age_6_12_male',
                    'd.age_6_12_female',
                    'd.age_6_12_lgbtq',
                    'd.age_13_17_male',
                    'd.age_13_17_female',
                    'd.age_13_17_lgbtq',
                    'd.age_18_59_male',
                    'd.age_18_59_female',
                    'd.age_18_59_lgbtq',
                    'd.age_60up_male',
                    'd.age_60up_female',
                    'd.age_60up_lgbtq'
                )
                ->where('d.cra_id', $cra->id)
                ->orderBy('d.disability_type')
                ->orderByDesc(DB::raw('
                    age_0_6_male + age_0_6_female + age_7m_2y_male + age_7m_2y_female +
                    age_3_5_male + age_3_5_female + age_6_12_male + age_6_12_female + age_6_12_lgbtq +
                    age_13_17_male + age_13_17_female + age_13_17_lgbtq +
                    age_18_59_male + age_18_59_female + age_18_59_lgbtq +
                    age_60up_male + age_60up_female + age_60up_lgbtq
                '))
                ->get()
                ->groupBy('disability_type')
                ->map(function ($records, $disability) {
                    $barangays = $records->map(function ($r, $i) {
                        return [
                            'no' => $i + 1,
                            'barangay_name' => $r->barangay_name,
                            'age_groups' => [
                                'age_0_6' => ['male' => $r->age_0_6_male, 'female' => $r->age_0_6_female],
                                'age_7m_2y' => ['male' => $r->age_7m_2y_male, 'female' => $r->age_7m_2y_female],
                                'age_3_5' => ['male' => $r->age_3_5_male, 'female' => $r->age_3_5_female],
                                'age_6_12' => ['male' => $r->age_6_12_male, 'female' => $r->age_6_12_female, 'lgbtq' => $r->age_6_12_lgbtq],
                                'age_13_17' => ['male' => $r->age_13_17_male, 'female' => $r->age_13_17_female, 'lgbtq' => $r->age_13_17_lgbtq],
                                'age_18_59' => ['male' => $r->age_18_59_male, 'female' => $r->age_18_59_female, 'lgbtq' => $r->age_18_59_lgbtq],
                                'age_60_up' => ['male' => $r->age_60up_male, 'female' => $r->age_60up_female, 'lgbtq' => $r->age_60up_lgbtq],
                            ],
                        ];
                    });

                    return [
                        'disability_type' => $disability,
                        'barangays' => $barangays,
                    ];
                })
                ->values();

            return Inertia::render('CDRRMO/CRA/DisabilityStatistics', [
                'disabilityData' => [],
                'overallDisabilityData' => $disabilityByBarangay,
                'overallSummary' => $overallDisabilities,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Detailed Breakdown)
        $records = DB::table('c_r_a_disability_statistics as d')
            ->where('d.cra_id', $cra->id)
            ->where('d.barangay_id', $barangayId)
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/DisabilityStatistics', [
                'disabilityData' => [],
                'overallDisabilityData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No disability statistics found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')->where('id', $barangayId)->value('barangay_name');

        $disabilityGrouped = $records->groupBy('disability_type')->map(function ($rows, $disabilityType) {
            return [
                'disability_type' => $disabilityType,
                'age_groups' => $rows->map(function ($r) {
                    return [
                        'age_0_6' => ['male' => $r->age_0_6_male, 'female' => $r->age_0_6_female],
                        'age_7m_2y' => ['male' => $r->age_7m_2y_male, 'female' => $r->age_7m_2y_female],
                        'age_3_5' => ['male' => $r->age_3_5_male, 'female' => $r->age_3_5_female],
                        'age_6_12' => ['male' => $r->age_6_12_male, 'female' => $r->age_6_12_female, 'lgbtq' => $r->age_6_12_lgbtq],
                        'age_13_17' => ['male' => $r->age_13_17_male, 'female' => $r->age_13_17_female, 'lgbtq' => $r->age_13_17_lgbtq],
                        'age_18_59' => ['male' => $r->age_18_59_male, 'female' => $r->age_18_59_female, 'lgbtq' => $r->age_18_59_lgbtq],
                        'age_60_up' => ['male' => $r->age_60up_male, 'female' => $r->age_60up_female, 'lgbtq' => $r->age_60up_lgbtq],
                    ];
                })->first(),
            ];
        })->values();

        return Inertia::render('CDRRMO/CRA/DisabilityStatistics', [
            'disabilityData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'disabilities' => $disabilityGrouped,
                ],
            ],
            'overallDisabilityData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function familyAtRisk(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/FamilyAtRisk', [
                'familyAtRiskData' => [],
                'overallFamilyAtRiskData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view family at risk data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary)
        if (!$barangayId) {
            $overallData = DB::table('c_r_a_family_at_risks as f')
                ->join('barangays as b', 'b.id', '=', 'f.barangay_id')
                ->select(
                    'b.id as barangay_id',
                    'b.barangay_name',
                    'f.indicator',
                    DB::raw('SUM(f.count) as total_count')
                )
                ->where('f.cra_id', $cra->id)
                ->groupBy('b.id', 'b.barangay_name', 'f.indicator')
                ->orderBy('b.barangay_name')
                ->orderByDesc('total_count')
                ->get()
                ->groupBy('barangay_name')
                ->map(function ($rows, $barangayName) {
                    return [
                        'barangay_name' => $barangayName,
                        'indicators' => $rows->values()->map(function ($row, $index) {
                            return [
                                'no' => $index + 1,
                                'indicator' => $row->indicator,
                                'total_count' => (int) $row->total_count,
                            ];
                        }),
                    ];
                });

            return Inertia::render('CDRRMO/CRA/FamilyAtRisk', [
                'familyAtRiskData' => [],
                'overallFamilyAtRiskData' => $overallData,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Detailed Breakdown per Purok)
        $records = DB::table('c_r_a_family_at_risks as f')
            ->join('barangays as b', 'b.id', '=', 'f.barangay_id')
            ->select(
                'b.barangay_name',
                'f.purok_number',
                'f.indicator',
                'f.count'
            )
            ->where('f.cra_id', $cra->id)
            ->where('f.barangay_id', $barangayId)
            ->orderBy('f.indicator')
            ->orderBy('f.purok_number')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/FamilyAtRisk', [
                'familyAtRiskData' => [],
                'overallFamilyAtRiskData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No family at risk data found for the selected barangay.',
            ]);
        }

        $barangayName = $records->first()->barangay_name;

        // Group by indicator
        $indicatorGrouped = $records->groupBy('indicator')->map(function ($rows, $indicator) {
            return [
                'indicator' => $indicator,
                'puroks' => $rows->map(function ($r, $index) {
                    return [
                        'no' => $index + 1,
                        'purok_number' => $r->purok_number,
                        'count' => (int) $r->count,
                    ];
                })->values(),
                'total_count' => $rows->sum('count'), // ✅ total per indicator
            ];
        })->values();

        return Inertia::render('CDRRMO/CRA/FamilyAtRisk', [
            'familyAtRiskData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'indicators' => $indicatorGrouped,
                ],
            ],
            'overallFamilyAtRiskData' => [], // optional: compute overall totals here if needed
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function illnessStatistics(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/IllnessStatistics', [
                'illnessData' => [],
                'overallIllnessData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view illness statistics.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary by Illness)
        if (!$barangayId) {
            $overallIllnesses = DB::table('c_r_a_illnesses_stats as i')
                ->join('barangays as b', 'b.id', '=', 'i.barangay_id')
                ->select(
                    'i.illness',
                    DB::raw('SUM(children) as children_total'),
                    DB::raw('SUM(adults) as adults_total'),
                    DB::raw('SUM(children + adults) as total')
                )
                ->where('i.cra_id', $cra->id)
                ->groupBy('i.illness')
                ->orderByDesc('total')
                ->get();

            // 🔹 Breakdown per illness → barangay
            $illnessByBarangay = DB::table('c_r_a_illnesses_stats as i')
                ->join('barangays as b', 'b.id', '=', 'i.barangay_id')
                ->select('i.illness', 'b.barangay_name', 'i.children', 'i.adults')
                ->where('i.cra_id', $cra->id)
                ->orderBy('i.illness')
                ->orderByDesc(DB::raw('children + adults'))
                ->get()
                ->groupBy('illness')
                ->map(function ($records, $illness) {
                    $barangays = $records->map(function ($r, $i) {
                        return [
                            'no' => $i + 1,
                            'barangay_name' => $r->barangay_name,
                            'children' => $r->children,
                            'adults' => $r->adults,
                            'total' => $r->children + $r->adults,
                        ];
                    });

                    return [
                        'illness' => $illness,
                        'barangays' => $barangays,
                    ];
                })
                ->values();

            return Inertia::render('CDRRMO/CRA/IllnessStatistics', [
                'illnessData' => [],
                'overallIllnessData' => $illnessByBarangay,
                'overallSummary' => $overallIllnesses,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Detailed Breakdown)
        $records = DB::table('c_r_a_illnesses_stats as i')
            ->where('i.cra_id', $cra->id)
            ->where('i.barangay_id', $barangayId)
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/IllnessStatistics', [
                'illnessData' => [],
                'overallIllnessData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No illness statistics found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')->where('id', $barangayId)->value('barangay_name');

        $illnessGrouped = $records->groupBy('illness')->map(function ($rows, $illness) {
            $row = $rows->first();
            return [
                'illness' => $illness,
                'children' => $row->children,
                'adults' => $row->adults,
                'total' => $row->children + $row->adults,
            ];
        })->values();

        return Inertia::render('CDRRMO/CRA/IllnessStatistics', [
            'illnessData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'illnesses' => $illnessGrouped,
                ],
            ],
            'overallIllnessData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function disasterRiskPopulation(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisasterRiskPopulation', [
                'disasterRiskData' => [],
                'overallDisasterRiskData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster risk population data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // 🟦 CASE 1: No Barangay Selected (Overall Summary by Hazard)
        if (!$barangayId) {
            // 🔹 Overall totals grouped by hazard (sum across all barangays)
            $overallHazards = DB::table('c_r_a_disaster_risk_populations as r')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
                ->select(
                    'h.hazard_name',
                    DB::raw('SUM(r.low_families + r.medium_families + r.high_families) as total_families'),
                    DB::raw('SUM(r.low_individuals + r.medium_individuals + r.high_individuals) as total_individuals'),
                    DB::raw('SUM(r.low_families) as low_families'),
                    DB::raw('SUM(r.medium_families) as medium_families'),
                    DB::raw('SUM(r.high_families) as high_families'),
                    DB::raw('SUM(r.low_individuals) as low_individuals'),
                    DB::raw('SUM(r.medium_individuals) as medium_individuals'),
                    DB::raw('SUM(r.high_individuals) as high_individuals')
                )
                ->where('r.cra_id', $cra->id)
                ->groupBy('h.hazard_name')
                ->orderByDesc('total_individuals')
                ->get()
                ->map(function ($row, $index) {
                    return [
                        'no' => $index + 1,
                        'hazard_name' => $row->hazard_name,
                        'total_families' => (int) $row->total_families,
                        'total_individuals' => (int) $row->total_individuals,
                        'low_families' => (int) $row->low_families,
                        'medium_families' => (int) $row->medium_families,
                        'high_families' => (int) $row->high_families,
                        'low_individuals' => (int) $row->low_individuals,
                        'medium_individuals' => (int) $row->medium_individuals,
                        'high_individuals' => (int) $row->high_individuals,
                    ];
                });

            // 🔹 Breakdown per hazard → barangay (sum across all puroks)
            $hazardWiseData = DB::table('c_r_a_disaster_risk_populations as r')
                ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
                ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
                ->select(
                    'h.hazard_name',
                    'b.barangay_name',
                    DB::raw('SUM(r.low_families + r.medium_families + r.high_families) as total_families'),
                    DB::raw('SUM(r.low_individuals + r.medium_individuals + r.high_individuals) as total_individuals'),
                    DB::raw('SUM(r.low_families) as low_families'),
                    DB::raw('SUM(r.medium_families) as medium_families'),
                    DB::raw('SUM(r.high_families) as high_families'),
                    DB::raw('SUM(r.low_individuals) as low_individuals'),
                    DB::raw('SUM(r.medium_individuals) as medium_individuals'),
                    DB::raw('SUM(r.high_individuals) as high_individuals')
                )
                ->where('r.cra_id', $cra->id)
                ->groupBy('h.hazard_name', 'b.barangay_name')
                ->orderBy('h.hazard_name')
                ->orderByDesc('total_individuals')
                ->get()
                ->groupBy('hazard_name')
                ->map(function ($records, $hazardName) {
                    $barangays = $records->sortByDesc('total_individuals')
                        ->values()
                        ->map(function ($r, $i) {
                            return [
                                'no' => $i + 1,
                                'barangay_name' => $r->barangay_name,
                                'total_families' => (int) $r->total_families,
                                'total_individuals' => (int) $r->total_individuals,
                                'low_families' => (int) $r->low_families,
                                'medium_families' => (int) $r->medium_families,
                                'high_families' => (int) $r->high_families,
                                'low_individuals' => (int) $r->low_individuals,
                                'medium_individuals' => (int) $r->medium_individuals,
                                'high_individuals' => (int) $r->high_individuals,
                            ];
                        });

                    return [
                        'hazard_name' => $hazardName,
                        'barangays' => $barangays,
                    ];
                })
                ->values();

            return Inertia::render('CDRRMO/CRA/DisasterRiskPopulation', [
                'disasterRiskData' => [],
                'overallDisasterRiskData' => $hazardWiseData,
                'overallHazardSummary' => $overallHazards,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

        // 🟩 CASE 2: Barangay Selected (Detailed Breakdown per Hazard with Purok)
        $records = DB::table('c_r_a_disaster_risk_populations as r')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'r.hazard_id')
            ->join('barangays as b', 'b.id', '=', 'r.barangay_id')
            ->select(
                'b.barangay_name',
                'h.hazard_name',
                'r.purok_number',
                'r.low_families',
                'r.medium_families',
                'r.high_families',
                'r.low_individuals',
                'r.medium_individuals',
                'r.high_individuals'
            )
            ->where('r.cra_id', $cra->id)
            ->where('r.barangay_id', $barangayId)
            ->orderBy('h.hazard_name')
            ->orderBy('r.purok_number')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/DisasterRiskPopulation', [
                'disasterRiskData' => [],
                'overallDisasterRiskData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No disaster risk population data found for the selected barangay.',
            ]);
        }

        $barangayName = $records->first()->barangay_name;

        // Group by hazard
        $hazardGrouped = $records->groupBy('hazard_name')->map(function ($rows, $hazardName) {
            return [
                'hazard_name' => $hazardName,
                'puroks' => $rows->map(function ($r, $index) {
                    return [
                        'purok_number' => $r->purok_number,
                        'low_families' => (int) $r->low_families,
                        'medium_families' => (int) $r->medium_families,
                        'high_families' => (int) $r->high_families,
                        'low_individuals' => (int) $r->low_individuals,
                        'medium_individuals' => (int) $r->medium_individuals,
                        'high_individuals' => (int) $r->high_individuals,
                        'total_families' => (int) ($r->low_families + $r->medium_families + $r->high_families),
                        'total_individuals' => (int) ($r->low_individuals + $r->medium_individuals + $r->high_individuals),
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('CDRRMO/CRA/DisasterRiskPopulation', [
            'disasterRiskData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'hazards' => $hazardGrouped,
                ],
            ],
            'overallDisasterRiskData' => [],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function disasterInventories(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/DisasterInventories', [
                'inventoryData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster inventory data.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/DisasterInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster inventory data.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Hazard)
        $records = DB::table('c_r_a_disaster_inventories as i')
            ->join('c_r_a_hazards as h', 'h.id', '=', 'i.hazard_id')
            ->select(
                'h.hazard_name',
                'i.category',
                'i.item_name',
                'i.total_in_barangay',
                'i.percentage_at_risk',
                'i.location'
            )
            ->where('i.cra_id', $cra->id)
            ->where('i.barangay_id', $barangayId)
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/DisasterInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No disaster inventory data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')->where('id', $barangayId)->value('barangay_name');

        $hazardGrouped = $records->groupBy('hazard_name')->map(function ($rows, $hazardName) {
            return [
                'hazard_name' => $hazardName,
                'items' => $rows->map(function ($r) {
                    return [
                        'category' => $r->category,
                        'item_name' => $r->item_name,
                        'total_in_barangay' => $r->total_in_barangay,
                        'percentage_at_risk' => $r->percentage_at_risk,
                        'location' => $r->location,
                    ];
                })->values(),
            ];
        })->values();

        return Inertia::render('CDRRMO/CRA/DisasterInventories', [
            'inventoryData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'hazards' => $hazardGrouped,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function evacuationCenters(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/EvacuationCenters', [
                'centerData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation centers.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/EvacuationCenters', [
                'centerData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation centers.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed evacuation centers)
        $records = DB::table('c_r_a_evacuation_centers as e')
            ->select(
                'e.name',
                'e.capacity_families',
                'e.capacity_individuals',
                'e.owner_type',
                'e.inspected_by_engineer',
                'e.has_mou'
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.barangay_id', $barangayId)
            ->orderBy('e.name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/EvacuationCenters', [
                'centerData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No evacuation centers found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')->where('id', $barangayId)->value('barangay_name');

        $centerData = $records->values()->map(function ($r, $index) {
            return [
                'number' => $index + 1, // Row number starting from 1
                'name' => $r->name,
                'capacity_families' => $r->capacity_families,
                'capacity_individuals' => $r->capacity_individuals,
                'owner_type' => $r->owner_type,
                'inspected_by_engineer' => $r->inspected_by_engineer,
                'has_mou' => $r->has_mou,
            ];
        });

        return Inertia::render('CDRRMO/CRA/EvacuationCenters', [
            'centerData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'centers' => $centerData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function evacuationInventories(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/EvacuationInventories', [
                'inventoryData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation inventory per purok.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/EvacuationInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation inventory per purok.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Purok)
        $records = DB::table('c_r_a_evacuation_inventories as e')
            ->select(
                'e.purok_number',
                'e.total_families',
                'e.total_individuals',
                'e.families_at_risk',
                'e.individuals_at_risk',
                'e.plan_a_center',
                'e.plan_a_capacity_families',
                'e.plan_a_capacity_individuals',
                'e.plan_a_unaccommodated_families',
                'e.plan_a_unaccommodated_individuals',
                'e.plan_b_center',
                'e.plan_b_unaccommodated_families',
                'e.plan_b_unaccommodated_individuals',
                'e.remarks'
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.barangay_id', $barangayId)
            ->orderBy('e.purok_number')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/EvacuationInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No evacuation inventory data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')->where('id', $barangayId)->value('barangay_name');

        $inventoryData = $records->values()->map(function ($r, $index) {
            return [
                'number' => $index + 1, // Row number
                'purok_number' => $r->purok_number,
                'total_families' => $r->total_families,
                'total_individuals' => $r->total_individuals,
                'families_at_risk' => $r->families_at_risk,
                'individuals_at_risk' => $r->individuals_at_risk,
                'plan_a_center' => $r->plan_a_center,
                'plan_a_capacity_families' => $r->plan_a_capacity_families,
                'plan_a_capacity_individuals' => $r->plan_a_capacity_individuals,
                'plan_a_unaccommodated_families' => $r->plan_a_unaccommodated_families,
                'plan_a_unaccommodated_individuals' => $r->plan_a_unaccommodated_individuals,
                'plan_b_center' => $r->plan_b_center,
                'plan_b_unaccommodated_families' => $r->plan_b_unaccommodated_families,
                'plan_b_unaccommodated_individuals' => $r->plan_b_unaccommodated_individuals,
                'remarks' => $r->remarks,
            ];
        });

        return Inertia::render('CDRRMO/CRA/EvacuationInventories', [
            'inventoryData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'puroks' => $inventoryData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function affectedPlaces(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/AffectedPlaces', [
                'affectedData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view affected places per hazard.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/AffectedPlaces', [
                'affectedData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view affected places per hazard.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Purok & Hazard)
        $records = DB::table('c_r_a_affected_places as a')
            ->join('c_r_a_hazards as h', 'a.hazard_id', '=', 'h.id')
            ->select(
                'a.purok_number',
                'h.hazard_name',
                'a.risk_level',
                'a.total_families',
                'a.total_individuals',
                'a.at_risk_families',
                'a.at_risk_individuals',
                'a.safe_evacuation_area'
            )
            ->where('a.cra_id', $cra->id)
            ->where('a.barangay_id', $barangayId)
            ->orderBy('a.purok_number')
            ->orderBy('h.hazard_name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/AffectedPlaces', [
                'affectedData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No affected places data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $affectedData = $records->values()->map(function ($r, $index) {
            return [
                'purok_number' => $r->purok_number,
                'hazard_name' => $r->hazard_name,
                'risk_level' => $r->risk_level,
                'total_families' => $r->total_families,
                'total_individuals' => $r->total_individuals,
                'at_risk_families' => $r->at_risk_families,
                'at_risk_individuals' => $r->at_risk_individuals,
                'safe_evacuation_area' => $r->safe_evacuation_area,
            ];
        });

        return Inertia::render('CDRRMO/CRA/AffectedPlaces', [
            'affectedData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'places' => $affectedData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }
    public function livelihoodEvacuationSites(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/LivelihoodEvacuationSites', [
                'livelihoodData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view livelihood groups and their assigned evacuation sites.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/LivelihoodEvacuationSites', [
                'livelihoodData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view livelihood groups and their assigned evacuation sites.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Livelihood)
        $records = DB::table('c_r_a_livelihood_evacuation_sites as l')
            ->select(
                'l.livelihood_type',
                'l.evacuation_site',
                'l.place_of_origin',
                'l.capacity_description'
            )
            ->where('l.cra_id', $cra->id)
            ->where('l.barangay_id', $barangayId)
            ->orderBy('l.livelihood_type')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/LivelihoodEvacuationSites', [
                'livelihoodData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No livelihood evacuation site data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $livelihoodData = $records->values()->map(function ($r) {
            return [
                'livelihood_type' => $r->livelihood_type,
                'evacuation_site' => $r->evacuation_site,
                'place_of_origin' => $r->place_of_origin,
                'capacity_description' => $r->capacity_description,
            ];
        });

        return Inertia::render('CDRRMO/CRA/LivelihoodEvacuationSites', [
            'livelihoodData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'groups' => $livelihoodData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }
    public function prepositionedInventories(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/PrepositionedInventories', [
                'inventoryData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view prepositioned inventories.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/PrepositionedInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view prepositioned inventories.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Inventory Item)
        $records = DB::table('c_r_a_prepositioned_inventories as i')
            ->select(
                'i.item_name',
                'i.quantity',
                'i.remarks'
            )
            ->where('i.cra_id', $cra->id)
            ->where('i.barangay_id', $barangayId)
            ->orderBy('i.item_name')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/PrepositionedInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No prepositioned inventory data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $inventoryData = $records->values()->map(function ($r) {
            return [
                'item_name' => $r->item_name,
                'quantity' => $r->quantity,
                'remarks' => $r->remarks,
            ];
        });

        return Inertia::render('CDRRMO/CRA/PrepositionedInventories', [
            'inventoryData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'items' => $inventoryData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }
    public function reliefDistributions(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/ReliefDistributions', [
                'distributionData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view relief distributions.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/ReliefDistributions', [
                'distributionData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view relief distributions.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Distribution)
        $records = DB::table('c_r_a_relief_distributions as r')
            ->select(
                'r.evacuation_center',
                'r.relief_good',
                'r.quantity',
                'r.unit',
                'r.beneficiaries',
                'r.address'
            )
            ->where('r.cra_id', $cra->id)
            ->where('r.barangay_id', $barangayId)
            ->orderBy('r.evacuation_center')
            ->orderBy('r.relief_good')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/ReliefDistributions', [
                'distributionData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No relief distribution data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $distributionData = $records->values()->map(function ($r) {
            return [
                'evacuation_center' => $r->evacuation_center,
                'relief_good' => $r->relief_good,
                'quantity' => $r->quantity,
                'unit' => $r->unit,
                'beneficiaries' => $r->beneficiaries,
                'address' => $r->address,
            ];
        });

        return Inertia::render('CDRRMO/CRA/ReliefDistributions', [
            'distributionData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'items' => $distributionData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function reliefDistributionProcesses(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/ReliefDistributionProcesses', [
                'processData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view relief distribution processes.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/ReliefDistributionProcesses', [
                'processData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view relief distribution processes.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Step)
        $records = DB::table('c_r_a_relief_distribution_processes as p')
            ->select(
                'p.step_no',
                'p.distribution_process',
                'p.origin_of_goods',
                'p.remarks'
            )
            ->where('p.cra_id', $cra->id)
            ->where('p.barangay_id', $barangayId)
            ->orderBy('p.step_no')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/ReliefDistributionProcesses', [
                'processData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No relief distribution process data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $processData = $records->values()->map(function ($r) {
            return [
                'step_no' => $r->step_no,
                'distribution_process' => $r->distribution_process,
                'origin_of_goods' => $r->origin_of_goods,
                'remarks' => $r->remarks,
            ];
        });

        return Inertia::render('CDRRMO/CRA/ReliefDistributionProcesses', [
            'processData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'steps' => $processData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function bdrrmcTrainings(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/BdrrmcTrainings', [
                'trainingData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view BDRRMC trainings.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/BdrrmcTrainings', [
                'trainingData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view BDRRMC trainings.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Training)
        $records = DB::table('c_r_a_bdrrmc_trainings as t')
            ->select(
                't.title',
                't.status',
                't.duration',
                't.agency',
                't.inclusive_dates',
                't.number_of_participants',
                't.participants'
            )
            ->where('t.cra_id', $cra->id)
            ->where('t.barangay_id', $barangayId)
            ->orderBy('t.title')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/BdrrmcTrainings', [
                'trainingData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No BDRRMC training data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $trainingData = $records->values()->map(function ($r) {
            return [
                'title' => $r->title,
                'status' => $r->status,
                'duration' => $r->duration,
                'agency' => $r->agency,
                'inclusive_dates' => $r->inclusive_dates,
                'number_of_participants' => $r->number_of_participants,
                'participants' => $r->participants,
            ];
        });

        return Inertia::render('CDRRMO/CRA/BdrrmcTrainings', [
            'trainingData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'trainings' => $trainingData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function equipmentInventories(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/EquipmentInventories', [
                'inventoryData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view equipment inventories.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/EquipmentInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view equipment inventories.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Item)
        $records = DB::table('c_r_a_equipment_inventories as e')
            ->select(
                'e.item',
                'e.availability',
                'e.quantity',
                'e.location',
                'e.remarks'
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.barangay_id', $barangayId)
            ->orderBy('e.item')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/EquipmentInventories', [
                'inventoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No equipment inventory data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $inventoryData = $records->values()->map(function ($r) {
            return [
                'item' => $r->item,
                'availability' => $r->availability,
                'quantity' => $r->quantity,
                'location' => $r->location,
                'remarks' => $r->remarks,
            ];
        });

        return Inertia::render('CDRRMO/CRA/EquipmentInventories', [
            'inventoryData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'items' => $inventoryData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function bdrrmcDirectories(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/BdrrmcDirectories', [
                'directoryData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view BDRRMC directories.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/BdrrmcDirectories', [
                'directoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view BDRRMC directories.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Team)
        $records = DB::table('c_r_a_bdrrmc_directories as d')
            ->select(
                'd.designation_team',
                'd.name',
                'd.contact_no'
            )
            ->where('d.cra_id', $cra->id)
            ->where('d.barangay_id', $barangayId)
            ->orderBy('d.designation_team')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/BdrrmcDirectories', [
                'directoryData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No BDRRMC directory data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $directoryData = $records->values()->map(function ($r) {
            return [
                'designation_team' => $r->designation_team,
                'name' => $r->name,
                'contact_no' => $r->contact_no,
            ];
        });

        return Inertia::render('CDRRMO/CRA/BdrrmcDirectories', [
            'directoryData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'members' => $directoryData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function evacuationPlans(Request $request)
    {
        // 1️⃣ Get CRA year from request or session
        $year = $request->input('year') ?? session('cra_year');
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/EvacuationPlans', [
                'planData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation plans.',
            ]);
        }

        $barangayId = $request->query('barangay_id');
        session(['cra_year' => $cra->year]);

        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/EvacuationPlans', [
                'planData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view evacuation plans.',
            ]);
        }

        // 🟩 Barangay Selected (Detailed per Activity)
        $records = DB::table('c_r_a_evacuation_plans as e')
            ->select(
                'e.activity_no',
                'e.things_to_do',
                'e.responsible_person',
                'e.remarks'
            )
            ->where('e.cra_id', $cra->id)
            ->where('e.barangay_id', $barangayId)
            ->orderBy('e.activity_no')
            ->get();

        if ($records->isEmpty()) {
            return Inertia::render('CDRRMO/CRA/EvacuationPlans', [
                'planData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => $barangayId,
                'tip' => 'No evacuation plan data found for the selected barangay.',
            ]);
        }

        $barangayName = DB::table('barangays')
            ->where('id', $barangayId)
            ->value('barangay_name');

        $planData = $records->values()->map(function ($r) {
            return [
                'activity_no' => $r->activity_no,
                'things_to_do' => $r->things_to_do,
                'responsible_person' => $r->responsible_person,
                'remarks' => $r->remarks,
            ];
        });

        return Inertia::render('CDRRMO/CRA/EvacuationPlans', [
            'planData' => [
                [
                    'barangay_name' => $barangayName,
                    'barangay_id' => $barangayId,
                    'activities' => $planData,
                ],
            ],
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    public function destroy($year)
    {
        DB::beginTransaction();

        try {
            // Find the CRA by year
            $cra = CommunityRiskAssessment::where('year', $year)->firstOrFail();

            // Delete related CRA progress records (cascade will also handle this, but we do it explicitly)
            CRAProgress::where('cra_id', $cra->id)->delete();

            // Delete the CRA record itself
            $cra->delete();

            DB::commit();

            return redirect()->route('cdrrmo_admin.dashboard')
                ->with('success', "Community Risk Assessment for year {$year} deleted successfully!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'CRA record could not be deleted: ' . $e->getMessage());
        }
    }
}

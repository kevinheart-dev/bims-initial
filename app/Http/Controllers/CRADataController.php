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
                $progressEntries = \App\Models\CRAProgress::where('cra_id', $cra->id)->get();

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

    //Problem in fetching all of the data only two rows shows
    public function damageproperty(Request $request)
    {
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record for that year
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

        // Get all barangays
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        // === CASE 1: No barangay selected → Overall summary ===
        $overallDamagePropertyData = [];
        if (!$barangayId) {
            // Get all damages for the CRA year
            $allRecords = CRADisasterDamage::with('disaster:id,disaster_name')
                ->where('cra_id', $cra->id)
                ->get(['damage_type', 'category', 'description', 'value', 'source', 'disaster_id']);

            // Group by disaster
            $overallDamagePropertyData = $allRecords->groupBy(fn($r) => $r->disaster->disaster_name)
                ->map(function ($group, $disasterName) {
                    // Map each record individually (all categories preserved)
                    $damages = $group->map(fn($r) => [
                        'damage_type' => $r->damage_type,
                        'category' => $r->category,
                        'description' => $r->description,
                        'value' => $r->value,
                        'source' => $r->source,
                    ])->values();

                    // Add Total Damage Value
                    $total = $damages->sum('value');
                    $damages->push([
                        'damage_type' => 'Total Damage Value',
                        'category' => null,
                        'description' => null,
                        'value' => $total,
                        'source' => null,
                    ]);

                    return [
                        'disaster_name' => $disasterName,
                        'damages' => $damages,
                    ];
                })->values();
        }

        // === CASE 2: Specific barangay view ===
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
                ->map(function ($group, $barangayName) {
                    // Group by disaster
                    $disasters = $group->groupBy(fn($r) => $r->disaster->disaster_name)
                        ->map(function ($rows, $disasterName) {
                            $damages = $rows->map(fn($r) => [
                                'damage_type' => $r->damage_type,
                                'category' => $r->category,
                                'description' => $r->description,
                                'value' => $r->value,
                                'source' => $r->source,
                                'disaster_id' => $r->disaster_id,
                                'disaster_name' => $r->disaster->disaster_name,
                                'year' => $r->disaster->year,
                            ])->values();

                            // Add total for this disaster
                            $total = $damages->sum('value');
                            $damages->push([
                                'damage_type' => 'Total Damage Value',
                                'category' => null,
                                'description' => null,
                                'value' => $total,
                                'source' => null,
                                'disaster_id' => $rows->first()->disaster_id,
                                'disaster_name' => $disasterName,
                                'year' => $rows->first()->disaster->year,
                            ]);

                            return [
                                'disaster_name' => $disasterName,
                                'damages' => $damages,
                            ];
                        })->values();

                    return [
                        'number' => null,
                        'barangay_name' => $barangayName,
                        'disasters' => $disasters,
                        'total' => $group->sum('value'),
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
        if (!$barangayId) {
            $overall = CRADisasterAgriDamage::with('disaster:id,disaster_name,year')
                ->where('cra_id', $cra->id)
                ->get(['description', 'value', 'source', 'disaster_id']);

            // Group by disaster
            $overallDisasterAgriData = $overall->groupBy(fn($r) => $r->disaster->disaster_name)
                ->map(function ($group, $disasterName) {
                    $effects = $group->groupBy('description')->map(function ($rows, $desc) {
                        return [
                            'description' => $desc,
                            'value' => $rows->sum('value'),
                            'source' => $rows->pluck('source')->filter()->unique()->implode('; '),
                        ];
                    })->values();

                    $total = $effects->sum('value');

                    // Add Total Damage Value
                    $effects->push([
                        'description' => 'Total Damage Value',
                        'value' => $total,
                        'source' => null,
                    ]);

                    return [
                        'disaster_name' => $disasterName,
                        'effects' => $effects,
                    ];
                })
                ->values();

            return Inertia::render('CDRRMO/CRA/AgriculturalDamages', [
                'disasterAgriData' => [],
                'overallDisasterAgriData' => $overallDisasterAgriData,
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
            ]);
        }

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
                    'total' => $group->sum('value'),
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

    // data is too large hinde ko alam gagawin dito
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

        // If no barangay is selected, return empty data
        if (!$barangayId) {
            return Inertia::render('CDRRMO/CRA/DisasterLifelines', [
                'disasterLifelineData' => [],
                'barangays' => $allBarangays,
                'selectedBarangay' => null,
                'tip' => 'Select a barangay from the dropdown above to view disaster lifeline data.',
            ]);
        }

        // Get disaster lifeline records for selected barangay
        $records = CRADisasterLifeline::with([
            'disaster:id,disaster_name,year',
            'barangay:id,barangay_name'
        ])
            ->where('cra_id', $cra->id)
            ->where('barangay_id', $barangayId)
            ->get(['id', 'cra_id', 'disaster_id', 'barangay_id', 'category', 'description', 'value', 'source']);

        $disasterLifelineData = $records->groupBy(fn($r) => $r->barangay->barangay_name)
            ->map(function ($group, $barangayName) {
                $row = [
                    'number' => null,
                    'barangay_name' => $barangayName,
                    'disasters' => $group->map(fn($r) => [
                        'disaster_id' => $r->disaster_id,
                        'disaster_name' => $r->disaster->disaster_name,
                        'year' => $r->disaster->year,
                        'category' => $r->category,
                        'description' => $r->description,
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

        return Inertia::render('CDRRMO/CRA/DisasterLifelines', [
            'disasterLifelineData' => $disasterLifelineData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\CommunityRiskAssessment;
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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CRADataController extends Controller
{
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
        )->get()->map(function ($item, $index) {
            $item->number = $index + 1;
            return $item;
        });

        // Gender Data
        $genderData = $applyBarangayFilter(
            CRAPopulationGender::query()
                ->join('barangays', 'c_r_a_population_genders.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_population_genders.gender,
                    SUM(c_r_a_population_genders.quantity) as total_quantity
                ')
                ->where('c_r_a_population_genders.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_population_genders.gender')
        )->get()->groupBy('barangay_name')
        ->map(function ($group, $barangay) {
            $genders = $group->map(fn($item) => [
                'gender' => $item->gender,
                'quantity' => (int) $item->total_quantity,
            ])->values();

            $total = $genders->sum('quantity');

            return [
                'barangay_name' => $barangay,
                'genders' => $genders,
                'total' => $total,
            ];
        })->sortByDesc('total')
            ->values()
            ->map(function ($item, $index) {
                $item['number'] = $index + 1;
                return $item;
            });

        // Repeat the same logic for ageDistributionData, houseBuildData, and houseOwnershipData
        $ageDistributionData = $applyBarangayFilter(
            CRAPopulationAgeGroup::query()
                ->join('barangays', 'c_r_a_population_age_groups.barangay_id', '=', 'barangays.id')
                ->selectRaw('
                    barangays.barangay_name,
                    c_r_a_population_age_groups.age_group,
                    SUM(c_r_a_population_age_groups.male_without_disability + c_r_a_population_age_groups.male_with_disability) as total_male,
                    SUM(c_r_a_population_age_groups.female_without_disability + c_r_a_population_age_groups.female_with_disability) as total_female,
                    SUM(c_r_a_population_age_groups.lgbtq_without_disability + c_r_a_population_age_groups.lgbtq_with_disability) as total_lgbtq,
                    SUM(
                        c_r_a_population_age_groups.male_without_disability + c_r_a_population_age_groups.male_with_disability +
                        c_r_a_population_age_groups.female_without_disability + c_r_a_population_age_groups.female_with_disability +
                        c_r_a_population_age_groups.lgbtq_without_disability + c_r_a_population_age_groups.lgbtq_with_disability
                    ) as total_population
                ')
                ->where('c_r_a_population_age_groups.cra_id', $cra->id)
                ->groupBy('barangays.barangay_name', 'c_r_a_population_age_groups.age_group')
                ->orderBy('barangays.barangay_name')
        )->get()->groupBy('barangay_name')
        ->map(function ($group, $barangay) {
            $ageGroups = $group->map(fn($item) => [
                'age_group' => $item->age_group,
                'male' => (int) $item->total_male,
                'female' => (int) $item->total_female,
                'lgbtq' => (int) $item->total_lgbtq,
                'total' => (int) $item->total_population,
            ])->values();

            $total = $ageGroups->sum('total');

            return [
                'barangay_name' => $barangay,
                'age_groups' => $ageGroups,
                'total' => $total,
            ];
        })->sortByDesc('total')
            ->values()
            ->map(function ($item, $index) {
                $item['number'] = $index + 1;
                return $item;
            });

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


    public function livelihood(Request $request){
        // Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Check if CRA data exists for the given year
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        // If CRA does not exist, clear the session and return empty data
        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/Livelihood', [
                'livelihoodStats' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

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

        // Apply barangay filter if selected
        if ($barangayId) {
            $query->where('ls.barangay_id', $barangayId);
        }

        $livelihoodStats = $query->orderBy('b.barangay_name')
            ->get()
            ->groupBy('barangay_name')
            ->map(function ($group, $barangayName) {
                $livelihoods = $group->map(fn($item) => [
                    'livelihood_type' => $item->livelihood_type,
                    'male_without_disability' => $item->male_without_disability,
                    'male_with_disability' => $item->male_with_disability,
                    'female_without_disability' => $item->female_without_disability,
                    'female_with_disability' => $item->female_with_disability,
                    'lgbtq_without_disability' => $item->lgbtq_without_disability,
                    'lgbtq_with_disability' => $item->lgbtq_with_disability,
                    'total' => $item->total,
                ])->sortByDesc('total') // ✅ sort by total descending
                ->values();

                return [
                    'number' => null, // will set after sorting
                    'barangay_name' => $barangayName,
                    'livelihoods' => $livelihoods,
                    'total' => $livelihoods->sum('total'),
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->map(function ($item, $index) {
                $item['number'] = $index + 1;
                return $item;
            });

        session(['cra_year' => $cra->year]);

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/Livelihood', [
            'livelihoodStats' => $livelihoodStats,
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
        // Get year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Get CRA record
        $cra = CommunityRiskAssessment::where('year', $year)->first();

        if (!$cra) {
            session()->forget('cra_year');
            return Inertia::render('CDRRMO/CRA/HumanResources', [
                'humanResourcesData' => [],
                'barangays' => [],
                'selectedBarangay' => null,
            ]);
        }

        $barangayId = $request->query('barangay_id');

        // Query human resources
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
                $row = [
                    'number' => null, // will assign after sorting
                    'barangay_name' => $barangayName,
                    'resources' => $group->map(fn($r) => [
                        'category' => $r->category,
                        'resource_name' => $r->resource_name,
                        'male_without_disability' => $r->male_without_disability,
                        'male_with_disability' => $r->male_with_disability,
                        'female_without_disability' => $r->female_without_disability,
                        'female_with_disability' => $r->female_with_disability,
                        'lgbtq_without_disability' => $r->lgbtq_without_disability,
                        'lgbtq_with_disability' => $r->lgbtq_with_disability,
                        'total' =>
                            $r->male_without_disability +
                            $r->male_with_disability +
                            $r->female_without_disability +
                            $r->female_with_disability +
                            $r->lgbtq_without_disability +
                            $r->lgbtq_with_disability,
                    ])->values(),
                    'total' => $group->sum(fn($r) =>
                        $r->male_without_disability +
                        $r->male_with_disability +
                        $r->female_without_disability +
                        $r->female_with_disability +
                        $r->lgbtq_without_disability +
                        $r->lgbtq_with_disability
                    ),
                ];
                return $row;
            })
            ->sortByDesc('total')
            ->values()
            ->map(fn($item, $index) => array_merge($item, ['number' => $index + 1]));

        session(['cra_year' => $cra->year]);

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        return Inertia::render('CDRRMO/CRA/HumanResources', [
            'humanResourcesData' => $humanResourcesData,
            'barangays' => $allBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }


}

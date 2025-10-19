<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\CommunityRiskAssessment;
use App\Models\CRAPopulationGender;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAPopulationAgeGroup;
use App\Models\Family;
use App\Models\Household;
use App\Models\Resident;
use App\Models\SeniorCitizen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CDRRMOAdminController extends Controller
{


    public function index(Request $request)
    {

        // Get the year from request or session
        $year = $request->input('year') ?? session('cra_year');

        // Check if CRA data exists for the given year
        $craExists = CommunityRiskAssessment::where('year', $year)->exists();

        // If CRA does not exist, clear the session and return empty data
        if (!$craExists) {
            // Clear the CRA year from session
            session()->forget('cra_year');

            return Inertia::render('CDRRMO/Dashboard', [
                'totalPopulation'   => null,
                'totalHouseholds'   => null,
                'totalFamilies'     => null,
                'ageDistribution'   => [],
                'genderData'        => [],
                'barangays'         => [],
                'topBarangays'      => [],
                'selectedBarangay'  => null,
                'selectedYear'      => null, // optional, to sync with frontend
            ]);
        }

        // If CRA exists, save the selected year in session
        session(['cra_year' => $year]);

        $barangayId = $request->query('barangay_id');

        if ($barangayId) {
            $totalPopulation = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::where('barangay_id', $barangayId)->sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->where('barangay_id', $barangayId)
                ->groupBy('gender')
                ->get();
        } else {
            $totalPopulation = CRAGeneralPopulation::sum('total_population');
            $totalHouseholds = CRAGeneralPopulation::sum('total_households');
            $totalFamilies   = CRAGeneralPopulation::sum('total_families');

            $ageDistribution = CRAPopulationAgeGroup::select(
                'age_group',
                DB::raw('SUM(male_without_disability) as male_without_disability'),
                DB::raw('SUM(male_with_disability) as male_with_disability'),
                DB::raw('SUM(female_without_disability) as female_without_disability'),
                DB::raw('SUM(female_with_disability) as female_with_disability'),
                DB::raw('SUM(lgbtq_without_disability) as lgbtq_without_disability'),
                DB::raw('SUM(lgbtq_with_disability) as lgbtq_with_disability')
            )
                ->groupBy('age_group')
                ->orderBy('age_group')
                ->get();

            $genderData = CRAPopulationGender::select(
                'gender',
                DB::raw('SUM(quantity) as total_quantity')
            )
                ->groupBy('gender')
                ->get();
        }

        // Fetch all barangays for dropdown
        $allBarangays = DB::table('barangays')
            ->select('id', 'barangay_name as name')
            ->orderBy('barangay_name')
            ->get();

        $sort = $request->query('sort', 'desc'); // default is 'desc' for top barangays

        $topBarangays = DB::table('barangays as b')
            ->join('c_r_a_general_populations as g', 'g.barangay_id', '=', 'b.id')
            ->select(
                'b.id',
                'b.barangay_name as barangay_name',
                DB::raw('SUM(g.total_population) as population'),
                DB::raw('SUM(g.total_households) as households'),
                DB::raw('SUM(g.total_families) as families')
            )
            ->groupBy('b.id', 'b.barangay_name')
            ->orderBy('population', $sort) // sort dynamically
            ->get()
            ->map(function ($row) {
                return [
                    'id' => $row->id,
                    'barangay_name' => $row->barangay_name,
                    'population' => (int) $row->population,
                    'households' => (int) $row->households,
                    'families' => (int) $row->families,
                ];
            });

        return Inertia::render('CDRRMO/Dashboard', [
            'totalPopulation' => $totalPopulation,
            'totalHouseholds' => $totalHouseholds,
            'totalFamilies'   => $totalFamilies,
            'ageDistribution' => $ageDistribution,
            'genderData'      => $genderData,
            'barangays'       => $allBarangays,
            'topBarangays'    => $topBarangays,
            'selectedBarangay' => $barangayId,
        ]);
    }

    // public function allDataCollection()
    // {
    //     $barangays = Barangay::with([
    //         'generalPopulation',
    //         'populationGenders',
    //         'populationAgeGroups',
    //         'populationExposures.hazard',
    //         'bdrrmcDirectories',
    //         'bdrrmcTrainings',
    //         'disasterOccurances.agriDamages',
    //         'disasterOccurances.damages',
    //         'disasterOccurances.effectImpacts',
    //         'disasterOccurances.lifelines',
    //         'disasterOccurances.populationImpacts',
    //         'disasterInventories.hazard',
    //         'disasterRiskPopulations.hazard',
    //         'primaryFacilities',
    //         'infraFacilities',
    //         'institutions',
    //         'roadNetworks',
    //         'publicTransportations',
    //         'houseBuilds',
    //         'houseOwnerships',
    //         'householdServices',
    //         'livelihoodStatistics',
    //         'livelihoodEvacuationSites',
    //         'reliefDistributions',
    //         'reliefDistributionProcesses',
    //         'equipmentInventories',
    //         'evacuationCenters',
    //         'evacuationInventories',
    //         'evacuationPlans',
    //         'familiesAtRisk',
    //         'hazardRisks.hazard',
    //         'assessmentMatrices.hazard',
    //         'illnessesStats',
    //         'disabilityStatistics',
    //         'humanResources',
    //         'affectedPlaces.hazard',
    //         'prepositionedInventories'
    //     ])->get();

    //     // Map through all barangays and call the dataCollection function
    //     $allData = $barangays->map(fn($barangay) => $barangay->dataCollection());

    //     return response()->json($allData);
    // }

    public function allDataCollectionSummary()
    {
        $barangays = Barangay::with([
            'generalPopulation',
            'populationGenders',
            'populationAgeGroups',
            'populationExposures.hazard',
            'bdrrmcDirectories',
            'bdrrmcTrainings',
            'disasterOccurances.agriDamages',
            'disasterOccurances.damages',
            'disasterOccurances.effectImpacts',
            'disasterOccurances.lifelines',
            'disasterOccurances.populationImpacts',
            'disasterInventories.hazard',
            'disasterRiskPopulations.hazard',
            'primaryFacilities',
            'infraFacilities',
            'institutions',
            'roadNetworks',
            'publicTransportations',
            'houseBuilds',
            'houseOwnerships',
            'householdServices',
            'livelihoodStatistics',
            'livelihoodEvacuationSites',
            'reliefDistributions',
            'reliefDistributionProcesses',
            'equipmentInventories',
            'evacuationCenters',
            'evacuationInventories',
            'evacuationPlans',
            'familiesAtRisk',
            'hazardRisks.hazard',
            'assessmentMatrices.hazard',
            'illnessesStats',
            'disabilityStatistics',
            'humanResources',
            'affectedPlaces.hazard',
            'prepositionedInventories'
        ])->get();

        // Initialize summary
        $summary = [
            'totalPopulation' => 0,
            'totalHouseholds' => 0,
            'totalFamilies' => 0,
            'totalGenders' => [],
            'ageDistribution' => [],
            'pwdCount' => 0,
            'nonPWDCount' => 0,
            'bdrrmcDirectory' => [],
            'bdrrmcTrainings' => [],
            'disasters' => [],
            'disasterInventories' => [],
            'disasterPerPurok' => [],
            'primaryFacilities' => [],
            'infraFacilities' => [],
            'institutions' => [],
            'roadNetworks' => [],
            'publicTransportations' => [],
            'houseBuilds' => [],
            'houseOwnerships' => [],
            'householdServices' => [],
            'livelihoodStatistics' => [],
            'livelihoodEvacuation' => [],
            'reliefDistributions' => [],
            'reliefDistributionProcesses' => [],
            'equipmentInventories' => [],
            'evacuationList' => [],
            'evacuationCenterInventory' => [],
            'evacuationPlans' => [],
            'familiesAtRisk' => [],
            'hazardRisks' => [],
            'vulnerabilities' => [],
            'risks' => [],
            'illnessesStats' => [],
            'disabilityStatistics' => [],
            'humanResources' => [],
            'affectedAreas' => [],
            'prepositionedInventories' => [],
        ];

        foreach ($barangays as $barangay) {
            $data = $barangay->dataCollection();

            // General population
            $summary['totalPopulation'] += $data['barangay']['population'];
            $summary['totalHouseholds'] += $data['barangay']['households_population'];
            $summary['totalFamilies'] += $data['barangay']['families_population'];

            // Gender distribution
            foreach ($data['population_genders'] as $genderData) {
                $summary['totalGenders'][$genderData['gender']] = ($summary['totalGenders'][$genderData['gender']] ?? 0) + $genderData['value'];
            }

            // Age distribution
            foreach ($data['population_age_groups'] as $ageGroup) {
                $label = $ageGroup['ageGroup'];
                $total = $ageGroup['male_no_dis'] + $ageGroup['male_dis'] +
                    $ageGroup['female_no_dis'] + $ageGroup['female_dis'] +
                    $ageGroup['lgbtq_no_dis'] + $ageGroup['lgbtq_dis'];
                $summary['ageDistribution'][$label] = ($summary['ageDistribution'][$label] ?? 0) + $total;
            }

            // PWD counts
            $summary['pwdCount'] += $data['pwdDistribution']['PWD'];
            $summary['nonPWDCount'] += $data['pwdDistribution']['nonPWD'];
            // Merge arrays
            $summary['bdrrmcDirectory'] = array_merge($summary['bdrrmcDirectory'], $data['bdrrmc_directory']);
            $summary['bdrrmcTrainings'] = array_merge($summary['bdrrmcTrainings'], $data['bdrrmc_trainings']);
            $summary['disasters'] = array_merge($summary['disasters'], $data['disasters']);
            $summary['disasterInventories'] = array_merge($summary['disasterInventories'], $data['disaster_inventories']);
            $summary['disasterPerPurok'] = array_merge($summary['disasterPerPurok'], $data['disaster_per_purok']);
            $summary['primaryFacilities'] = array_merge($summary['primaryFacilities'], $data['primary_facilities']);
            $summary['infraFacilities'] = array_merge($summary['infraFacilities'], $data['infra_facilities']);
            $summary['institutions'] = array_merge($summary['institutions'], $data['institutions']);
            $summary['roadNetworks'] = array_merge($summary['roadNetworks'], $data['road_networks']);
            $summary['publicTransportations'] = array_merge($summary['publicTransportations'], $data['public_transportations']);
            $summary['houseBuilds'] = array_merge($summary['houseBuilds'], $data['house_builds']);
            $summary['houseOwnerships'] = array_merge($summary['houseOwnerships'], $data['house_ownerships']);
            $summary['householdServices'] = array_merge($summary['householdServices'], $data['household_services']);
            $summary['livelihoodStatistics'] = array_merge($summary['livelihoodStatistics'], $data['livelihood_statistics']);
            $summary['livelihoodEvacuation'] = array_merge($summary['livelihoodEvacuation'], $data['livelihood_evacuation']);
            $summary['reliefDistributions'] = array_merge($summary['reliefDistributions'], $data['relief_distributions']);
            $summary['reliefDistributionProcesses'] = array_merge($summary['reliefDistributionProcesses'], $data['relief_distribution_processes']);
            $summary['equipmentInventories'] = array_merge($summary['equipmentInventories'], $data['equipment_inventories']);
            $summary['evacuationList'] = array_merge($summary['evacuationList'], $data['evacuation_list']);
            $summary['evacuationCenterInventory'] = array_merge($summary['evacuationCenterInventory'], $data['evacuation_center_inventory']);
            $summary['evacuationPlans'] = array_merge($summary['evacuationPlans'], $data['evacuation_plans']);
            $summary['familiesAtRisk'] = array_merge($summary['familiesAtRisk'], $data['families_at_risk']);
            $summary['hazardRisks'] = array_merge($summary['hazardRisks'], $data['hazard_risks']);
            $summary['vulnerabilities'] = array_merge($summary['vulnerabilities'], $data['vulnerabilities']);
            $summary['risks'] = array_merge($summary['risks'], $data['risks']);
            $summary['illnessesStats'] = array_merge($summary['illnessesStats'], $data['illnesses_stats']);
            $summary['disabilityStatistics'] = array_merge($summary['disabilityStatistics'], $data['disability_statistics']);
            $summary['humanResources'] = array_merge($summary['humanResources'], $data['human_resources']);
            $summary['affectedAreas'] = array_merge($summary['affectedAreas'], $data['affected_areas']);
            $summary['prepositionedInventories'] = array_merge($summary['prepositionedInventories'], $data['prepositioned_inventories']);
        }
        return response()->json($summary);
    }


    public function allDataCollectionSummaryLight()
    {
        $barangays = Barangay::with([
            'generalPopulation',
            'populationGenders',
            'populationAgeGroups',
        ])->get();

        $summary = [
            'totalPopulation' => 0,
            'totalHouseholds' => 0,
            'totalFamilies' => 0,
            'genderDistribution' => [],
            'ageDistribution' => [],
        ];

        foreach ($barangays as $barangay) {
            $data = $barangay->dataCollection();

            // Total population
            $summary['totalPopulation'] += $data['barangay']['population'];
            $summary['totalHouseholds'] += $data['barangay']['households_population'];
            $summary['totalFamilies'] += $data['barangay']['families_population'];

            // Gender totals
            foreach ($data['population_genders'] as $genderData) {
                $summary['genderDistribution'][$genderData['gender']] =
                    ($summary['genderDistribution'][$genderData['gender']] ?? 0) + $genderData['value'];
            }

            // Age group totals
            foreach ($data['population_age_groups'] as $ageGroup) {
                $label = $ageGroup['ageGroup'];
                $total = $ageGroup['male_no_dis'] + $ageGroup['male_dis'] +
                    $ageGroup['female_no_dis'] + $ageGroup['female_dis'] +
                    $ageGroup['lgbtq_no_dis'] + $ageGroup['lgbtq_dis'];
                $summary['ageDistribution'][$label] =
                    ($summary['ageDistribution'][$label] ?? 0) + $total;
            }
        }

        return response()->json($summary);
    }
}

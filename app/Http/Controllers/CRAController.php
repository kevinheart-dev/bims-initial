<?php

namespace App\Http\Controllers;

use App\Models\CRAAffectedPlaces;
use App\Models\CRAAssessmentMatrix;
use App\Models\CRABdrrmcDirectory;
use App\Models\CRABdrrmcTraining;
use App\Models\CRADisasterAgriDamage;
use App\Models\CRADisasterDamage;
use App\Models\CRADisasterEffectImpact;
use App\Models\CRADisasterInventory;
use App\Models\CRADisasterLifeline;
use App\Models\CRADisasterOccurance;
use App\Models\CRADisasterPopulationImpact;
use App\Models\CRADisasterRiskPopulation;
use App\Models\CRAEquipmentInventory;
use App\Models\CRAEvacuationCenter;
use App\Models\CRAEvacuationInventory;
use App\Models\CRAEvacuationPlan;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAHazard;
use App\Models\CRAHazardRisk;
use App\Models\CRAHouseBuild;
use App\Models\CRAHouseholdService;
use App\Models\CRAHouseOwnership;
use App\Models\CRAHumanResource;
use App\Models\CRAInfraFacility;
use App\Models\CRAInstitution;
use App\Models\CRALivelihoodEvacuationSite;
use App\Models\CRALivelihoodStatistic;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationGender;
use App\Models\CRAPrepositionedInventory;
use App\Models\CRAPrimaryFacility;
use App\Models\CRAPublicTransportation;
use App\Models\CRAReliefDistribution;
use App\Models\CRAReliefDistributionProcess;
use App\Models\CRARoadNetwork;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CRAController extends Controller
{
    public function index()
    {
        dd('yes');
    }
    public function create()
    {
        // here to code kvin ramos
        return Inertia::render("BarangayOfficer/CRA/Create");
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        //dd( $request->all());
        try {
            $brgy_id = auth()->user()->barangay_id;
            $data = $request->all();

            //*===================== Barangay Resource Profile =======================*//
            // general population
            CRAGeneralPopulation::updateOrCreate(
                [
                    'barangay_id' => $brgy_id, // condition
                ],
                [
                    'total_population' => $data['barangayPopulation'],
                    'total_households' => $data['householdsPopulation'],
                    'total_families'   => $data['familiesPopulation'],
                ]
            );

            // population by gender
            foreach ($data["populationGender"] as $item) {
                CRAPopulationGender::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'gender' => $item['gender'],
                    ],
                    [
                        'quantity' => $item['value'],
                    ]
                );
            }

            // population by age group
            foreach ($data['population'] as $item) {
                CRAPopulationAgeGroup::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'age_group' => $item['ageGroup'], // unique identifier
                    ],
                    [
                        'male_without_disability'   => $item['male_no_dis'] ?? 0,
                        'male_with_disability'      => $item['male_dis'] ?? 0,
                        'female_without_disability' => $item['female_no_dis'] ?? 0,
                        'female_with_disability'    => $item['female_dis'] ?? 0,
                        'lgbtq_without_disability'  => $item['lgbtq_no_dis'] ?? 0,
                        'lgbtq_with_disability'     => $item['lgbtq_dis'] ?? 0,
                    ]
                );
            }

            // Livelihood statistics
            foreach ($data['livelihood'] as $item) {
                CRALivelihoodStatistic::updateOrCreate(
                    [
                        'barangay_id'     => $brgy_id,
                        'livelihood_type' => $item['type'], // unique identifier
                    ],
                    [
                        'male_without_disability'   => $item['male_no_dis'] ?? 0,
                        'male_with_disability'      => $item['male_dis'] ?? 0,
                        'female_without_disability' => $item['female_no_dis'] ?? 0,
                        'female_with_disability'    => $item['female_dis'] ?? 0,
                        'lgbtq_without_disability'  => $item['lgbtq_no_dis'] ?? 0,
                        'lgbtq_with_disability'     => $item['lgbtq_dis'] ?? 0,
                    ]
                );
            }

            // household services (water, electricity etc...)
            foreach ($data["infrastructure"] as $infra) {
                $category = $infra['category'];

                foreach ($infra['rows'] as $row) {
                    CRAHouseholdService::updateOrCreate(
                        [
                            'barangay_id'   => $brgy_id,
                            'category'      => $category,
                            'service_name'  => $row['type'],
                        ],
                        [
                            'households_quantity' => $row['households'] ?? 0,
                        ]
                    );
                }
            }

            // house build (concrete, wood etc..)
            foreach ($data['houses'] as $house) {
                CRAHouseBuild::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'house_type'  => $house['houseType'],
                    ],
                    [
                        'one_floor'          => $house['oneFloor'] ?? 0,
                        'two_or_more_floors' => $house['multiFloor'] ?? 0,
                    ]
                );
            }

            // house ownership
            foreach ($data['ownership'] as $type => $quantity) {
                CRAHouseOwnership::updateOrCreate(
                    [
                        'barangay_id'    => $brgy_id,
                        'ownership_type' => $type,
                    ],
                    [
                        'quantity' => $quantity ?? 0,
                    ]
                );
            }

            // infrastrucure buildings
            foreach ($data['buildings'] as $buildingCategory) {
                $category = $buildingCategory['category'];

                foreach ($buildingCategory['rows'] as $row) {
                    CRAInfraFacility::updateOrCreate(
                        [
                            'barangay_id'        => $brgy_id,
                            'category'           => $category,
                            'infrastructure_name'=> $row['type'],
                        ],
                        [
                            'quantity' => $row['households'] ?? 0,
                        ]
                    );
                }
            }

            // facilities (primary facility, roads and public transpo)
            foreach ($data["facilities"] as $facilityCategory) {
                $category = $facilityCategory['category'];
                foreach ($facilityCategory['rows'] as $row) {
                    // Handle Facilities and Services
                    if ($category === "Facilities and Services") {
                        CRAPrimaryFacility::updateOrCreate(
                            [
                                'barangay_id'   => $brgy_id,
                                'facility_name' => $row['type'],
                            ],
                            [
                                'quantity' => $row['quantity'] ?? 0,
                            ]
                        );
                    }

                    // Handle Public Transportation
                    if ($category === "Public Transportation") {
                        CRAPublicTransportation::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'transpo_type'=> $row['type'],
                            ],
                            [
                                'quantity' => $row['quantity'] ?? 0,
                            ]
                        );
                    }

                    // Handle Road Types
                    if ($category === "Road Types") {
                        CRARoadNetwork::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'road_type'   => $row['type'],
                            ],
                            [
                                'length_km'   => $row['length'] ?? 0,
                                'maintained_by' => $row['maitained_by'] ?? null, // typo-safe
                            ]
                        );
                    }
                }
            }

            // institutions
            foreach ($data["institutions"] as $inst) {
                CRAInstitution::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'name'        => $inst['name'], // unique per barangay + name
                    ],
                    [
                        'male_members'    => $inst['male'] ?? 0,
                        'female_members'  => $inst['female'] ?? 0,
                        'lgbtq_members'   => $inst['lgbtq'] ?? 0,
                        'head_name'       => $inst['head'] ?? null,
                        'contact_no'      => $inst['contact'] ?? null,
                        'registered'      => $inst['registered'] ?? "NO",
                        'programs_services' => $inst['programs'] ?? null,
                    ]
                );
            }

            // human resources
            foreach ($data["human_resources"] as $group) {
                $category = $group['category'];

                foreach ($group['rows'] as $row) {
                    CRAHumanResource::updateOrCreate(
                        [
                            'barangay_id'  => $brgy_id,
                            'category'     => $category,
                            'resource_name'=> $row['type'], // unique within barangay+category
                        ],
                        [
                            'male_without_disability'   => $row['male_no_dis'] ?? 0,
                            'male_with_disability'      => $row['male_dis'] ?? 0,
                            'female_without_disability' => $row['female_no_dis'] ?? 0,
                            'female_with_disability'    => $row['female_dis'] ?? 0,
                            'lgbtq_without_disability'  => $row['lgbtq_no_dis'] ?? 0,
                            'lgbtq_with_disability'     => $row['lgbtq_dis'] ?? 0,
                        ]
                    );
                }
            }

            //*===================== Community Disaster History =======================*//
            foreach ($data["calamities"] as $calamity) {
                // Disaster Occurrence
                $disaster = CRADisasterOccurance::updateOrCreate(
                    [
                        'barangay_id'   => $brgy_id,
                        'disaster_name' => $calamity['disaster_name'],
                        'year'          => $calamity['year'],
                    ],
                    []
                );

                $disaster_id = $disaster->id;

                // --- Population Impact
                foreach ($calamity['population'] as $pop) {
                    CRADisasterPopulationImpact::updateOrCreate(
                        [
                            'barangay_id' => $brgy_id,
                            'disaster_id' => $disaster_id,
                            'category'    => $pop['category'],
                        ],
                        [
                            'value'  => $pop['value'] ?? 0,
                            'source' => $pop['source'] ?? null,
                        ]
                    );
                }

                // --- Effect Impacts
                foreach ($calamity['impacts'] as $impact) {
                    CRADisasterEffectImpact::updateOrCreate(
                        [
                            'barangay_id' => $brgy_id,
                            'disaster_id' => $disaster_id,
                            'effect_type' => $impact['effect_type'], // ✅ correct field
                        ],
                        [
                            'value'  => $impact['value'] ?? 0,
                            'source' => $impact['source'] ?? null,
                        ]
                    );
                }

                // --- Property Damage
                foreach ($calamity['property'] as $prop) {
                    foreach ($prop['descriptions'] as $desc) {
                        CRADisasterDamage::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'disaster_id' => $disaster_id,
                                'category'    => $prop['category'],
                                'description' => $desc['description'],
                            ],
                            [
                                'value'  => $desc['value'] ?? 0,
                                'source' => $desc['source'] ?? null,
                            ]
                        );
                    }
                }

                // --- Structure Damage
                foreach ($calamity['structure'] as $struct) {
                    foreach ($struct['descriptions'] as $desc) {
                        CRADisasterDamage::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'disaster_id' => $disaster_id,
                                'category'    => $struct['category'],
                                'description' => $desc['description'],
                            ],
                            [
                                'value'  => $desc['value'] ?? 0,
                                'source' => $desc['source'] ?? null,
                            ]
                        );
                    }
                }

                // --- Agriculture Damage
                foreach ($calamity['agriculture'] as $agri) {
                    CRADisasterAgriDamage::updateOrCreate(
                        [
                            'barangay_id' => $brgy_id,
                            'disaster_id' => $disaster_id,
                            'description' => $agri['description'],
                        ],
                        [
                            'value'  => $agri['value'] ?? 0,
                            'source' => $agri['source'] ?? null,
                        ]
                    );
                }

                // --- Lifelines
                foreach ($calamity['lifelines'] as $life) {
                    $category = is_array($life['category'])
                        ? ($life['category'][0] ?? null)
                        : $life['category'];

                    foreach ($life['descriptions'] as $desc) {
                        CRADisasterLifeline::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'disaster_id' => $disaster_id,
                                'category'    => $category,
                                'description' => $desc['description'],
                            ],
                            [
                                'value'  => $desc['value'] ?? 0,
                                'source' => $desc['source'] ?? null,
                            ]
                        );
                    }
                }
            }

            //*===================== Barangay Risk Assessment =======================*//
            // hazards
            foreach ($data["hazards"] as $haz) {
                // 1. Ensure hazard exists in CRAHazard table
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $haz['hazard']],
                    []
                );

                // 2. Calculate average_score
                $average = round((
                    ($haz['probability'] ?? 0) +
                    ($haz['effect'] ?? 0) +
                    ($haz['management'] ?? 0)
                ) / 3, 2);

                // 3. Save hazard risk for barangay
                CRAHazardRisk::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'hazard_id'   => $hazard->id,
                    ],
                    [
                        'probability_no' => $haz['probability'] ?? 0,
                        'effect_no'      => $haz['effect'] ?? 0,
                        'management_no'  => $haz['management'] ?? 0,
                        'basis'          => $haz['basis'] ?? null,
                        'average_score'  => $average,
                    ]
                );
            }

             // Save RISKS
            foreach ($data["risks"] as $risk) {
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $risk['hazard']],
                    []
                );

                CRAAssessmentMatrix::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'hazard_id'   => $hazard->id,
                        'matrix_type' => 'risk',
                    ],
                    [
                        'people'      => $risk['people'] ?? null,
                        'properties'  => $risk['properties'] ?? null,
                        'services'    => $risk['services'] ?? null,
                        'environment' => $risk['environment'] ?? null,
                        'livelihood'  => $risk['livelihood'] ?? null,
                    ]
                );
            }

            // Save VULNERABILITIES
            foreach ($data["vulnerabilities"] as $vul) {
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $vul['hazard']],
                    []
                );

                CRAAssessmentMatrix::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'hazard_id'   => $hazard->id,
                        'matrix_type' => 'vulnerability',
                    ],
                    [
                        'people'      => $vul['people'] ?? null,
                        'properties'  => $vul['properties'] ?? null,
                        'services'    => $vul['services'] ?? null,
                        'environment' => $vul['environment'] ?? null,
                        'livelihood'  => $vul['livelihood'] ?? null,
                    ]
                );
            }

            // disaster per purok
            foreach ($data["disaster_per_purok"] as $disasterData) {
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $disasterData['type']],
                    []
                );

                foreach ($disasterData['rows'] as $row) {
                    CRADisasterRiskPopulation::updateOrCreate(
                        [
                            'barangay_id' => $brgy_id,
                            'hazard_id' => $hazard->id,
                            'purok_number' => $row['purok'],
                        ],
                        [
                            'low_families' => $row['lowFamilies'] ?? 0,
                            'low_individuals' => $row['lowIndividuals'] ?? 0,
                            'medium_families' => $row['mediumFamilies'] ?? 0,
                            'medium_individuals' => $row['mediumIndividuals'] ?? 0,
                            'high_families' => $row['highFamilies'] ?? 0,
                            'high_individuals' => $row['highIndividuals'] ?? 0,
                        ]
                    );
                }
            }

            // disaster inventory
            foreach ($data["disaster_inventory"] as $inventoryData) {
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $inventoryData['hazard']],
                    []
                );

                foreach ($inventoryData['categories'] as $categoryData) {
                    foreach ($categoryData['rows'] as $row) {
                        CRADisasterInventory::updateOrCreate(
                            [
                                'barangay_id' => $brgy_id,
                                'hazard_id' => $hazard->id,
                                'category' => $categoryData['type'],
                                'item_name' => $row['item'],
                            ],
                            [
                                'total_in_barangay' => $row['total'] ?? 0,
                                'percetage_at_risk' => $row['percent'] ?? null,
                                'location' => $row['location'] ?? null,
                            ]
                        );
                    }
                }
            }
            // evacuation list
            foreach ($data["evacuation_list"] as $center) {
                CRAEvacuationCenter::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'name' => $center['name'],
                    ],
                    [
                        'capacity_families' => $center['families'] ?? 0,
                        'capacity_individuals' => $center['individuals'] ?? 0,

                        // Convert owner flags into enum
                        'owner_type' => $center['ownerGovt'] ? 'government' : 'private',

                        // Map inspection and MOU to booleans
                        'inspected_by_engineer' => $center['inspectedYes'] ? true : false,
                        'has_mou' => $center['mouYes'] ? true : false,
                    ]
                );
            }
            //*===================== Inventory & Evacuations =======================*//

            // evacuation inventory
            foreach ($data["evacuation_center_inventory"] as $index => $inventory) {
                CRAEvacuationInventory::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'purok_number' => $index + 1, // auto assign purok number
                    ],
                    [
                        'total_families' => $inventory['totalFamilies'] ?? 0,
                        'total_individuals' => $inventory['totalIndividuals'] ?? 0,

                        'families_at_risk' => $inventory['populationAtRiskFamilies'] ?? 0,
                        'individuals_at_risk' => $inventory['populationAtRiskIndividuals'] ?? 0,

                        'plan_a_center' => $inventory['evacuationCenterPlanA'] ?? null,
                        'plan_a_capacity_families' => $inventory['personsCanBeAccommodatedPlanAFamilies'] ?? 0,
                        'plan_a_capacity_individuals' => $inventory['personsCanBeAccommodatedPlanAIndividuals'] ?? 0,
                        'plan_a_unaccommodated_families' => $inventory['personsCannotBeAccommodatedPlanAFamilies'] ?? 0,
                        'plan_a_unaccommodated_individuals' => $inventory['personsCannotBeAccommodatedPlanAIndividuals'] ?? 0,

                        'plan_b_center' => $inventory['evacuationCenterPlanB'] ?? null,
                        'plan_b_unaccommodated_families' => $inventory['personsCannotBeAccommodatedPlanABFamilies'] ?? 0,
                        'plan_b_unaccommodated_individuals' => $inventory['personsCannotBeAccommodatedPlanABIndividuals'] ?? 0,

                        'remarks' => $inventory['remarks'] ?? null,
                    ]
                );
            }

            // affect places
            foreach ($data["affected_areas"] as $area) {
                // Find or create hazard by name
                $hazard = CRAHazard::updateOrCreate(
                    ['hazard_name' => $area['name']],
                    []
                );

                foreach ($area['rows'] as $row) {
                    CRAAffectedPlaces::updateOrCreate(
                        [
                            'barangay_id'   => $brgy_id,
                            'hazard_id'     => $hazard->id,
                            'purok_number'  => $row['purok'],
                        ],
                        [
                            'risk_level'            => $row['riskLevel'] ?? 'Low',
                            'total_families'        => $row['totalFamilies'] ?? 0,
                            'total_individuals'     => $row['totalIndividuals'] ?? 0,
                            'at_risk_families'      => $row['atRiskFamilies'] ?? 0,
                            'at_risk_individuals'   => $row['atRiskIndividuals'] ?? 0,
                            'safe_evacuation_area'  => $row['safeEvacuationArea'] ?? null,
                        ]
                    );
                }
            }

            // evacuation livelihood
            foreach ($data["livelihood_evacuation"] as $row) {
                CRALivelihoodEvacuationSite::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'livelihood_type' => $row['type'],
                    ],
                    [
                        'evacuation_site' => $row['evacuation'] ?? null,
                        'place_of_origin' => $row['origin'] ?? null,
                        'capacity_description' => $row['items'] ?? null,
                    ]
                );
            }

            // food inventory
            foreach ($data['food_inventory'] as $row) {
                CRAPrepositionedInventory::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'item_name'   => $row['item'],
                    ],
                    [
                        'quantity' => $row['quantity'] ?? 0,
                        'remarks'  => $row['remarks'] ?? null,
                    ]
                );
            }

            // relief goods distribution
            foreach ($data['relief_goods'] as $distribution) {
                // Split multiline fields into arrays
                $goods     = preg_split('/\r\n|\r|\n/', trim($distribution['typeOfGoods']));
                $quantities = preg_split('/\r\n|\r|\n/', trim($distribution['quantity']));
                $units     = preg_split('/\r\n|\r|\n/', trim($distribution['unit']));

                foreach ($goods as $index => $good) {
                    $goodName  = trim($good);
                    $qty       = $quantities[$index] ?? null;
                    $unit      = $units[$index] ?? null;

                    if ($goodName !== '') {
                        CRAReliefDistribution::updateOrCreate(
                            [
                                'barangay_id'       => $brgy_id,
                                'evacuation_center' => $distribution['evacuationCenter'],
                                'relief_good'       => $goodName,
                                'address'           => $distribution['address'],
                            ],
                            [
                                'quantity'      => $qty,
                                'unit'          => $unit,
                                'beneficiaries' => $distribution['beneficiaries'] ?? null,
                            ]
                        );
                    }
                }
            }

            //*===================== Disaster Readiness =======================*//

           // Relief Distribution Process
            foreach ($data["distribution_process"] as $index => $row) {
                CRAReliefDistributionProcess::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'step_no'     => $index + 1, // Auto-assign step number (1, 2, 3...)
                    ],
                    [
                        'distribution_process' => $row['process'] ?? null,
                        'origin_of_goods'      => $row['origin'] ?? null,
                        'remarks'              => $row['remarks'] ?? null,
                    ]
                );
            }

            // BDRRMC Trainings
            foreach ($data["trainings_inventory"] as $row) {
                CRABdrrmcTraining::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'title'       => $row['title'], // unique per barangay + title
                    ],
                    [
                        'status'                => $row['applies'] === 'yes' ? 'checked' : 'cross',
                        'duration'              => $row['duration'] ?? null,
                        'agency'                => $row['agency'] ?? null,
                        'inclusive_dates'       => $row['dates'] ?? null,
                        'number_of_participants'=> $row['participants'] ?? 0,
                        'participants'          => $row['names'] ?? null,
                    ]
                );
            }

            // BDRRMC Directory
            foreach ($data["bdrrmc_directory"] as $row) {
                CRABdrrmcDirectory::updateOrCreate(
                    [
                        'barangay_id'      => $brgy_id,
                        'designation_team' => $row['designation'], // unique per barangay + designation
                    ],
                    [
                        'name'       => $row['name'] ?? null,
                        'contact_no' => $row['contact'] ?? null,
                    ]
                );
            }

            // Equipment Inventory
            foreach ($data["equipment_inventory"] as $row) {
                CRAEquipmentInventory::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'item'        => $row['item'], // unique per barangay + item
                    ],
                    [
                        // enforce enum mapping
                        'availability'   => ($row['status'] === 'yes' || $row['status'] === 'checked') ? 'checked' : 'cross',
                        'quantity' => $row['quantity'] ?? 0,
                        'location' => $row['location'] ?? null,
                        'remarks'  => $row['remarks'] ?? null,
                    ]
                );
            }

            // Evacuation Plan
            foreach ($data["evacuation_plan"] as $index => $row) {
                CRAEvacuationPlan::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'activity_no' => $index + 1, // auto-generate activity number
                    ],
                    [
                        'things_to_do'      => $row['task'] ?? null,
                        'responsible_person'=> $row['responsible'] ?? null,
                        'remarks'           => $row['remarks'] ?? null,
                    ]
                );
            }

            DB::commit();
            dd( "PALDOOOOOO");
        } catch (\Throwable $e) {
            DB::rollBack();
            dd( 'error: '   . $e->getMessage());
            return response()->json([
                'message' => 'Error saving CRA record',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

}

<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\CommunityRiskAssessment;
use App\Models\CRAAffectedPlaces;
use App\Models\CRAAssessmentMatrix;
use App\Models\CRABdrrmcDirectory;
use App\Models\CRABdrrmcTraining;
use App\Models\CRADisabilityStatistic;
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
use App\Models\CRAFamilyAtRisk;
use App\Models\CRAGeneralPopulation;
use App\Models\CRAHazard;
use App\Models\CRAHazardRisk;
use App\Models\CRAHouseBuild;
use App\Models\CRAHouseholdService;
use App\Models\CRAHouseOwnership;
use App\Models\CRAHumanResource;
use App\Models\CRAIllnessesStat;
use App\Models\CRAInfraFacility;
use App\Models\CRAInstitution;
use App\Models\CRALivelihoodEvacuationSite;
use App\Models\CRALivelihoodStatistic;
use App\Models\CRAPopulationAgeGroup;
use App\Models\CRAPopulationExposure;
use App\Models\CRAPopulationGender;
use App\Models\CRAPrepositionedInventory;
use App\Models\CRAPrimaryFacility;
use App\Models\CRAPublicTransportation;
use App\Models\CRAReliefDistribution;
use App\Models\CRAReliefDistributionProcess;
use App\Models\CRARoadNetwork;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CRADataseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = fake();

        $ageGroups = [
            "0_6_mos",
            "7_mos_to_2_yrs",
            "3_to_5_yrs",
            "6_to_12_yrs",
            "13_to_17_yrs",
            "18_to_59_yrs",
            "60_plus_yrs",
        ];

        $houseTypes = [
            'Concrete',
            'Semi-Concrete',
            'Made of wood and light materials',
            'Salvaged/Makeshift House',
        ];

        $ownershipTypes = [
            'Owned (Land and House)',
            'Rented',
            'Shared with Owner',
            'Shared with Renter',
            'Owned (House)',
            'Informal Settler Families',
        ];

        $livelihoods = [
            'Farming'               => [100, 400],
            'Fishing'               => [10, 80],
            'Poultry and Livestock' => [10, 80],
            'Carpentry'             => [5, 50],
            'Professional'          => [50, 200],
            'Government Employee'   => [20, 100],
            'Private Employee'      => [50, 200],
            'Brgy. Official or Staff' => [10, 30],
            'Businessman/woman'     => [10, 70],
            'Formal/Licensed Driver'=> [20, 150],
            'Non-Licensed Driver'   => [5, 40],
            'Porter'                => [5, 25],
            'House Helper'          => [5, 50],
            'Electrician'           => [5, 40],
            'Laborer'               => [100, 350],
            'Miner'                 => [0, 10],
            'Lender'                => [0, 10],
            'Call Center Agent'     => [0, 20],
            'Medical Transcriptionist'=> [0, 20],
            'Virtual Assistant'     => [0, 20],
            'Masseuse'              => [0, 10],
            'Not mentioned above'   => [0, 10],
        ];

        $services = [
            'Electricity Source' => [
                'Distribution Company (ISELCO-II)' => 1298,
                'Generator' => 0,
                'Solar (renewable energy source)' => 1,
                'Battery' => 0,
                'Not mentioned above (Specify)' => 0,
                'None' => 0,
            ],
            'Water Source' => [
                'Level II Water System' => 0,
                'Level III Water System' => 906,
                'Deep Well (Level I)' => 0,
                'Artesian Well (Level I)' => 0,
                'Shallow Well (Level I)' => 3,
                'Commercial Water Refill Source' => 390,
                'Not mentioned above (Specify)' => 0,
            ],
            'Waste Management' => [
                'Open Dump Site' => 0,
                'Sanitary Landfill' => 0,
                'Compost Pits' => 3,
                'Material Recovery Facility (MRF)' => 312,
                'Garbage is collected' => 984,
                'Not mentioned above (Specify)' => 0,
            ],
            'Toilet' => [
                'Water Sealed' => 908,
                'Compost Pit Toilet' => 0,
                'Shared or Communal Toilet/Public Toilet' => 12,
                'No Latrine' => 10,
                'Not mentioned above (Specify) flash toilet' => 369,
            ],
            'Bath and Wash Area' => [
                'With own Sink and Bath' => 601,
                'Shared or Communal' => 5,
                'Not mentioned above (Specify) Separate Bathroom' => 693,
            ],
        ];

        $infraData = [
            'Health and Medical Facilities' => [
                'Evacuation Center' => [0, 3],
                'Flood Control' => [0, 1],
                'Rain Water Harvester (Communal)' => [0, 2],
                'Barangay Disaster Operation Center' => [0, 1],
                'Public Comfort Room/Toilet' => [0, 20],
                'Community Garden' => [0, 3],
                'Barangay Health Center' => [0, 2],
                'Hospital' => [0, 1],
                'Maternity Clinic' => [0, 1],
                'Child Clinic' => [0, 1],
                'Private Medical Clinic' => [0, 2],
                'Barangay Drug Store' => [0, 1],
                'City/Municipal Public Drug Store' => [0, 1],
                'Private Drug Store' => [0, 3],
                'Quarantine/Isolation Facility' => [0, 2],
                'Not mentioned above (Specify)' => [0, 1],
            ],
            'Educational Facilities' => [
                'Child Development Center' => [0, 3],
                'Preschool' => [0, 2],
                'Elementary' => [0, 2],
                'Secondary' => [0, 2],
                'Vocational' => [0, 1],
                'College/University' => [0, 1],
                'Islamic School' => [0, 1],
                'Not mentioned above (Specify) Senior High School (@SANAIVHS)' => [0, 1],
            ],
            'Agricultural Facilities' => [
                'Rice Mill' => [0, 2],
                'Corn Mill' => [0, 2],
                'Feed Mill' => [0, 1],
                'Agricultural Produce Market' => [0, 1],
                'Not mentioned above (Specify)' => [0, 1],
            ],
        ];

        $primaryFacilities = [
            'Multi-Purpose Hall' => [1, 1], // always 1
            'Barangay Women and Children Protection Desk' => [1, 1], // always 1
            'Barangay Tanods and Barangay Peacekeeping Action Team Post' => [1, 1], // always 1
            'Bureau of Jail Management and Penology' => [0, 1], // rare
            'Philippine National Police Outpost' => [0, 1], // some barangays
            'Bank' => [0, 1], // very rare
            'Post Office' => [0, 1], // rare
            'Market' => [0, 2], // some barangays have 1, few have 2
            'Not mentioned above (Specify)' => [0, 1], // optional custom entry
        ];
        $transportTypes = [
            'Bus' => [0, 10],         // only a few per barangay
            'Taxi' => [0, 5],         // rare
            'Van/FX' => [0, 15],      // common in transport hubs
            'Jeepney' => [0, 20],     // present in most barangays
            'Tricycle' => [10, 150],  // very common in all barangays
            'Pedicab' => [0, 10],     // less common
            'Boat' => [0, 20],        // only in coastal barangays
            'Electronic Bike (E-Bike)' => [0, 50], // increasing popularity
        ];
        $roadTypes = [
            'Concrete' => ['Barangay & LGU', 2, 15],     // usually most common
            'Asphalt' => ['LGU / DPWH', 0, 5],           // not all barangays
            'Gravel' => ['Barangay', 0, 10],             // common in rural
            'Natural Earth Surface' => ['NONE', 0, 8],   // very rural areas
            'Others' => ['NONE', 0, 3],                  // seldom
        ];
        $baseInstitutions = [
            'AMA',
            'ILAW',
            'KAGCEN',
            'CENTRO SAN ANTONIO ACHIEVERS AGRICULTURES COOPERATIVE',
            'SAN ANTONIO BARIKIR COOPERATIVE',
            'CIGA',
        ];

        // Possible random additional institutions
        $extraInstitutions = [
            'Farmers Association',
            'Fisherfolk Cooperative',
            'Youth Council',
            'Senior Citizens Group',
            'PWD Association',
            'Tricycle Operators and Drivers Association',
            'Women’s Association',
            'Barangay Sports Club',
            'Cultural Dance Troupe',
            'Environmental Volunteers',
        ];

        $resources = [
            'Medical Personnel/ Professionals' => [
                'Barangay Health Worker',
                'Barangay Nutrition Scholar',
                'Doctor',
                'Nurse',
                'Midwife',
                'Dentist',
                'Medical Technologist',
                'Not mentioned above (Specify) Architecture',
            ],
            'Other Professionals' => [
                'Fireman/Firewoman',
                'Teacher',
                'Social Worker',
                'Not mentioned above (Specify)',
            ],
            'Laborers' => [
                'Carpenter',
                'Mason',
                'Electrician',
                'Engineer',
                'Technician',
                'Painter',
                'Plumber',
                'Crane Operator',
                'Truck Driver',
                'Not mentioned above (Specify)',
            ],
        ];
        $populationTemplates = [
            ['category' => 'With Disability', 'min' => 0, 'max' => 100, 'source' => 'BDRRMC'],
            ['category' => 'Pregnant Women', 'min' => 0, 'max' => 20, 'source' => 'BNS'],
            ['category' => 'Number of Families', 'min' => 10, 'max' => 2000, 'source' => 'BDRRMC'],
            ['category' => 'Number of Individuals', 'min' => 50, 'max' => 10000, 'source' => 'BDRRMC'],

            ['category' => '0-6 months', 'min' => 0, 'max' => 50, 'source' => 'BDRRMC'],
            ['category' => '7 mos. to 2 years old', 'min' => 0, 'max' => 100, 'source' => 'BDRRMC'],
            ['category' => '3 to 5 years old', 'min' => 0, 'max' => 150, 'source' => 'BDRRMC'],
            ['category' => '6 to 12 years old', 'min' => 0, 'max' => 300, 'source' => 'BDRRMC'],
            ['category' => '13 to 17 years old', 'min' => 0, 'max' => 200, 'source' => 'BDRRMC'],
            ['category' => '18 to 59 years old', 'min' => 10, 'max' => 5000, 'source' => 'BDRRMC'],
            ['category' => '60 years old & above', 'min' => 0, 'max' => 500, 'source' => 'BDRRMC'],

            ['category' => 'Physical Health', 'min' => 0, 'max' => 50, 'source' => 'BDRRMC'],
            ['category' => 'Mental Health', 'min' => 0, 'max' => 50, 'source' => 'BDRRMC'],
        ];


        $lifelines = [
            [
                'category'    => 'Transportation Facilities',
                'description' => 'General transportation disruption across barangay',
                'value'       => $faker->numberBetween(0, 3), // number of facilities
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Road - National',
                'description' => 'Number of impassable national roads',
                'value'       => $faker->numberBetween(0, 2),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Road - Provincial',
                'description' => 'Number of impassable provincial roads',
                'value'       => $faker->numberBetween(0, 3),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Road - City',
                'description' => 'Number of impassable city roads',
                'value'       => $faker->numberBetween(0, 3),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Road - Barangay',
                'description' => 'Number of impassable barangay roads',
                'value'       => $faker->numberBetween(0, 5),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Electric Supply',
                'description' => 'Number of households affected by power outage',
                'value'       => $faker->numberBetween(0, 2000),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Water Supply',
                'description' => 'Number of households with disrupted water service',
                'value'       => $faker->numberBetween(0, 1000),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Bridge - Bailey',
                'description' => 'Number of impassable Bailey bridges',
                'value'       => $faker->numberBetween(0, 2),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Bridge - Concrete',
                'description' => 'Number of impassable concrete bridges',
                'value'       => $faker->numberBetween(0, 2),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Bridge - Wooden',
                'description' => 'Number of impassable wooden bridges',
                'value'       => $faker->numberBetween(0, 2),
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Railway',
                'description' => 'Extent of railway damage',
                'value'       => $faker->numberBetween(0, 1),
                'source'      => 'BDRRMC',
            ],
        ];
        $effectTemplates = [
            ['effect_type' => 'Number of Casualties', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
            ['effect_type' => 'Deaths', 'min' => 0, 'max' => 6, 'source' => 'BHW; BNS'],
            ['effect_type' => 'Injured', 'min' => 0, 'max' => 0, 'source' => 'BHW; BNS'],
            ['effect_type' => 'Missing', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
        ];
        $agriTemplates = [
            ['description' => 'Livestock (quantity or value)', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
            ['description' => 'Farm animals (quantity)', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
            ['description' => 'Poultry and Fowl (quantity)', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
            ['description' => 'Agricultural/Farm Inputs', 'min' => 0, 'max' => 0, 'source' => 'BDRRMC'],
        ];
        $damageTemplates = [
            // AGRICULTURE
            [
                'category'    => 'Agriculture',
                'damage_type' => 'Property',
                'description' => 'Farming (extent of damage in land area or worth of damage)',
                'min'         => 0,
                'max'         => 120,
                'source'      => 'Barangay Committee on Agriculture',
            ],
            // FISHING
            [
                'category'    => 'Fishing',
                'damage_type' => 'Property',
                'description' => 'Fishpond (extent of damage in area or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Fishing',
                'damage_type' => 'Property',
                'description' => 'Fishing Equipment (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 50,
                'source'      => 'BDRRMC',
            ],

            // HOUSES
            [
                'category'    => 'Houses',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 200,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Houses',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 500,
                'source'      => 'LGU-City of Ilagan',
            ],

            // SCHOOLS
            [
                'category'    => 'Schools',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Schools',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 50,
                'source'      => 'BDRRMC',
            ],

            // HOSPITALS
            [
                'category'    => 'Hospitals',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Hospitals',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],

            // HEALTH CENTER
            [
                'category'    => 'Health Center',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Health Center',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],

            // GOVERNMENT OFFICES
            [
                'category'    => 'Government Offices',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Government Offices',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],

            // PUBLIC MARKETS
            [
                'category'    => 'Public Markets',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Public Markets',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],

            // FLOOD CONTROL
            [
                'category'    => 'Flood Control',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 10,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Flood Control',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],

            // COMMERCIAL FACILITIES
            [
                'category'    => 'Commercial Facilities',
                'damage_type' => 'Structure',
                'description' => 'Totally Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 20,
                'source'      => 'BDRRMC',
            ],
            [
                'category'    => 'Commercial Facilities',
                'damage_type' => 'Structure',
                'description' => 'Partially Damaged (quantity or worth of damage)',
                'min'         => 0,
                'max'         => 40,
                'source'      => 'BDRRMC',
            ],
        ];


        $typhoonNames = [
            'Yolanda', 'Ondoy', 'Sendong', 'Pepeng', 'Rolly',
            'Ulysses', 'Odette', 'Egay', 'Florita', 'Karding'
        ];

        $otherDisasters = [
            'Magnitude 6.5 Earthquake',
            'Monsoon Flooding',
            'Landslide in Mountain Area',
            'Severe Drought',
            'Storm Surge',
            'Volcanic Ashfall',
            'Barangay Market Fire',
            'Tsunami Alert'
        ];

        $hazards = [
            'Flood',
            'Pandemic/ emerging and re-emerging diseases',
            'Typhoon',
            'Rain-induced Landslide',
            'Fire',
            'Earthquake',
            'Drought',
            'Vehicular Incident',
        ];

        $basisSamples = [
            "Based on historical data of the barangay.",
            "Community survey and local reports.",
            "Geographic and environmental factors.",
            "Proximity to fault lines, rivers, or flood-prone areas.",
            "Past disaster records in municipal archives.",
            "Barangay officials’ assessment and monitoring reports.",
        ];

        $matrices = [
            'risk' => [
                'Pandemic/Emerging and Re-emerging Diseases',
                'Typhoon',
                'Flood',
                'Drought',
                'Rain-induced Landslide',
                'Earthquake',
                'Fire',
            ],
            'vulnerability' => [
                'Pandemic/Emerging and Re-emerging Diseases',
                'Typhoon',
                'Flood',
                'Drought',
                'Rain-induced Landslide',
                'Earthquake',
                'Fire',
            ],
        ];
        $disabilities = [
            'Deaf/ Hard of hearing',
            'Speech/ language impairment',
            'Visual Disability',
            'Mental Disability',
            'Intellectual Disability',
            'Learning Disability',
            'Physical Disability',
            'Psychosocial Disability',
            'Orthopedic Disability',
            'Others (Specify) Cancer',
        ];
        $indicators = [
            "Number of Informal Settler Families",
            "Number of Employed Individuals",
            "Number of Families Aware of the Effects of Risks and Hazards",
            "Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)",
            "Number of Families who received Financial Assistance",
            "Number of Families with Access to Early Warning System",
        ];
        $illnesses = [
            'Hypertension',
            'Acute Respiratory Infection (AURI)',
            'Diabetes Mellitus',
            'Scabies',
            'Infected Wound',
            'Influenza',
            'Urinary Tract Infection (UTI)',
            'Skin Allergy',
            'Boil',
            'Chicken Pox',
            'Diarrhea',
            'Dengue',
            'Stroke',
        ];
         $categories = [
            'Infrastructures' => ['Bridge/s','Barangay Hall','Multi-purpose Building','Houses','Purok','School/s','Child Development Center'],
            'Establishments' => ['Store','Eatery','Bakery'],
            'Facilities' => ['Water','Electricity','Telephone/Mobile service','Roads','Hospitals','Barangay Health Center'],
            'Livelihood' => ['Rice/Corn Field','Vegetables','Boats','Fish Nets','Fish Ponds'],
            'Nature' => ['Mountain/s','Mangroves'],
        ];
        $sampleCenters = [
            'San Antonio Elementary School',
            'Barangay Hall',
            'Barangay Health Center',
            'Multi-purpose Hall',
            'Isolation Facility',
            'Old Covered Court / Community Center',
            'Covered Court',
            'Church Hall',
            'Private School Hall'
        ];

        $planACenters = [
            'Community Center',
            'Multi-purpose Hall',
            'Covered Court',
            'Barangay Hall'
        ];

        $planBCenters = [
            'Elementary School',
            'Private School Hall',
            'Church Hall'
        ];

        $livelihoodEvac = [
            [
                'type' => 'Rice/Palay',
                'origin' => 'Purok 4,5 & 7',
                'evacuation_sites' => ['Purok 6']
            ],
            [
                'type' => 'Livestock',
                'origin' => 'Purok 4,5 & 7',
                'evacuation_sites' => ['Purok 6']
            ],
        ];

         $prepositions = [
            ['item_name' => 'Rice (5 kgs) Bags', 'base_quantity' => 7, 'remarks' => 'Still available'],
            ['item_name' => 'Canned Goods', 'base_quantity' => 50, 'remarks' => 'Expiry Date: (Aug.5,2027)'],
            ['item_name' => 'Noodles', 'base_quantity' => 0, 'remarks' => 'Expiry Date: 2025'],
            ['item_name' => 'Toiletries', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'First Aid Kit', 'base_quantity' => 1, 'remarks' => 'Available'],
            ['item_name' => 'Amlodipine Tab (Lodipen) 5 mg/100’s', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Ascorbic + Zinc Cap (Meedzinc) 533.4 mg/10mg', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Ascorbic Acid Syrup (Novacee) 100 mg/5ml/60 ml', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Atrovastatin Tab (Atorsaph-20) 20 mg', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Azithromycin Tab (Azcore) 500 mg', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'BandAid Bantam (Medicare)', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Cetirizine Drops (Allecur) 2.5 mg/10 ml', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Cetirizine Syrup (Cetirigen) 5 mg/5 ml/60 ml', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Cetirizine Tab (Ceticit) 10 mg/100’s', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Ferrous + Folic Tab (Fefosaph) 300mg/250/100’s', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Ferrous Sulfate Tab (Ferricore) 325 mg 100’s', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Metoprolol Tab (Loprexo-50) 50 mg', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Multivitamins Cap (Multilive) 100’s', 'base_quantity' => 1, 'remarks' => 'Consumable'],
            ['item_name' => 'Cool Fever Patch', 'base_quantity' => 2, 'remarks' => 'Consumable'],
            ['item_name' => 'Paracetamol Tab', 'base_quantity' => 1, 'remarks' => 'Consumable'],
        ];


        $reliefGoods = [
            ['name' => 'Noodles', 'unit' => 'Pcs.'],
            ['name' => 'Sardines', 'unit' => 'Cans'],
            ['name' => 'Rice', 'unit' => 'Kgs'],
            ['name' => 'Coffee', 'unit' => 'Packs'],
            ['name' => 'Hot Meals', 'unit' => 'Servings'],
        ];

        $evacuationCenters = ['Community Center', 'Multi-purpose Hall', 'Barangay Hall'];

                // Example distribution steps
        $distributionSteps = [
            "Monitoring and listing of affected families.",
            "Summarization of total affected families per Purok.",
            "Purok Kagawads prepares Acknowledgement receipt for every family head (affected only).",
            "Relief goods are stationed per Purok in Community Center.",
            "The beneficiaries line up and relief goods are distributed by Purok Kagawad and BDRRMC.",
        ];

        // Possible origins of goods
        $origins = ['BDRRMC Fund', 'Stockpile in Barangay Operation Center', 'NGO Donation', 'Private Donation', 'Local Government Unit (LGU)'];

        // Possible remarks
        $remarksOptions = [
            "Organized distribution process, Coordination and resource limitation.",
            "Minor delays due to traffic and logistics.",
            "Sufficient stock, smooth process.",
            "Shortage of some relief items, prioritized distribution.",
            "Volunteers actively assisted in the process."
        ];
        $trainings = [
            ['title' => 'Training on RA 10121 (Philippine Disaster Risk Reduction and Management Act)'],
            ['title' => 'Training on RA 10821 (Children’s Emergency Relief and Protection Act)'],
            ['title' => 'Training on Child Protection in Emergencies'],
            ['title' => 'Training on Pre- Disaster Risk Assessment'],
            ['title' => 'Training on the Protocol for Management of the Dead and Missing'],
            ['title' => 'Training on Camp Management'],
            ['title' => 'Training on Incident Command System'],
            ['title' => 'Training on Psychological First Aid'],
            ['title' => 'First Aid at Basic Life Support Training'],
            ['title' => 'Basic Search and Rescue Training'],
            ['title' => 'Training on Psychological First Aid'],
            ['title' => 'Training on Mental Health and Psychosocial Support'],
            ['title' => 'Community-Based Reduction and Management (CBDRRM) Training'],
            ['title' => 'Mental Health and Psychosocial Support (MHPSS) Training'],
            ['title' => 'Training on the Conduct of Simulation/Drills for Priority Hazards'],
            ['title' => 'Training on Rapid Damage Assessment and Needs Analysis (RDANA)'],
            ['title' => 'Training on Minimum Health Protocols'],
            ['title' => 'Training on Contact Tracing and Reporting'],
            ['title' => 'Training on Public Service Continuity'],
            ['title' => 'Training on Basic Disease Surveillance and Reporting'],
            ['title' => 'QAS for BDRRM and Committee training workshop'],
        ];

                $equipmentItems = [
            'Spine Board',
            'Axe',
            'Gasoline or Fuel',
            'First Aid or Emergency Kit',
            'Hand-held Radio',
            'Helmet or hard hat',
            'Batteries',
            'Portable Generator or alternative source of electricity',
            'Boots',
            'Rope',
            'Search Light',
            'Flash Light',
            'Megaphone',
            'Face Shield',
            'Alcohol',
            'Thermal scanner',
            'Chainsaw',
            'Cleaning materials',
            'Life Vest',
            'Reflectorized Life Vest',
            'Personal Protective Equipment (PPE)',
            'Shovel',
        ];

        $directories = [
            ['designation_team' => 'BDRRMC Chairman', 'name' => 'HON. NESTOR T. TAMULTO', 'contact_no' => '0920 985 7493'],
            ['designation_team' => 'BDRRM Focal Person', 'name' => 'HON. JOWELL C. MANDING', 'contact_no' => '0967 884 2281'],
            ['designation_team' => 'Operation/Admin/ Infra/Shelter', 'name' => 'HON. TIRSO T. TAMULTO', 'contact_no' => '0936 287 3445'],
            ['designation_team' => 'Prevention & Mitigation Sub-Committee', 'name' => 'HON. CLIFFORD DAN C. CAYAPAN', 'contact_no' => '0945 762 7228'],
            ['designation_team' => 'Preparedness Sub-Committee', 'name' => 'HON. IMELDA A. CASAUAY', 'contact_no' => '0967 761 7089'],
            ['designation_team' => 'Response Sub-Committee', 'name' => 'HON. TIRSO T. TAMULTO', 'contact_no' => '0936 287 3445'],
            ['designation_team' => 'Recovery & Rehabilitation Sub-Committee', 'name' => 'HON. JERRY R. BAYSAC', 'contact_no' => '0968 899 8480'],
            ['designation_team' => 'SRR', 'name' => 'POLICE CORPORAL HAROL Q. AGUSTIN', 'contact_no' => '0953 254 8493'],
            ['designation_team' => 'Security And Safety', 'name' => 'HON. JOWELL C. MANDING', 'contact_no' => '0967 884 2281'],
            ['designation_team' => 'Education', 'name' => 'HON. IMELDA A. CASAUAY', 'contact_no' => '0967 761 7089'],
            ['designation_team' => 'Damage Control/POANA Team/RDANA', 'name' => 'HON. BRENDALYN B. GABUYO', 'contact_no' => '0935 801 1636'],
            ['designation_team' => 'Health Or First Aid & Psycho-Social Support', 'name' => 'JANE O. PABLEO (BRGY. MIDWIFE)', 'contact_no' => '0935 616 2886'],
            ['designation_team' => 'Livelihood', 'name' => 'MARIA CONCEPCION A. TAMULTO (ILAW PRES.)', 'contact_no' => '0995 339 6450'],
            ['designation_team' => 'Evacuation/Camp Mngt.', 'name' => 'EL SHAIRA JOY M. MANUEL', 'contact_no' => '0953 055 9874'],
            ['designation_team' => 'Relief Distribution', 'name' => 'THELMA R. ACHOARA (CDW)', 'contact_no' => '0936 285 9486'],
            ['designation_team' => 'Protection', 'name' => 'JAERRY B. LITTAUA (CHIEF TANOD)', 'contact_no' => '0997 293 2929'],
            ['designation_team' => 'Research And Planning', 'name' => 'HON. BRENDALYN B. GABUYO', 'contact_no' => '0935 801 1636'],
            ['designation_team' => 'Communication & Warning', 'name' => 'HON. ANA MARIE M. ACHOARA', 'contact_no' => '0935 674 0398'],
            ['designation_team' => 'Transportation', 'name' => 'LEONARDO M. BAYSAC', 'contact_no' => '0906 962 7025'],
            ['designation_team' => 'Fire Management', 'name' => 'HON. JOWELL C. MANDING', 'contact_no' => '0967 884 2281'],
            ['designation_team' => 'Infrastructure and Shelter', 'name' => 'HON. TIRSO T. TAMULTO', 'contact_no' => '0936 287 3445'],
        ];
         $plans = [
            [
                'activity_no' => 1,
                'things_to_do' => 'Barangay Legislation on: Forced Evacuation',
                'responsible_person' => 'BDRRMC',
                'remarks' => 'City Ordinance and Executive Order. Province of Isabela Executive Order No. 2-A, Series of 2022.'
            ],
            [
                'activity_no' => 2,
                'things_to_do' => "Conduct of Drills\n- Earthquake Drill\n- Fire Drill",
                'responsible_person' => 'BDRRMC',
                'remarks' => 'Residents regularly participate in drills initiated by higher LGUs.'
            ],
            [
                'activity_no' => 3,
                'things_to_do' => "Early Warning:\n- Typhoon Tracking and Monitoring (TV, Radio, Higher LGUs, City Government, Other government agencies)\n- Flood Warning Signal\n- Warning and Directional Signage",
                'responsible_person' => 'HON. ANA MARIE M. ACHOARA, HON. IMELDA A. CASAUAY, HON. CLIFFORD DAN C. CAYAPAN',
                'remarks' => 'Advisories, updates and other information gathered shall be discussed by the Barangay DRRMC through emergency meeting to plan strategic measures on disaster preparedness. Flood warning signals and other signage are properly established and posted for safety measures.'
            ],
            [
                'activity_no' => 4,
                'things_to_do' => 'BDRRMC Meeting',
                'responsible_person' => 'BDRRMC',
                'remarks' => 'BDRRMC emergency meetings shall be called by the BDRRM Chairperson/Punong Barangay once advisories are received.'
            ],
            [
                'activity_no' => 5,
                'things_to_do' => 'Early Warning System',
                'responsible_person' => 'HON. JOWELL C. MANDING',
                'remarks' => 'Public announcement for EWS shall be headed by Chief Tanod Jaerry B. Littaua, Head of Operations and Warning throughout the barangay with assistance of tanod members. Kagawads, Officers, BHWs by Purok shall inform constituents at their respective puroks for faster facilitation of the EWS.'
            ],
            [
                'activity_no' => 6,
                'things_to_do' => 'Survival Kit',
                'responsible_person' => 'JANE O PABLEO (MIDWIFE) & BARANGAY SECRETARY',
                'remarks' => 'Families are regularly oriented on the preparation of Survival Kits during Barangay Assembly through coordination with the City Government and other government agencies.'
            ],
            [
                'activity_no' => 7,
                'things_to_do' => 'Sequence of Evacuation (Purok)',
                'responsible_person' => 'BDRRMC',
                'remarks' => 'Evacuation shall be enforced by Purok and administered by Purok Kagawads and Chief Tanod Jaerry B. Littaua with assistance from higher LGUs and tanod members.'
            ],
            [
                'activity_no' => 8,
                'things_to_do' => 'Sequence of Evacuation (People)',
                'responsible_person' => 'BDRRMC, BNS, BHWs, CDW',
                'remarks' => 'Vulnerable sectors such as Senior Citizens, Children, Pregnant Women and PWDs shall be prioritized during pre-emptive evacuation.'
            ],
            [
                'activity_no' => 9,
                'things_to_do' => 'Route Map',
                'responsible_person' => 'HON. TIRSO T. TAMULTO & HON. JOWELL C. MANDING',
                'remarks' => 'Evacuation Route Maps and Signage are posted while residents are oriented during assembly meetings and public announcements.'
            ],
            [
                'activity_no' => 10,
                'things_to_do' => 'Master List of Families',
                'responsible_person' => 'BARANGAY SECRETARY & BHWs',
                'remarks' => 'Master Lists of affected families, vulnerable sectors such as pregnant women, post-partum patients, senior citizens and PWDs, as well as families for monitoring and for immediate evacuation are readily available.'
            ],
            [
                'activity_no' => 11,
                'things_to_do' => "Evacuation Center Setup:\n- Incident Command Post\n- Information Desk\n- Camp Directory\n- Security/Peace and order\n- First Aid Station\n- Community Kitchen\n- Comfort room\n- Breastfeeding Area\n- Sleeping quarters (SC, PWD, Pregnant women and families, Couples Room)\n- Play area with books, colors and manipulative toys\n- Pray area\n- Evacuation area for animals",
                'responsible_person' => 'BDRRMC, PUROK LEADERS, SK OFFICIALS',
                'remarks' => 'Evacuation Center is already set up and manned by BDRRMC members and other stakeholders who were given their respective assignments at the evacuation center. Residents are informed of the set up and are assisted if needed.'
            ],
            [
                'activity_no' => 12,
                'things_to_do' => "Camp Management:\n- Manager\n- Assistant Manager",
                'responsible_person' => "HON. TIRSO T. TAMULTO\nHON. BRENDALYN B. GABUYO\nILAW AMA",
                'remarks' => "The Camp Manager is responsible for the management of the whole evacuation center. Any untoward incident should be coordinated to the Incident Command Post for proper coordination to the City's Operations Center."
            ],
        ];



        $barangays = Barangay::all();
        //$barangays = Barangay::take(1)->get();
        $cra = CommunityRiskAssessment::factory()->create([
            'year' => 2025
        ]);
        foreach ($barangays as $barangay) {
            // Example totals
            $totalPopulation = fake()->numberBetween(2000, 8000);
            $households = intval($totalPopulation / fake()->numberBetween(3, 5));
            $families = intval($households * fake()->numberBetween(1, 2));

            // Insert into general population
            CRAGeneralPopulation::updateOrCreate(
                [
                    'barangay_id' => $barangay->id,
                    'cra_id' => $cra->id, // ✅ link to the main CRA record
                ],
                [
                    'total_population' => $totalPopulation,
                    'total_households' => $households,
                    'total_families'   => $families,
                ]
            );
            // Split population by gender + LGBTQ+
            $male   = intval($totalPopulation * fake()->randomFloat(2, 0.45, 0.55)); // ~45–55%
            $female = intval($totalPopulation * 0.95) - $male; // balance
            $lgbtq  = $totalPopulation - ($male + $female);
            // Insert into gender table
            CRAPopulationGender::updateOrCreate(
                [
                    'barangay_id' => $barangay->id,
                    'cra_id'      => $cra->id,
                    'gender'      => 'Male',
                ],
                ['quantity' => $male]
            );

            CRAPopulationGender::updateOrCreate(
                [
                    'barangay_id' => $barangay->id,
                    'cra_id'      => $cra->id,
                    'gender'      => 'Female',
                ],
                ['quantity' => $female]
            );

            CRAPopulationGender::updateOrCreate(
                [
                    'barangay_id' => $barangay->id,
                    'cra_id'      => $cra->id,
                    'gender'      => 'LGBTQ+',
                ],
                ['quantity' => $lgbtq]
            );


            $general = $barangay->generalPopulation; // assumes relation set up
            if (! $general) {
                continue; // skip if no population record
            }

            $remaining = $general->total_population;

            foreach ($ageGroups as $age) {
                // Allocate people to this group (random but proportional)
                $groupPop = intval($remaining * fake()->randomFloat(2, 0.05, 0.25));
                $remaining -= $groupPop;

                // Split by gender identity (male/female/LGBTQ+)
                $male   = intval($groupPop * fake()->randomFloat(2, 0.45, 0.55));
                $female = intval($groupPop * 0.95) - $male;
                $lgbtq  = $groupPop - ($male + $female);

                // Disabilities (1–5% chance per person)
                $maleDis = intval($male * fake()->randomFloat(2, 0.01, 0.05));
                $femaleDis = intval($female * fake()->randomFloat(2, 0.01, 0.05));
                $lgbtqDis = intval($lgbtq * fake()->randomFloat(2, 0.01, 0.05));

                CRAPopulationAgeGroup::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'age_group'   => $age,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'male_without_disability'   => $male - $maleDis,
                        'male_with_disability'      => $maleDis,
                        'female_without_disability' => $female - $femaleDis,
                        'female_with_disability'    => $femaleDis,
                        'lgbtq_without_disability'  => $lgbtq - $lgbtqDis,
                        'lgbtq_with_disability'     => $lgbtqDis,
                    ]
                );
            }

            //  House Builds
            foreach ($houseTypes as $type) {
                $oneFloor = fake()->numberBetween(0, 900);
                $twoOrMore = fake()->numberBetween(0, 150);

                // 80% chance salvaged/makeshift is low
                if ($type === 'Salvaged/Makeshift House') {
                    $oneFloor = fake()->numberBetween(0, 20);
                    $twoOrMore = fake()->numberBetween(0, 3);
                }

                CRAHouseBuild::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'house_type'  => $type,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'one_floor'       => $oneFloor,
                        'two_or_more_floors' => $twoOrMore,
                    ]
                );
            }

            //  House Ownership
            foreach ($ownershipTypes as $ownership) {
                $quantity = match ($ownership) {
                    'Owned (Land and House)' => fake()->numberBetween(300, 800),
                    'Rented' => fake()->numberBetween(10, 100),
                    'Shared with Owner' => fake()->numberBetween(5, 50),
                    'Shared with Renter' => fake()->numberBetween(1, 30),
                    'Owned (House)' => fake()->numberBetween(200, 700),
                    'Informal Settler Families' => fake()->numberBetween(0, 100),
                    default => 0,
                };

                CRAHouseOwnership::updateOrCreate(
                    [
                        'barangay_id'    => $barangay->id,
                        'ownership_type' => $ownership,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'quantity' => $quantity ?? 0,
                    ]
                );
            }

            foreach ($livelihoods as $type => [$min, $max]) {
                $base = rand($min, $max);

                // distribute among groups
                $maleWithout = rand((int)($base * 0.4), (int)($base * 0.7));
                $femaleWithout = rand((int)($base * 0.2), (int)($base * 0.5));
                $lgbtqWithout = max(0, $base - ($maleWithout + $femaleWithout));

                // small disability % (up to 5%)
                $maleWith = rand(0, (int)($maleWithout * 0.05));
                $femaleWith = rand(0, (int)($femaleWithout * 0.05));
                $lgbtqWith = rand(0, (int)($lgbtqWithout * 0.05));

                CRALivelihoodStatistic::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'livelihood_type' => $type,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'male_without_disability' => $maleWithout,
                        'male_with_disability' => $maleWith,
                        'female_without_disability' => $femaleWithout,
                        'female_with_disability' => $femaleWith,
                        'lgbtq_without_disability' => $lgbtqWithout,
                        'lgbtq_with_disability' => $lgbtqWith,
                    ]
                );
            }

            foreach ($services as $category => $items) {
                foreach ($items as $name => $qty) {
                    CRAHouseholdService::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'category' => $category,
                            'service_name' => $name,
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'households_quantity' => $qty,
                        ]
                    );
                }
            }

            foreach ($infraData as $category => $items) {
                foreach ($items as $name => [$min, $max]) {
                    CRAInfraFacility::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'category' => $category,
                            'infrastructure_name' => $name,
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'quantity' => rand($min, $max),
                        ]
                    );
                }
            }

            foreach ($primaryFacilities as $facility => [$min, $max]) {
                CRAPrimaryFacility::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'facility_name' => $facility,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'quantity' => rand($min, $max),
                    ]
                );
            }

            foreach ($transportTypes as $type => [$min, $max]) {
                CRAPublicTransportation::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'transpo_type' => $type,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'quantity' => rand($min, $max),
                    ]
                );
            }

            foreach ($roadTypes as $type => [$maintainer, $min, $max]) {
                // Random road length (some barangays may not have certain types)
                $length = rand($min * 10, $max * 10) / 10; // e.g., 0.0 to 15.0 km
                CRARoadNetwork::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'road_type' => $type,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'length_km' => $length,
                        'maintained_by' => $length > 0 ? $maintainer : 'NONE',
                    ]
                );
            }

            foreach ($baseInstitutions as $name) {
                CRAInstitution::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'name' => $name,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'male_members' => rand(0, 200),
                        'female_members' => rand(0, 200),
                        'lgbtq_members' => rand(0, 50),
                        'head_name' => $faker->name,
                        'contact_no' => $faker->phoneNumber,
                        'registered' => $faker->randomElement(['YES', 'NO']),
                        'programs_services' => $faker->randomElement([
                            'Tree Planting', 'Soap Making', 'Livelihood Program',
                            'Vegetable Planting', 'Sports Clinic', 'Feeding Program',
                            'Clean-up Drive', 'Scholarship Assistance', 'Job Placement',
                        ]),
                    ]
                );
            }

            foreach ($resources as $category => $items) {
                foreach ($items as $resource) {
                    // Generate random values, skewed to be more realistic
                    $maleWithout = $faker->numberBetween(0, 50);
                    $maleWith = $faker->boolean(5) ? $faker->numberBetween(1, 5) : 0; // small chance
                    $femaleWithout = $faker->numberBetween(0, 50);
                    $femaleWith = $faker->boolean(5) ? $faker->numberBetween(1, 5) : 0;
                    $lgbtqWithout = $faker->numberBetween(0, 10);
                    $lgbtqWith = $faker->boolean(3) ? $faker->numberBetween(1, 3) : 0;
                    CRAHumanResource::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'category' => $category,
                            'resource_name' => $resource,
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'male_without_disability' => $maleWithout,
                            'male_with_disability' => $maleWith,
                            'female_without_disability' => $femaleWithout,
                            'female_with_disability' => $femaleWith,
                            'lgbtq_without_disability' => $lgbtqWithout,
                            'lgbtq_with_disability' => $lgbtqWith,
                        ]
                    );
                }
            }


            $disasterCount = rand(1, 3);

            for ($i = 0; $i < $disasterCount; $i++) {
                // 60% chance Typhoon, 40% other disaster
                $isTyphoon = $faker->boolean(60);

                $disasterName = $isTyphoon
                    ? 'Typhoon ' . $faker->randomElement($typhoonNames)
                    : $faker->randomElement($otherDisasters);

                CRADisasterOccurance::firstOrCreate([
                    'barangay_id'   => $barangay->id,
                    'disaster_name' => $disasterName,
                    'cra_id'      => $cra->id,
                    'year'          => $faker->numberBetween(date('Y') - 5, date('Y')),
                ]);
            }

            $disasters = CRADisasterOccurance::all();

            foreach ($disasters as $disaster) {
                // Lifelines
                foreach ($populationTemplates as $template) {
                    CRADisasterPopulationImpact::create([
                        'disaster_id' => $disaster->id,
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'category'    => $template['category'],
                        'value'       => rand($template['min'], $template['max']),
                        'source'      => $template['source'],
                    ]);
                }
                foreach ($effectTemplates as $template) {
                    CRADisasterEffectImpact::create([
                        'disaster_id' => $disaster->id,
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'effect_type' => $template['effect_type'],
                        'value'       => rand($template['min'], $template['max']),
                        'source'      => $template['source'],
                    ]);
                }
                foreach ($agriTemplates as $template) {
                    CRADisasterAgriDamage::create([
                        'disaster_id' => $disaster->id,
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'description' => $template['description'],
                        'value'       => rand($template['min'], $template['max']),
                        'source'      => $template['source'],
                    ]);
                }

                foreach ($lifelines as $lifeline) {
                    CRADisasterLifeline::create([
                        'disaster_id' => $disaster->id,
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'category'    => $lifeline['category'],
                        'description' => $lifeline['description'],
                        'value'       => $lifeline['value'],
                        'source'      => $lifeline['source'],
                    ]);
                }
                foreach ($damageTemplates as $template) {
                    CRADisasterDamage::create([
                        'disaster_id' => $disaster->id,
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'category'    => $template['category'],
                        'damage_type' => $template['damage_type'], // added this line
                        'description' => $template['description'],
                        'value'       => rand($template['min'], $template['max']),
                        'source'      => $template['source'],
                    ]);
                }
            }
        }

        foreach ($barangays as $barangay) {

            foreach ($hazards as $hazardName) {
                $hazard = CRAHazard::firstOrCreate(['hazard_name' => $hazardName]);

                $prob = rand(1, 5);
                $effect = rand(1, 5);
                $management = rand(1, 5);

                CRAHazardRisk::create([
                    'barangay_id'    => $barangay->id,
                    'cra_id'      => $cra->id,
                    'hazard_id'      => $hazard->id,
                    'probability_no' => $prob,
                    'effect_no'      => $effect,
                    'management_no'  => $management,
                    'basis'          => $basisSamples[array_rand($basisSamples)],
                    'average_score'  => round(($prob + $effect + $management) / 3, 2),
                ]);
            }
        }

        foreach ($matrices as $matrixType => $hazardNames) {
            foreach ($hazardNames as $hazardName) {
                $hazard = CRAHazard::firstOrCreate(
                    ['hazard_name' => $hazardName]
                );
                foreach ($barangays as $barangay) {

                    CRAAssessmentMatrix::create([
                        'hazard_id' => $hazard->id,
                        'cra_id'      => $cra->id,
                        'barangay_id' => $barangay->id,
                        'matrix_type' => $matrixType,

                        // random values
                        'people' => rand(0, 6000),
                        'properties' => fake()->randomElement([
                            'None',
                            'Houses',
                            'Houses, Buildings, Government Facilities',
                            'Crops and Animals',
                            'Commercial Buildings, Houses and other properties',
                        ]),
                        'services' => fake()->randomElement([
                            'None',
                            'Electricity',
                            'Water',
                            'Electricity and Water',
                            'Electricity, Water, Communication',
                        ]),
                        'environment' => fake()->randomElement([
                            'None',
                            'Trees, Garbage, Debris are scattered',
                            'Farmlands and farm produce',
                        ]),
                        'livelihood' => fake()->randomElement([
                            'None',
                            'Minimum to None',
                            'Businesses and employment are affected',
                            'Some Businesses are affected',
                        ]),
                    ]);
                     foreach (range(1, 7) as $purok) {
                        CRAPopulationExposure::firstOrCreate(
                            [
                                'hazard_id'    => $hazard->id,
                                'barangay_id'  => $barangay->id,
                                'purok_number' => $purok,
                                'cra_id'      => $cra->id,
                            ],
                            [
                                'total_families'      => rand(100, 400),
                                'total_individuals'   => rand(200, 700),
                                'individuals_male'    => rand(100, 500),
                                'individuals_female'  => rand(50, 400),
                                'individuals_lgbtq'   => rand(0, 20),
                                'age_0_6_male'        => rand(0, 50),
                                'age_0_6_female'      => rand(0, 50),
                                'age_7m_2y_male'      => rand(0, 40),
                                'age_7m_2y_female'    => rand(0, 40),
                                'age_3_5_male'        => rand(0, 60),
                                'age_3_5_female'      => rand(0, 60),
                                'age_6_12_male'       => rand(0, 100),
                                'age_6_12_female'     => rand(0, 100),
                                'age_13_17_male'      => rand(0, 120),
                                'age_13_17_female'    => rand(0, 120),
                                'age_18_59_male'      => rand(100, 400),
                                'age_18_59_female'    => rand(100, 400),
                                'age_60_up_male'      => rand(10, 80),
                                'age_60_up_female'    => rand(10, 80),
                                'pwd_male'            => rand(0, 20),
                                'pwd_female'          => rand(0, 20),
                                'diseases_male'       => rand(0, 30),
                                'diseases_female'     => rand(0, 30),
                                'pregnant_women'      => rand(0, 15),
                            ]
                        );
                    }
                }
            }
        }

        foreach ($barangays as $barangay) {

            foreach ($disabilities as $type) {
                CRADisabilityStatistic::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'disability_type' => $type,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'age_0_6_male'       => rand(0, 3),
                        'age_0_6_female'     => rand(0, 3),
                        'age_7m_2y_male'     => rand(0, 3),
                        'age_7m_2y_female'   => rand(0, 3),
                        'age_3_5_male'       => rand(0, 5),
                        'age_3_5_female'     => rand(0, 5),
                        'age_6_12_male'      => rand(0, 15),
                        'age_6_12_female'    => rand(0, 15),
                        'age_6_12_lgbtq'     => rand(0, 3),
                        'age_13_17_male'     => rand(0, 20),
                        'age_13_17_female'   => rand(0, 20),
                        'age_13_17_lgbtq'    => rand(0, 5),
                        'age_18_59_male'     => rand(0, 30),
                        'age_18_59_female'   => rand(0, 30),
                        'age_18_59_lgbtq'    => rand(0, 10),
                        'age_60up_male'      => rand(0, 15),
                        'age_60up_female'    => rand(0, 15),
                        'age_60up_lgbtq'     => rand(0, 3),
                    ]
                );
            }

            for ($purok = 1; $purok <= 7; $purok++) {
                foreach ($indicators as $indicator) {
                    CRAFamilyAtRisk::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'purok_number' => $purok,
                            'indicator' => $indicator,
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'count' => match ($indicator) {
                                "Number of Informal Settler Families" => rand(0, 20),
                                "Number of Employed Individuals" => rand(100, 400),
                                "Number of Families Aware of the Effects of Risks and Hazards" => rand(80, 400),
                                "Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)" => rand(80, 400),
                                "Number of Families who received Financial Assistance" => rand(0, 50),
                                "Number of Families with Access to Early Warning System" => rand(80, 400),
                                default => rand(0, 500),
                            },
                        ]
                    );
                }
            }

            foreach ($illnesses as $illness) {
                CRAIllnessesStat::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'illness' => $illness,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        // Randomized values
                        'children' => rand(0, 30),   // children (0–17)
                        'adults'   => rand(0, 50),   // adults (18+)
                    ]
                );
            }

        }

        foreach ($hazards as $name) {
            $hazard = CRAHazard::firstOrCreate(['hazard_name' => $name]);
            foreach ($barangays as $barangay) {

                foreach (range(1, 7) as $purok) {
                    // Total population per purok
                    $totalFamilies = rand(100, 350);
                    $totalIndividuals = $totalFamilies * rand(3, 5);

                    // Random risk counts
                    $lowFamilies = rand(0, $totalFamilies);
                    $lowIndividuals = rand(0, $totalIndividuals);

                    $remainingFamilies = $totalFamilies - $lowFamilies;
                    $remainingIndividuals = $totalIndividuals - $lowIndividuals;

                    $mediumFamilies = rand(0, $remainingFamilies);
                    $mediumIndividuals = rand(0, $remainingIndividuals);

                    $highFamilies = $remainingFamilies - $mediumFamilies;
                    $highIndividuals = $remainingIndividuals - $mediumIndividuals;

                    CRADisasterRiskPopulation::create([
                        'barangay_id' => $barangay->id,
                        'cra_id'      => $cra->id,
                        'hazard_id' => $hazard->id,
                        'purok_number' => $purok,
                        'low_families' => $lowFamilies,
                        'low_individuals' => $lowIndividuals,
                        'medium_families' => $mediumFamilies,
                        'medium_individuals' => $mediumIndividuals,
                        'high_families' => $highFamilies,
                        'high_individuals' => $highIndividuals,
                    ]);
                }
            }
        }

        foreach ($barangays as $barangay) {

            $hazards = CRAHazard::all();
            foreach ($hazards as $hazard) {
                foreach ($categories as $category => $items) {
                    foreach ($items as $item) {

                        // Fully random total in barangay (1–2000 for realism)
                        $total = rand(0, 2000);

                        // Fully random % at risk (0–15%)
                        $percent = rand(0, 15) . '%';

                        // Random location (1–7 puroks, can have multiple)
                        $locationCount = rand(1, 3);
                        $locations = [];
                        for ($i = 0; $i < $locationCount; $i++) {
                            $locations[] = rand(1,7);
                        }

                        CRADisasterRiskPopulation::updateOrCreate(
                            [
                                'barangay_id' => $barangay->id,
                                'hazard_id' => $hazard->id,
                                'purok_number' => $purok,
                                'cra_id'      => $cra->id,
                            ],
                            [
                                'low_families' => $lowFamilies,
                                'low_individuals' => $lowIndividuals,
                                'medium_families' => $mediumFamilies,
                                'medium_individuals' => $mediumIndividuals,
                                'high_families' => $highFamilies,
                                'high_individuals' => $highIndividuals,
                            ]
                        );
                    }
                }
            }
        }

        foreach ($barangays as $barangay) {

            // Each barangay gets 3–6 centers
            $centers = $faker->randomElements($sampleCenters, rand(3, 6));
            foreach ($centers as $center) {
                CRAEvacuationCenter::firstOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'name' => $center,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'capacity_families' => rand(2, 60),
                        'capacity_individuals' => rand(10, 200),
                        'owner_type' => $faker->randomElement(['government', 'private']),
                        'inspected_by_engineer' => $faker->boolean(70),
                        'has_mou' => $faker->boolean(50),
                    ]
                );
            }
        }

        foreach ($barangays as $barangay) {

            foreach (range(1, 7) as $purok) {
                $totalFamilies = rand(100, 350);
                $totalIndividuals = $totalFamilies * rand(3, 5);

                // Random at-risk population
                $familiesAtRisk = rand(0, intval($totalFamilies * 0.2));
                $individualsAtRisk = rand(0, intval($totalIndividuals * 0.2));

                // Plan A selection
                $planA = $faker->randomElement($planACenters);
                $planACapacityFamilies = rand(20, 60);
                $planACapacityIndividuals = $planACapacityFamilies * rand(2, 3);

                $planAUnaccommodatedFamilies = max(0, $familiesAtRisk - $planACapacityFamilies);
                $planAUnaccommodatedIndividuals = max(0, $individualsAtRisk - $planACapacityIndividuals);

                // Plan B selection if needed
                $planB = $faker->randomElement($planBCenters);
                $planBUnaccommodatedFamilies = max(0, $planAUnaccommodatedFamilies - rand(0, $planACapacityFamilies));
                $planBUnaccommodatedIndividuals = max(0, $planAUnaccommodatedIndividuals - rand(0, $planACapacityIndividuals));

                // Remarks
                $remarks = ($familiesAtRisk > 0 || $individualsAtRisk > 0)
                    ? 'Plan A to Plan B Evacuation centers can accommodate the number of evacuees at risk.'
                    : 'Do not need evacuation';

                CRAEvacuationInventory::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'purok_number' => $purok,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'total_families' => $totalFamilies,
                        'total_individuals' => $totalIndividuals,
                        'families_at_risk' => $familiesAtRisk,
                        'individuals_at_risk' => $individualsAtRisk,
                        'plan_a_center' => $planA,
                        'plan_a_capacity_families' => $planACapacityFamilies,
                        'plan_a_capacity_individuals' => $planACapacityIndividuals,
                        'plan_a_unaccommodated_families' => $planAUnaccommodatedFamilies,
                        'plan_a_unaccommodated_individuals' => $planAUnaccommodatedIndividuals,
                        'plan_b_center' => $planB,
                        'plan_b_unaccommodated_families' => $planBUnaccommodatedFamilies,
                        'plan_b_unaccommodated_individuals' => $planBUnaccommodatedIndividuals,
                        'remarks' => $remarks,
                    ]
                );
            }
        }

        foreach ($hazards as $hazardName) {
            $hazard = CRAHazard::firstOrCreate(['hazard_name' => $hazardName]);

            foreach ($barangays as $barangay) {

                foreach (range(1, 7) as $purok) {
                    $totalFamilies = rand(100, 350);
                    $totalIndividuals = $totalFamilies * rand(3, 5);

                    // Random at-risk population (can be 0)
                    $atRiskFamilies = rand(0, intval($totalFamilies * 0.1));
                    $atRiskIndividuals = rand(0, intval($totalIndividuals * 0.1));

                    $riskLevels = ['Low', 'Medium', 'High'];

                    // Randomly pick a risk level with weights based on hazard type
                    if ($hazardName === 'Typhoon') {
                        // Typhoon: mostly Low, some Medium, rarely High
                        $riskLevel = $faker->randomElement(array_merge(
                            array_fill(0, 70, 'Low'),    // 70% chance
                            array_fill(0, 25, 'Medium'), // 25% chance
                            array_fill(0, 5, 'High')     // 5% chance
                        ));
                        $safeAreas = ['Community Center', 'Multi-purpose Hall', 'San Antonio Elementary School'];
                    } else { // Pandemic / Emerging Disease
                        // Pandemic: mostly Medium, some Low, rarely High
                        $riskLevel = $faker->randomElement(array_merge(
                            array_fill(0, 60, 'Medium'), // 60% chance
                            array_fill(0, 30, 'Low'),    // 30% chance
                            array_fill(0, 10, 'High')    // 10% chance
                        ));
                        $safeAreas = ['Barangay Centro San Antonio Isolation Unit', 'Health Center', 'Community Center'];
                    }

                    // Pick a random safe area from the list
                    $safeArea = $faker->randomElement($safeAreas);

                    CRAAffectedPlaces::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'hazard_id' => $hazard->id,
                            'purok_number' => $purok,
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'risk_level' => $riskLevel,
                            'total_families' => $totalFamilies,
                            'total_individuals' => $totalIndividuals,
                            'at_risk_families' => $atRiskFamilies,
                            'at_risk_individuals' => $atRiskIndividuals,
                            'safe_evacuation_area' => $safeArea,
                        ]
                    );
                }
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($livelihoodEvac as $livelihood) {
                CRALivelihoodEvacuationSite::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'livelihood_type' => $livelihood['type'],
                        'evacuation_site' => $livelihood['evacuation_sites'][0],
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'place_of_origin' => $livelihood['origin'],
                        'capacity_description' => match($livelihood['type']) {
                            'Rice/Palay' => rand(450, 550) . ' more or less',
                            'Livestock' => rand(80, 120) . ' more or less',
                            default => 'Unknown capacity'
                        },
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($prepositions as $item) {
                // Randomize quantity around base quantity
                $quantity = $item['base_quantity'];

                if (is_numeric($quantity) && $quantity > 0) {
                    // +/- 30% random variation
                    $quantity = rand(intval($quantity * 0.7), intval($quantity * 1.3));
                }

                // Randomize remarks for consumable/availability
                $remarks = $item['remarks'];
                if (strpos($remarks, 'Consumable') !== false || strpos($remarks, 'Available') !== false) {
                    $remarks .= rand(0, 1) ? ' - still usable' : ' - needs checking';
                }

                CRAPrepositionedInventory::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'item_name' => $item['item_name'],
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'quantity' => (string)$quantity,
                        'remarks' => $remarks,
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach (range(1, 7) as $purok) { // all Puroks
                $numFamilies = rand(5, 30); // random number of families
                $numIndividuals = $numFamilies * rand(3, 5); // random individuals per family

                // Randomly pick 2-5 relief goods for this Purok
                $goodsForPurok = collect($reliefGoods)->shuffle()->take(rand(2, 5));

                foreach ($goodsForPurok as $good) {
                    // Random quantity depending on unit type
                    switch ($good['unit']) {
                        case 'Pcs.':
                        case 'Cans':
                            $quantity = rand(1, 10);
                            break;
                        case 'Kgs':
                        case 'Packs':
                            $quantity = rand(2, 15);
                            break;
                        case 'Servings':
                            $quantity = rand(5, 50);
                            break;
                        default:
                            $quantity = rand(1, 10);
                    }
                    CRAReliefDistribution::updateOrCreate(
                        [
                            'barangay_id' => $barangay->id,
                            'evacuation_center' => $evacuationCenters[array_rand($evacuationCenters)],
                            'relief_good' => $good['name'],
                            'cra_id'      => $cra->id,
                        ],
                        [
                            'quantity' => (string)$quantity,
                            'unit' => $good['unit'],
                            'beneficiaries' => $numFamilies . ' Families (' . $numIndividuals . ' Individuals)',
                            'address' => 'Purok ' . $purok,
                        ]
                    );
                }
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($distributionSteps as $index => $step) {
                CRAReliefDistributionProcess::updateOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'step_no' => $index + 1,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'distribution_process' => $step,
                        'origin_of_goods' => $origins[array_rand($origins)],
                        'remarks' => $remarksOptions[array_rand($remarksOptions)],
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($trainings as $training) {
                CRABdrrmcTraining::firstOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'title' => $training['title'],
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'status' => rand(0,1) ? 'checked' : 'cross',
                        'duration' => rand(1,5) . ' days',
                        'agency' => 'Agency ' . rand(1,5),
                        'inclusive_dates' => now()->subDays(rand(0, 365))->format('F d-Y'),
                        'number_of_participants' => rand(5, 20),
                        'participants' => 'Participant ' . rand(1, 20),
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($equipmentItems as $item) {
                $availability = rand(0, 1) ? 'checked' : 'cross';

                // Random quantity: if not available, set to 0
                $quantity = ($availability === 'checked') ? rand(1, 50) : 0;

                // Random remarks
                $remarks = ($availability === 'checked') ? (rand(0, 1) ? 'serviceable' : 'needs repair') : null;

                // Random location (mostly Barangay Operation Center)
                $location = ($availability === 'checked') ? 'Barangay Operation Center' : null;

                CRAEquipmentInventory::firstOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'item' => $item,
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'availability' => $availability,
                        'quantity' => $quantity,
                        'location' => $location,
                        'remarks' => $remarks,
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($directories as $entry) {
                CRABdrrmcDirectory::firstOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'name' => $entry['name'],
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'designation_team' => $entry['designation_team'],
                        'contact_no' => $entry['contact_no'],
                    ]
                );
            }
        }
        foreach ($barangays as $barangay) {

            foreach ($plans as $plan) {
                CRAEvacuationPlan::firstOrCreate(
                    [
                        'barangay_id' => $barangay->id,
                        'activity_no' => $plan['activity_no'],
                        'cra_id'      => $cra->id,
                    ],
                    [
                        'things_to_do' => $plan['things_to_do'],
                        'responsible_person' => $plan['responsible_person'],
                        'remarks' => $plan['remarks'],
                    ]
                );
            }
        }
    }
}

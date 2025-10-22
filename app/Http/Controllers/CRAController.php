<?php

namespace App\Http\Controllers;

use App\Http\Requests\CRAStoreRequest;
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
use App\Models\CRAProgress;
use App\Models\CRAPublicTransportation;
use App\Models\CRAReliefDistribution;
use App\Models\CRAReliefDistributionProcess;
use App\Models\CRARoadNetwork;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CRAController extends Controller
{
    public function index()
    {
        dd('yes');
    }
    public function create(Request $request)
    {
        try {
            $user = auth()->user();
            $barangay_id = $user->barangay_id ?? null;

            if (!$barangay_id) {
                return Inertia::render("BarangayOfficer/CRA/Create", [
                    'progress' => null,
                    'error' => 'Barangay not found for this user.'
                ]);
            }

            // 🔹 Get the year from the query string (?year=2025)
            $year = $request->query('year');

            // 🔹 Find CRA record by year (if provided), otherwise latest
            $craQuery = CommunityRiskAssessment::query();
            $cra = $year
                ? $craQuery->where('year', $year)->first()
                : $craQuery->latest('year')->first();

            if (!$cra) {
                return Inertia::render("BarangayOfficer/CRA/Create", [
                    'progress' => [
                        'barangay_id' => $barangay_id,
                        'cra_id' => null,
                        'percentage' => 0,
                        'status' => 'Not started',
                        'submitted_at' => null,
                        'last_updated' => null,
                    ],
                    'error' => $year
                        ? "No CRA record found for the year {$year}."
                        : "No Community Risk Assessments available yet.",
                ]);
            }

            // 🔹 Fetch CRA progress
            $progress = CRAProgress::where('barangay_id', $barangay_id)
                ->where('cra_id', $cra->id)
                ->latest()
                ->first();

            $progressData = $progress
                ? [
                    'barangay_id' => $progress->barangay_id,
                    'cra_id' => $progress->cra_id,
                    'percentage' => (float) $progress->percentage,
                    'status' => $progress->percentage >= 100 ? 'Completed' : 'In Progress',
                    'submitted_at' => $progress->submitted_at
                        ? Carbon::parse($progress->submitted_at)->toDateTimeString()
                        : null,
                    'last_updated' => $progress->updated_at
                        ? Carbon::parse($progress->updated_at)->toDateTimeString()
                        : null,
                ]
                : [
                    'barangay_id' => $barangay_id,
                    'cra_id' => $cra->id,
                    'percentage' => 0,
                    'status' => 'Not started',
                    'submitted_at' => null,
                    'last_updated' => null,
                ];

            return Inertia::render("BarangayOfficer/CRA/Create", [
                'progress' => $progressData,
                'year' => $cra->year,
            ]);
        } catch (\Exception $e) {
            return Inertia::render("BarangayOfficer/CRA/Create", [
                'progress' => null,
                'error' => 'Error fetching CRA progress: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Compute a detailed CRA completion percentage.
     *
     * @param array $data  The request payload (all CRA sections)
     * @param array|null $weights Optional associative array of weights per section (sum not required)
     * @return array  ['percentage' => float, 'details' => [...], 'filled_weight' => float, 'total_weight' => float]
     */
    private function computeProgress(array $data, ?array $weights = null): array
    {
        // --- Define section checkers: each returns float between 0 and 1 ---
        // Add or modify checkers to match the exact structure of your incoming data
        $checkers = [

            'barangayPopulation' => function ($d) {
                if (empty($d)) return ['score' => 0.0, 'info' => 'empty'];
                $nonEmptyCount = count(array_filter($d, fn($v) => !empty($v)));
                $totalKeys = count($d);
                $score = $totalKeys > 0 ? $nonEmptyCount / $totalKeys : 0;
                return ['score' => $score, 'info' => "$nonEmptyCount of $totalKeys fields"];
            },

            // populationGender: expect array with sexes or totals
            'populationGender' => function ($d) {
                // if it's an array of groups, consider proportion of groups with counts
                if (empty($d) || !is_array($d)) {
                    return ['score' => 0.0, 'info' => 'empty'];
                }
                // if structure is like ['male' => x, 'female' => y, 'lgbtq' => z] or array of rows
                if (isset($d['male']) || isset($d['female']) || isset($d['lgbtq'])) {
                    $expected = ['male', 'female', 'lgbtq'];
                    $found = 0;
                    foreach ($expected as $k) {
                        if (!empty($d[$k])) $found++;
                    }
                    return ['score' => $found / count($expected), 'info' => "$found of " . count($expected) . " genders"];
                }
                // else if array of rows, count how many rows have totals
                $rows = collect($d);
                if ($rows->isEmpty()) return ['score' => 0.0, 'info' => 'no rows'];
                $valid = $rows->filter(fn($r) => !empty($r['total'] ?? $r['count'] ?? null))->count();
                return ['score' => $valid / $rows->count(), 'info' => "$valid of {$rows->count()} rows"];
            },

            // population age groups (array of age groups) — proportion of groups filled
            'population' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['count'] ?? null))->count();
                return ['score' => $valid / $rows->count(), 'info' => "$valid of {$rows->count()} groups"];
            },

            // simple presence checks for list-type sections (fully complete if array non-empty)
            'livelihood' => function ($d) {
                if (empty($d)) return ['score' => 0.0, 'info' => 'empty'];
                $count = count($d);
                $score = min($count / 5, 1.0); // up to 5 entries = full score
                return ['score' => $score, 'info' => "$count livelihoods"];
            },
            'infrastructure' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'houses' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'ownership' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'buildings' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'facilities' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'institutions' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],

            // human_resources is usually an array of rows — compute proportion of resources that have totals
            'human_resources' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['resource_name'] ?? null))->count();
                return ['score' => $valid / $rows->count(), 'info' => "$valid of {$rows->count()} resources"];
            },

            // calamities / disaster history — proportion of entries that have at least date OR impact details
            'calamities' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['date'] ?? null) || !empty($r['impact'] ?? null))->count();
                return ['score' => $valid / $rows->count(), 'info' => "$valid of {$rows->count()} records"];
            },

            // hazards: count how many hazards exist and if risk numbers exist for each
            'hazards' => function ($d) {
                if (empty($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) =>
                    !empty($r['probability'] ?? null) ||
                    !empty($r['effect'] ?? null) ||
                    !empty($r['management'] ?? null)
                )->count();
                return ['score' => $rows->isEmpty() ? 0.0 : $valid / $rows->count(), 'info' => "$valid of {$rows->count()} hazards"];
            },

            'exposure' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'pwd' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],

            // disaster_per_purok: expect array of disasters with rows per purok
            'disaster_per_purok' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $disasters = collect($d);
                $scores = $disasters->map(function ($dis) {
                    $rows = collect($dis['rows'] ?? []);
                    if ($rows->isEmpty()) return 0.0;
                    $valid = $rows->filter(fn($r) => !empty($r['lowFamilies'] ?? null || $r['lowIndividuals'] ?? null || $r['highFamilies'] ?? null))->count();
                    return $valid / $rows->count();
                });
                return ['score' => $scores->avg() ?? 0.0, 'info' => "{$disasters->count()} disasters averaged"];
            },

            'illnesses' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],

            'evacuation_list' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['name'] ?? null) && !empty($r['capacity'] ?? null))->count();
                return ['score' => $rows->isEmpty() ? 0.0 : $valid / $rows->count(), 'info' => "$valid of {$rows->count()} centers have name+capacity"];
            },

            'evacuation_center_inventory' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'affected_areas' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'livelihood_evacuation' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'food_inventory' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'relief_goods' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],

            'distribution_process' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'trainings_inventory' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['title'] ?? null))->count();
                return ['score' => $rows->isEmpty() ? 0.0 : $valid / $rows->count(), 'info' => "$valid of {$rows->count()} trainings"];
            },
            'bdrrmc_directory' => function ($d) {
                if (empty($d) || !is_array($d)) return ['score' => 0.0, 'info' => 'empty'];
                $rows = collect($d);
                $valid = $rows->filter(fn($r) => !empty($r['designation'] ?? null) && !empty($r['name'] ?? null))->count();
                return ['score' => $rows->isEmpty() ? 0.0 : $valid / $rows->count(), 'info' => "$valid of {$rows->count()} directory entries"];
            },
            'equipment_inventory' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
            'evacuation_plan' => fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')],
        ];

        // --- Default sections to evaluate (order matches your earlier list) ---
        $sections = array_keys($checkers);

        // --- Default equal weights unless provided ---
        $weights = $weights ?? array_fill_keys($sections, 1);

        // Validate weights: ensure all sections have a weight
        foreach ($sections as $s) {
            if (!isset($weights[$s]) || !is_numeric($weights[$s]) || $weights[$s] < 0) {
                $weights[$s] = 1;
            }
        }

        // --- Evaluate each section ---
        $detailList = [];
        $filledWeight = 0.0;
        $totalWeight = 0.0;

        foreach ($data as $key => $value) {
            // Keep 0, false, and non-empty strings as-is (valid scalar data)
            if (is_null($value) || $value === '') {
                $data[$key] = [];
            } elseif (!is_array($value)) {
                // Wrap other scalar values (like integers, 0, etc.) into arrays
                $data[$key] = [$value];
            }
        }

        foreach ($sections as $s) {
            $checker = $checkers[$s] ?? fn($d) => ['score' => (!empty($d) ? 1.0 : 0.0), 'info' => (!empty($d) ? 'filled' : 'empty')];
            $sectionData = $data[$s] ?? null;

            // run checker and normalize score
            $result = $checker($sectionData);
            $score = isset($result['score']) ? (float) max(0, min(1, $result['score'])) : 0.0;
            $info = $result['info'] ?? '';

            $w = (float) $weights[$s];
            $filledWeight += $score * $w;
            $totalWeight += $w;

            $detailList[$s] = [
                'score' => round($score * 100, 2), // percent for this section
                'weight' => $w,
                'weighted_score' => round($score * $w * 100, 2),
                'info' => $info,
            ];
        }

        // --- final percentage (weighted) ---
        $percentage = $totalWeight > 0 ? ($filledWeight / $totalWeight) * 100 : 0.0;
        $percentage = round($percentage, 2);

        return [
            'percentage' => $percentage,
            'details' => $detailList,
            'filled_weight' => round($filledWeight, 4),
            'total_weight' => round($totalWeight, 4),
        ];
    }

    public function store(CRAStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $brgy_id = auth()->user()->barangay_id;
            $data    = $request->all();
            //dd($data);
            $year = $data['year'] ?? session('cra_year');
            $cra = CommunityRiskAssessment::where('year', $year)->first();

            //dd($year);

            //*================= Barangay Resource Profile =================*//
            $this->saveGeneralPopulation($brgy_id, $data, $cra);

            if (!empty($data['populationGender'])) {
                $this->savePopulationGender($brgy_id, $data['populationGender'], $cra);
            }

            if (!empty($data['population'])) {
                $this->savePopulationAgeGroup($brgy_id, $data['population'], $cra);
            }

            if (!empty($data['livelihood'])) {
                $this->saveLivelihood($brgy_id, $data['livelihood'], $cra);
            }

            if (!empty($data['infrastructure'])) {
                $this->saveHouseholdServices($brgy_id, $data['infrastructure'], $cra);
            }

            if (!empty($data['houses'])) {
                $this->saveHouseBuild($brgy_id, $data['houses'], $cra);
            }

            if (!empty($data['ownership'])) {
                $this->saveHouseOwnership($brgy_id, $data['ownership'], $cra);
            }

            if (!empty($data['buildings'])) {
                $this->saveInfrastructureBuildings($brgy_id, $data['buildings'], $cra);
            }

            if (!empty($data['facilities'])) {
                $this->saveFacilities($brgy_id, $data['facilities'], $cra);
            }

            if (!empty($data['institutions'])) {
                $this->saveInstitutions($brgy_id, $data['institutions'], $cra);
            }

            if (!empty($data['human_resources'])) {
                $this->saveHumanResources($brgy_id, $data['human_resources'], $cra);
            }

            //*================= Community Disaster History =================*//
            if (!empty($data['calamities'])) {
                $this->saveDisasterHistory($brgy_id, $data['calamities'], $cra);
            }

            //*================= Risk Assessment =================*//
            //dd($data);

            $this->saveHazards($brgy_id, $data, $cra);

            if (!empty($data['exposure'])) {
                $this->saveExposure($brgy_id, $data['exposure'], $cra);
            }
            if (!empty($data['pwd'])) {
                $this->savePWDStat($brgy_id, $data['pwd'], $cra);
            }
            $disasterPerPurok = $data['disaster_per_purok'] ?? null;

            if (is_array($disasterPerPurok) && count($disasterPerPurok) > 0) {
                $this->saveFamilyAtRisk($brgy_id, $disasterPerPurok, $cra);
            }
            if (!empty($data['illnesses'])) {
                $this->saveIllnesses($brgy_id, $data['illnesses'], $cra);
            }

            //*================= Evacuation & Inventory =================*//
            if (!empty($data['evacuation_list'])) {
                $this->saveEvacuationCenters($brgy_id, $data['evacuation_list'], $cra);
            }

            if (!empty($data['evacuation_center_inventory'])) {
                $this->saveEvacuationInventories($brgy_id, $data['evacuation_center_inventory'], $cra);
            }

            if (!empty($data['affected_areas'])) {
                $this->saveAffectedAreas($brgy_id, $data['affected_areas'], $cra);
            }

            if (!empty($data['livelihood_evacuation'])) {
                $this->saveLivelihoodEvacuation($brgy_id, $data['livelihood_evacuation'], $cra);
            }

            if (!empty($data['food_inventory'])) {
                $this->saveFoodInventory($brgy_id, $data['food_inventory'], $cra);
            }

            if (!empty($data['relief_goods'])) {
                $this->saveReliefGoods($brgy_id, $data['relief_goods'], $cra);
            }

            //*================= Disaster Readiness =================*//
            if (!empty($data['distribution_process'])) {
                $this->saveDistributionProcess($brgy_id, $data['distribution_process'], $cra);
            }

            if (!empty($data['trainings_inventory'])) {
                $this->saveTrainings($brgy_id, $data['trainings_inventory'], $cra);
            }

            if (!empty($data['bdrrmc_directory'])) {
                $this->saveBdrrmcDirectory($brgy_id, $data['bdrrmc_directory'], $cra);
            }

            if (!empty($data['equipment_inventory'])) {
                $this->saveEquipmentInventory($brgy_id, $data['equipment_inventory'], $cra);
            }

            if (!empty($data['evacuation_plan'])) {
                $this->saveEvacuationPlans($brgy_id, $data['evacuation_plan'], $cra);
            }


            DB::commit();
            $progressReport = $this->computeProgress($data);

            // Save numeric percentage to DB (make sure your column can hold 100)
            CRAProgress::updateOrCreate(
                ['barangay_id' => $brgy_id, 'cra_id' => $cra->id],
                ['percentage' => $progressReport['percentage'], 'submitted_at' => now()]
            );

            //dd("Saved Successfully 🚀 CRA Progress: { $progressReport[percentage]}%");
            return redirect()
            ->route('cra.create', ['year' => $cra->year])
            ->with('success', 'Community Risk Assessment (CRA) saved successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            // Log the error
            \Log::error('CRAController error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Optional: return a JSON response or redirect with an error message
            return back()->withErrors([
                'message' => 'An unexpected error occurred while saving data. Please try again or contact support.',
            ]);
        }
    }

    public function craProgress(Request $request)
    {
        try {
            // 🔹 1️⃣ Determine the year
            $year = $request->query('year') ?? session('cra_year');

            if (!$year) {
                return response()->json([
                    'success' => false,
                    'message' => 'Year parameter is required (e.g. ?year=2025) or must be stored in session.',
                ], 400);
            }

            // Optionally store in session for later reuse
            session(['cra_year' => $year]);

            // 🔹 2️⃣ Fetch the CRA record for that year
            $cra = CommunityRiskAssessment::where('year', $year)->first();

            if (!$cra) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'year' => $year,
                        'barangays' => [],
                        'message' => 'No CRA record found for this year.',
                    ],
                ]);
            }

            // 🔹 3️⃣ Get all barangays
            $barangays = Barangay::select('id', 'barangay_name')->get();

            // 🔹 4️⃣ Attach progress for each barangay
            $barangaysWithProgress = $barangays->map(function ($brgy) use ($cra) {
                $progress = CRAProgress::where('cra_id', $cra->id)
                    ->where('barangay_id', $brgy->id)
                    ->latest()
                    ->first();

                return [
                    'id' => $brgy->id,
                    'barangay_name' => $brgy->barangay_name,
                    'cra_progress' => $progress ? (float) $progress->percentage : 0,
                    'status' => $progress
                        ? ($progress->percentage >= 100 ? 'Completed' : 'In Progress')
                        : 'Not started',
                ];
            });

            // 🔹 5️⃣ Return filtered response
            return response()->json([
                'success' => true,
                'data' => [
                    'year' => $cra->year,
                    'cra_id' => $cra->id,
                    'barangays' => $barangaysWithProgress,
                ],
            ]);
        } catch (\Exception $e) {
            // 🔹 6️⃣ Catch errors
            return response()->json([
                'success' => false,
                'message' => 'Error fetching CRA data: ' . $e->getMessage(),
            ], 500);
        }
    }


    //* ==================== PRIVATE HELPER METHODS ==================== *//
    private function saveGeneralPopulation($brgy_id, $data, $cra)
    {
        CRAGeneralPopulation::updateOrCreate(
            ['barangay_id' => $brgy_id, 'cra_id' => $cra->id], // condition to check
            [
                'total_population' => $data['barangayPopulation'] ?? 0,
                'total_households' => $data['householdsPopulation'] ?? 0,
                'total_families'   => $data['familiesPopulation'] ?? 0,
            ]
        );
    }
    private function savePopulationGender($brgy_id, $data, $cra)
    {
        $rows = collect($data)
            ->map(fn ($item) => [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'gender'      => $item['gender'],
                'quantity'    => $item['value'] ?? 0,
            ])
            ->all();

        if (!empty($rows)) {
            CRAPopulationGender::upsert(
                $rows,
                ['barangay_id', 'gender', 'cra_id'], // unique keys
                ['quantity']               // fields to update
            );
        }
    }
    private function savePopulationAgeGroup($brgy_id, $data, $cra) {
        $rows = [];
        foreach ($data as $item) {
            $rows[] = [
                'barangay_id'               => $brgy_id,
                'cra_id' => $cra->id,
                'age_group'                 => $item['ageGroup'],
                'male_without_disability'   => $item['male_no_dis'] ?? 0,
                'male_with_disability'      => $item['male_dis'] ?? 0,
                'female_without_disability' => $item['female_no_dis'] ?? 0,
                'female_with_disability'    => $item['female_dis'] ?? 0,
                'lgbtq_without_disability'  => $item['lgbtq_no_dis'] ?? 0,
                'lgbtq_with_disability'     => $item['lgbtq_dis'] ?? 0,
            ];
        }

    if (!empty($rows)) {
        CRAPopulationAgeGroup::upsert(
            $rows,
            ['barangay_id', 'age_group', 'cra_id'], // unique keys
            [
                'male_without_disability',
                'male_with_disability',
                'female_without_disability',
                'female_with_disability',
                'lgbtq_without_disability',
                'lgbtq_with_disability',
                'updated_at', // optional: update timestamp
            ]
        );
    }
    }
    private function saveLivelihood($brgy_id, $data, $cra) {
        $rows = [];

        foreach ($data as $item) {
            $rows[] = [
                'barangay_id'               => $brgy_id,
                'cra_id' => $cra->id,
                'livelihood_type'           => $item['type'],
                'male_without_disability'   => $item['male_no_dis'] ?? 0,
                'male_with_disability'      => $item['male_dis'] ?? 0,
                'female_without_disability' => $item['female_no_dis'] ?? 0,
                'female_with_disability'    => $item['female_dis'] ?? 0,
                'lgbtq_without_disability'  => $item['lgbtq_no_dis'] ?? 0,
                'lgbtq_with_disability'     => $item['lgbtq_dis'] ?? 0,
            ];
        }

        if (!empty($rows)) {
            CRALivelihoodStatistic::upsert(
                $rows,
                ['barangay_id', 'livelihood_type', 'cra_id'], // unique keys
                [
                    'male_without_disability',
                    'male_with_disability',
                    'female_without_disability',
                    'female_with_disability',
                    'lgbtq_without_disability',
                    'lgbtq_with_disability',
                ] // fields to update
            );
        }
    }
    private function saveHouseholdServices($brgy_id, $data, $cra) {
        $insertData = [];

        foreach ($data as $infra) {
            $category = $infra['category'];

            foreach ($infra['rows'] as $row) {
                $insertData[] = [
                    'barangay_id'          => $brgy_id,
                    'cra_id' => $cra->id,
                    'category'             => $category,
                    'service_name'         => $row['type'],
                    'households_quantity'  => $row['households'] ?? 0,
                ];
            }
        }

        CRAHouseholdService::upsert(
            $insertData,
            ['barangay_id', 'category', 'service_name', 'cra_id'], // unique keys
            ['households_quantity']                      // fields to update
        );
    }
    private function saveHouseBuild($brgy_id, $data, $cra) {
        $insertData = [];

        foreach ($data as $house) {
            $insertData[] = [
                'barangay_id'        => $brgy_id,
                'cra_id' => $cra->id,
                'house_type'         => $house['houseType'],
                'one_floor'          => $house['oneFloor'] ?? 0,
                'two_or_more_floors' => $house['multiFloor'] ?? 0,
            ];
        }

        CRAHouseBuild::upsert(
            $insertData,
            ['barangay_id', 'house_type', 'cra_id'], // unique keys
            ['one_floor', 'two_or_more_floors'] // fields to update
        );
    }
    private function saveHouseOwnership($brgy_id, $data, $cra) {
        $insertData = [];

        foreach ($data as $type => $quantity) {
            $insertData[] = [
                'barangay_id'    => $brgy_id,
                'cra_id' => $cra->id,
                'ownership_type' => $type,
                'quantity'       => $quantity ?? 0,
            ];
        }

        CRAHouseOwnership::upsert(
            $insertData,
            ['barangay_id', 'ownership_type', 'cra_id'], // unique keys
            ['quantity'] // fields to update
        );
    }
    private function saveInfrastructureBuildings($brgy_id, $data, $cra) {
        $insertData = [];

        foreach ($data as $buildingCategory) {
            $category = $buildingCategory['category'];

            foreach ($buildingCategory['rows'] as $row) {
                $insertData[] = [
                    'barangay_id'         => $brgy_id,
                    'cra_id' => $cra->id,
                    'category'            => $category,
                    'infrastructure_name' => $row['type'],
                    'quantity'            => $row['households'] ?? 0,
                ];
            }
        }

        CRAInfraFacility::upsert(
            $insertData,
            ['barangay_id', 'category', 'infrastructure_name', 'cra_id'], // unique keys
            ['quantity'] // fields to update
        );
     }
    private function saveFacilities($brgy_id, $data, $cra) {
        $primaryFacilities = [];
        $publicTransport   = [];
        $roadNetworks      = [];

        foreach ($data as $facilityCategory) {
            $category = $facilityCategory['category'];

            foreach ($facilityCategory['rows'] as $row) {
                if ($category === "Facilities and Services") {
                    $primaryFacilities[] = [
                        'barangay_id'   => $brgy_id,
                        'cra_id' => $cra->id,
                        'facility_name' => $row['type'],
                        'quantity'      => $row['quantity'] ?? 0,
                    ];
                }

                if ($category === "Public Transportation") {
                    $publicTransport[] = [
                        'barangay_id'  => $brgy_id,
                        'cra_id' => $cra->id,
                        'transpo_type' => $row['type'],
                        'quantity'     => $row['quantity'] ?? 0,
                    ];
                }

                if ($category === "Road Types") {
                    $roadNetworks[] = [
                        'barangay_id'   => $brgy_id,
                        'cra_id' => $cra->id,
                        'road_type'     => $row['type'],
                        'length_km'     => $row['length'] ?? 0,
                        'maintained_by' => $row['maintained_by'] ?? null, // fixed typo
                    ];
                }
            }
        }

        // Bulk insert/update for each table
        if (!empty($primaryFacilities)) {
            CRAPrimaryFacility::upsert(
                $primaryFacilities,
                ['barangay_id', 'facility_name', "cra_id"],
                ['quantity']
            );
        }

        if (!empty($publicTransport)) {
            CRAPublicTransportation::upsert(
                $publicTransport,
                ['barangay_id', 'transpo_type', 'cra_id'],
                ['quantity']
            );
        }

        if (!empty($roadNetworks)) {
            CRARoadNetwork::upsert(
                $roadNetworks,
                ['barangay_id', 'road_type', 'cra_id'],
                ['length_km', 'maintained_by']
            );
        }
    }
    private function saveInstitutions($brgy_id, $data, $cra) {
        $institutions = [];

        foreach ($data as $inst) {
            $institutions[] = [
                'barangay_id'       => $brgy_id,
                'cra_id' => $cra->id,
                'name'              => $inst['name'], // unique per barangay + name
                'male_members'      => $inst['male'] ?? 0,
                'female_members'    => $inst['female'] ?? 0,
                'lgbtq_members'     => $inst['lgbtq'] ?? 0,
                'head_name'         => $inst['head'] ?? null,
                'contact_no'        => $inst['contact'] ?? null,
                'registered'        => $inst['registered'] ?? "NO",
                'programs_services' => $inst['programs'] ?? null,
            ];
        }

        if (!empty($institutions)) {
            CRAInstitution::upsert(
                $institutions,
                ['barangay_id', 'name', 'cra_id'], // unique keys
                [
                    'male_members',
                    'female_members',
                    'lgbtq_members',
                    'head_name',
                    'contact_no',
                    'registered',
                    'programs_services',
                ]
            );
        }
    }
    private function saveHumanResources($brgy_id, $data, $cra) {
        $humanResources = [];
        foreach ($data as $group) {
            $category = $group['category'];

            foreach ($group['rows'] as $row) {
                $humanResources[] = [
                    'barangay_id'               => $brgy_id,
                    'cra_id' => $cra->id,
                    'category'                  => $category,
                    'resource_name'             => $row['type'], // unique within barangay+category
                    'male_without_disability'   => $row['male_no_dis'] ?? 0,
                    'male_with_disability'      => $row['male_dis'] ?? 0,
                    'female_without_disability' => $row['female_no_dis'] ?? 0,
                    'female_with_disability'    => $row['female_dis'] ?? 0,
                    'lgbtq_without_disability'  => $row['lgbtq_no_dis'] ?? 0,
                    'lgbtq_with_disability'     => $row['lgbtq_dis'] ?? 0,
                ];
            }
        }

        if (!empty($humanResources)) {
            CRAHumanResource::upsert(
                $humanResources,
                ['barangay_id', 'category', 'resource_name', 'cra_id'], // unique keys
                [
                    'male_without_disability',
                    'male_with_disability',
                    'female_without_disability',
                    'female_with_disability',
                    'lgbtq_without_disability',
                    'lgbtq_with_disability',
                ]
            );
        }
    }
    private function saveDisasterHistory($brgy_id, $data, $cra)
    {
        foreach ($data as $calamity) {
            // --- Disaster Occurrence
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
            $populationImpacts = array_map(fn($pop) => [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'disaster_id' => $disaster_id,
                'category'    => $pop['category'],
                'value'       => $pop['value'] ?? 0,
                'source'      => $pop['source'] ?? null,
            ], $calamity['population']);

            if (!empty($populationImpacts)) {
                CRADisasterPopulationImpact::upsert(
                    $populationImpacts,
                    ['barangay_id', 'disaster_id', 'category', 'cra_id'],
                    ['value', 'source']
                );
            }

            // --- Effect Impacts
            $effectImpacts = array_map(fn($impact) => [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'disaster_id' => $disaster_id,
                'effect_type' => $impact['effect_type'],
                'value'       => $impact['value'] ?? 0,
                'source'      => $impact['source'] ?? null,
            ], $calamity['impacts']);

            if (!empty($effectImpacts)) {
                CRADisasterEffectImpact::upsert(
                    $effectImpacts,
                    ['barangay_id', 'disaster_id', 'effect_type', 'cra_id'],
                    ['value', 'source']
                );
            }

            // --- Property & Structure Damage (merged)
            $damages = [];

            foreach ($calamity['property'] as $prop) {
                foreach ($prop['descriptions'] as $desc) {
                    $damages[] = [
                        'barangay_id' => $brgy_id,
                        'cra_id' => $cra->id,
                        'disaster_id' => $disaster_id,
                        'damage_type' => 'property',
                        'category'    => $prop['category'],
                        'description' => $desc['description'],
                        'value'       => $desc['value'] ?? 0,
                        'source'      => $desc['source'] ?? null,
                    ];
                }
            }

            foreach ($calamity['structure'] as $struct) {
                foreach ($struct['descriptions'] as $desc) {
                    $damages[] = [
                        'barangay_id' => $brgy_id,
                        'cra_id' => $cra->id,
                        'disaster_id' => $disaster_id,
                        'damage_type' => 'structure',
                        'category'    => $struct['category'],
                        'description' => $desc['description'],
                        'value'       => $desc['value'] ?? 0,
                        'source'      => $desc['source'] ?? null,
                    ];
                }
            }

            if (!empty($damages)) {
                CRADisasterDamage::upsert(
                    $damages,
                    ['barangay_id', 'disaster_id', 'damage_type', 'category', 'description', 'cra_id'],
                    ['value', 'source']
                );
            }

            // --- Agriculture Damage
            $agriDamages = array_map(fn($agri) => [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'disaster_id' => $disaster_id,
                'description' => $agri['description'],
                'value'       => $agri['value'] ?? 0,
                'source'      => $agri['source'] ?? null,
            ], $calamity['agriculture']);

            if (!empty($agriDamages)) {
                CRADisasterAgriDamage::upsert(
                    $agriDamages,
                    ['barangay_id', 'disaster_id', 'description', 'cra_id'],
                    ['value', 'source']
                );
            }

            // --- Lifelines
            $lifelines = [];
            foreach ($calamity['lifelines'] as $life) {
                foreach ((array)$life['category'] as $category) {
                    foreach ($life['descriptions'] as $desc) {
                        $lifelines[] = [
                            'barangay_id' => $brgy_id,
                            'cra_id' => $cra->id,
                            'disaster_id' => $disaster_id,
                            'category'    => $category,
                            'description' => $desc['description'],
                            'value'       => $desc['value'] ?? 0,
                            'source'      => $desc['source'] ?? null,
                        ];
                    }
                }
            }

            if (!empty($lifelines)) {
                CRADisasterLifeline::upsert(
                    $lifelines,
                    ['barangay_id', 'disaster_id', 'category', 'description', 'cra_id'],
                    ['value', 'source']
                );
            }
        }
    }

    private function saveHazards($brgy_id, $data, $cra) {
        // --- Hazard + Risk + Vulnerability + Disasters ---

        // Cache hazards to avoid multiple DB hits
        $hazardCache = [];
        //dd($data);

        $getHazard = function ($hazardName) use (&$hazardCache) {
            if (!isset($hazardCache[$hazardName])) {
                $hazardCache[$hazardName] = CRAHazard::updateOrCreate(
                    ['hazard_name' => $hazardName],
                    []
                );
            }
            return $hazardCache[$hazardName];
        };

        // --- Save Hazards ---
        foreach ($data['hazards'] as $haz) {
            $hazard = $getHazard($haz['hazard']);

            $average = round(array_sum([
                $haz['probability'] ?? 0,
                $haz['effect'] ?? 0,
                $haz['management'] ?? 0,
            ]) / 3, 1);

            CRAHazardRisk::updateOrCreate(
                [
                    'barangay_id' => $brgy_id,
                    'hazard_id'   => $hazard->id,
                    'cra_id' => $cra->id,
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

        // --- Reusable save function for Risk & Vulnerability ---
        $saveMatrix = function ($items, $type, $cra) use ($brgy_id, $getHazard) {
            foreach ($items as $entry) {
                $hazard = $getHazard($entry['hazard']);

                CRAAssessmentMatrix::updateOrCreate(
                    [
                        'barangay_id' => $brgy_id,
                        'hazard_id'   => $hazard->id,
                        'matrix_type' => $type,
                        'cra_id' => $cra->id,
                    ],
                    [
                        'people'      => $entry['people'] ?? 0,
                        'properties'  => $entry['properties'] ?? null,
                        'services'    => $entry['services'] ?? null,
                        'environment' => $entry['environment'] ?? null,
                        'livelihood'  => $entry['livelihood'] ?? null,
                    ]
                );
            }
        };

        // Execute both calls safely
        $saveMatrix($data["risks"] ?? [], "risk", $cra);
        $saveMatrix($data["vulnerabilities"] ?? [], "vulnerability", $cra);

        // --- Disaster per Purok ---
        $keyMap = [
            'lowFamilies' => 'low_families',
            'lowIndividuals' => 'low_individuals',
            'mediumFamilies' => 'medium_families',
            'mediumIndividuals' => 'medium_individuals',
            'highFamilies' => 'high_families',
            'highIndividuals' => 'high_individuals',
        ];

        foreach ($data["disaster_per_purok"] ?? [] as $disasterData) {
            $hazard = $getHazard($disasterData['type']);

            foreach ($disasterData['rows'] as $row) {
                $updateData = [];
                foreach ($keyMap as $inputKey => $dbKey) {
                    $updateData[$dbKey] = $row[$inputKey] ?? 0;
                }

                CRADisasterRiskPopulation::updateOrCreate(
                    [
                        'barangay_id'   => $brgy_id,
                        'hazard_id'     => $hazard->id,
                        'purok_number'  => $row['purok'],
                        'cra_id' => $cra->id,
                    ],
                    $updateData
                );
            }
        }

        // --- Disaster Inventory ---
        foreach ($data["disaster_inventory"] ?? [] as $inventoryData) {
            $hazard = $getHazard($inventoryData['hazard']);

            foreach ($inventoryData['categories'] as $categoryData) {
                foreach ($categoryData['rows'] as $row) {
                    CRADisasterInventory::updateOrCreate(
                        [
                            'barangay_id' => $brgy_id,
                            'hazard_id'   => $hazard->id,
                            'cra_id' => $cra->id,
                            'category'    => $categoryData['type'],
                            'item_name'   => $row['item'],
                        ],
                        [
                            'total_in_barangay'  => $row['total'] ?? 0,
                            'percentage_at_risk' => $row['percent'] ?? null, // fixed typo
                            'location'           => $row['location'] ?? null,
                        ]
                    );
                }
            }
        }
    }
    private function saveExposure($brgy_id, $data, $cra) {
        foreach ($data as $exposure) {
        // Find or create hazard by riskType
        $hazard = CRAHazard::updateOrCreate(
            ['hazard_name' => $exposure['riskType']],
            []
        );

        $upsertData = [];

        foreach ($exposure['purokData'] as $row) {
            $upsertData[] = [
                'hazard_id'        => $hazard->id,
                'barangay_id'      => $brgy_id,
                'cra_id' => $cra->id,
                'purok_number'     => $row['purok'] || null,

                // Families & totals
                'total_families'   => $row['families'] ?? 0,
                'total_individuals'=> ($row['individualsM'] ?? 0) + ($row['individualsF'] ?? 0) + ($row['lgbtq'] ?? 0),

                // Gender
                'individuals_male'   => $row['individualsM'] ?? 0,
                'individuals_female' => $row['individualsF'] ?? 0,
                'individuals_lgbtq'  => $row['lgbtq'] ?? 0,

                // Age groups
                'age_0_6_male'     => $row['age0_6M'] ?? 0,
                'age_0_6_female'   => $row['age0_6F'] ?? 0,
                'age_7m_2y_male'   => $row['age7m_2yM'] ?? 0,
                'age_7m_2y_female' => $row['age7m_2yF'] ?? 0,
                'age_3_5_male'     => $row['age3_5M'] ?? 0,
                'age_3_5_female'   => $row['age3_5F'] ?? 0,
                'age_6_12_male'    => $row['age6_12M'] ?? 0,
                'age_6_12_female'  => $row['age6_12F'] ?? 0,
                'age_13_17_male'   => $row['age13_17M'] ?? 0,
                'age_13_17_female' => $row['age13_17F'] ?? 0,
                'age_18_59_male'   => $row['age18_59M'] ?? 0,
                'age_18_59_female' => $row['age18_59F'] ?? 0,
                'age_60_up_male'   => $row['age60upM'] ?? 0,
                'age_60_up_female' => $row['age60upF'] ?? 0,

                // Special categories
                'pwd_male'         => $row['pwdM'] ?? 0,
                'pwd_female'       => $row['pwdF'] ?? 0,
                'diseases_male'    => $row['diseasesM'] ?? 0,
                'diseases_female'  => $row['diseasesF'] ?? 0,
                'pregnant_women'   => $row['pregnantWomen'] ?? 0,
            ];
        }

        // Bulk upsert per hazard
        CRAPopulationExposure::upsert(
            $upsertData,
            ['hazard_id', 'barangay_id', 'purok_number', 'cra_id'], // unique key
            [
                'total_families', 'total_individuals',
                'individuals_male', 'individuals_female', 'individuals_lgbtq',
                'age_0_6_male', 'age_0_6_female',
                'age_7m_2y_male', 'age_7m_2y_female',
                'age_3_5_male', 'age_3_5_female',
                'age_6_12_male', 'age_6_12_female',
                'age_13_17_male', 'age_13_17_female',
                'age_18_59_male', 'age_18_59_female',
                'age_60_up_male', 'age_60_up_female',
                'pwd_male', 'pwd_female',
                'diseases_male', 'diseases_female',
                'pregnant_women'
            ]
        );
    }

    }
    private function savePWDStat($brgy_id, $data, $cra) {
        $upsertData = [];

        foreach ($data as $row) {
            $upsertData[] = [
                'barangay_id'       => $brgy_id,
                'cra_id' => $cra->id,
                'disability_type'   => $row['type'],

                // Age 0–6
                'age_0_6_male'      => $row['age0_6M'] ?? 0,
                'age_0_6_female'    => $row['age0_6F'] ?? 0,

                // Age 7m–2y
                'age_7m_2y_male'    => $row['age7m_2yM'] ?? 0,
                'age_7m_2y_female'  => $row['age7m_2yF'] ?? 0,

                // Age 3–5
                'age_3_5_male'      => $row['age3_5M'] ?? 0,
                'age_3_5_female'    => $row['age3_5F'] ?? 0,

                // Age 6–12
                'age_6_12_male'     => $row['age6_12M'] ?? 0,
                'age_6_12_female'   => $row['age6_12F'] ?? 0,
                'age_6_12_lgbtq'    => $row['age6_12LGBTQ'] ?? 0,

                // Age 13–17
                'age_13_17_male'    => $row['age13_17M'] ?? 0,
                'age_13_17_female'  => $row['age13_17F'] ?? 0,
                'age_13_17_lgbtq'   => $row['age13_17LGBTQ'] ?? 0,

                // Age 18–59
                'age_18_59_male'    => $row['age18_59M'] ?? 0,
                'age_18_59_female'  => $row['age18_59F'] ?? 0,
                'age_18_59_lgbtq'   => $row['age18_59LGBTQ'] ?? 0,

                // Age 60+
                'age_60up_male'     => $row['age60upM'] ?? 0,
                'age_60up_female'   => $row['age60upF'] ?? 0,
                'age_60up_lgbtq'    => $row['age60upLGBTQ'] ?? 0,
            ];
        }

        CRADisabilityStatistic::upsert(
            $upsertData,
            ['barangay_id', 'disability_type', 'cra_id'], // unique per barangay + disability type
            [
                'age_0_6_male','age_0_6_female',
                'age_7m_2y_male','age_7m_2y_female',
                'age_3_5_male','age_3_5_female',
                'age_6_12_male','age_6_12_female','age_6_12_lgbtq',
                'age_13_17_male','age_13_17_female','age_13_17_lgbtq',
                'age_18_59_male','age_18_59_female','age_18_59_lgbtq',
                'age_60up_male','age_60up_female','age_60up_lgbtq',
            ]
        );
    }
    private function saveFamilyAtRisk($brgy_id, $data, $cra) {
        $records = [];
        foreach ($data as $purokData) {
            $purokNumber = $purokData['purok'] ?? null;

            foreach ($purokData['rowsValue'] ?? [] as $row) {
                $records[] = [
                    'barangay_id'   => $brgy_id,
                    'cra_id' => $cra->id,
                    'purok_number'  => $purokNumber,
                    'indicator'     => $row['value'] || '',
                    'count'         => $row['count'] ?? 0,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
        }
        if (!empty($records)) {
            CRAFamilyAtRisk::upsert(
                $records,
                ['barangay_id', 'purok_number', 'indicator', 'cra_id'], // unique keys
                ['count', 'updated_at'] // fields to update if duplicate exists
            );
        }
    }
    private function saveIllnesses($brgy_id, $data, $cra) {
        $records = [];

        foreach ($data as $illness) {
            $records[] = [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'illness'     => $illness['illness'],
                'children'    => $illness['children'] ?? 0,
                'adults'      => $illness['adults'] ?? 0,
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        }

        if (!empty($records)) {
            CRAIllnessesStat::upsert(
                $records,
                ['barangay_id', 'illness', 'cra_id'], // unique keys
                ['children', 'adults', 'updated_at'] // fields to update
            );
        }
    }
    private function saveEvacuationCenters($brgy_id, $data, $cra) {
        // --- Evacuation Centers ---
        foreach ($data as $center) {
            CRAEvacuationCenter::updateOrCreate(
                [
                    'barangay_id' => $brgy_id,
                    'name'        => $center['name'],
                    'cra_id' => $cra->id,

                ],
                [
                    'capacity_families'    => $center['families']     ?? 0,
                    'capacity_individuals' => $center['individuals']  ?? 0,

                    // Owner: government / private (default to private if no flag)
                    'owner_type' => !empty($center['ownerGovt']) ? 'government' : 'private',

                    // Safely cast to bool
                    'inspected_by_engineer' => !empty($center['inspectedYes']),
                    'has_mou'               => !empty($center['mouYes']),
                ]
            );
        }
    }
    private function saveEvacuationInventories($brgy_id, $data, $cra) {
        // --- Evacuation Inventory ---
        $inventoryRecords = [];

        foreach ($data as $index => $inventory) {
            $inventoryRecords[] = [
                'barangay_id' => $brgy_id,
                'cra_id' => $cra->id,
                'purok_number' => $index + 1, // auto assign purok number

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
                'updated_at' => now(),  // ✅ required for upsert timestamps
                'created_at' => now(),
            ];
        }

        CRAEvacuationInventory::upsert(
            $inventoryRecords,
            ['barangay_id', 'purok_number', 'cra_id'], // unique constraint
            [
                'total_families',
                'total_individuals',
                'families_at_risk',
                'individuals_at_risk',
                'plan_a_center',
                'plan_a_capacity_families',
                'plan_a_capacity_individuals',
                'plan_a_unaccommodated_families',
                'plan_a_unaccommodated_individuals',
                'plan_b_center',
                'plan_b_unaccommodated_families',
                'plan_b_unaccommodated_individuals',
                'remarks',
                'updated_at'
            ]
        );

    }
    private function saveAffectedAreas($brgy_id, $data, $cra) {
        // --- Affected Places ---
        foreach ($data as $area) {
            // 1. Ensure hazard exists
            $hazard = CRAHazard::firstOrCreate(
                ['hazard_name' => $area['name']],
                ['created_at' => now(), 'updated_at' => now()]
            );

            // 2. Collect all rows for this hazard
            $affectedRecords = [];
            foreach ($area['rows'] as $row) {
                $affectedRecords[] = [
                    'barangay_id'        => $brgy_id,
                    'hazard_id'          => $hazard->id,
                    'cra_id' => $cra->id,
                    'purok_number'       => $row['purok'],

                    'risk_level'         => $row['riskLevel'] ?? 'Low',
                    'total_families'     => $row['totalFamilies'] ?? 0,
                    'total_individuals'  => $row['totalIndividuals'] ?? 0,
                    'at_risk_families'   => $row['atRiskFamilies'] ?? 0,
                    'at_risk_individuals'=> $row['atRiskIndividuals'] ?? 0,
                    'safe_evacuation_area' => $row['safeEvacuationArea'] ?? "",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 3. Batch insert/update
            CRAAffectedPlaces::upsert(
                $affectedRecords,
                ['barangay_id', 'hazard_id', 'purok_number', 'cra_id'], // unique constraints
                [
                    'risk_level',
                    'total_families',
                    'total_individuals',
                    'at_risk_families',
                    'at_risk_individuals',
                    'safe_evacuation_area',
                    'updated_at'
                ]
            );
        }
    }

    private function saveLivelihoodEvacuation($brgy_id, $data, $cra) {
        // --- Evacuation Livelihood ---
        $livelihoodRecords = [];

        foreach ($data as $row) {
            $livelihoodRecords[] = [
                'barangay_id'          => $brgy_id,
                'cra_id' => $cra->id,
                'livelihood_type'      => $row['type'],
                'evacuation_site'      => $row['evacuation'] ?? null,
                'place_of_origin'      => $row['origin'] ?? null,
                'capacity_description' => $row['items'] ?? null,
                'created_at'           => now(),
                'updated_at'           => now(),
            ];
        }

        if (!empty($livelihoodRecords)) {
            CRALivelihoodEvacuationSite::upsert(
                $livelihoodRecords,
                ['barangay_id', 'livelihood_type', 'cra_id'], // unique keys
                [
                    'evacuation_site',
                    'place_of_origin',
                    'capacity_description',
                    'updated_at'
                ]
            );
        }
    }
    private function saveFoodInventory($brgy_id, $data, $cra) {
        // food inventory
        foreach ($data as $row) {
            CRAPrepositionedInventory::updateOrCreate(
                [
                    'barangay_id' => $brgy_id,
                    'cra_id' => $cra->id,
                    'item_name'   => $row['item'] ?? '',
                ],
                [
                    'quantity' => $row['quantity'] ?? '',
                    'remarks'  => $row['remarks'] ?? null,
                ]
            );
        }
     }
    private function saveReliefGoods($brgy_id, $data, $cra) {
        // --- Relief Goods Distribution ---
        $reliefRecords = [];

        foreach ($data as $distribution) {
            // Split multiline fields into arrays
            $goods      = preg_split('/\r\n|\r|\n/', trim($distribution['typeOfGoods']));
            $quantities = preg_split('/\r\n|\r|\n/', trim($distribution['quantity']));
            $units      = preg_split('/\r\n|\r|\n/', trim($distribution['unit']));

            foreach ($goods as $index => $good) {
                $goodName = trim($good);
                $qty      = $quantities[$index] ?? null;
                $unit     = $units[$index] ?? null;

                if ($goodName !== '') {
                    $reliefRecords[] = [
                        'barangay_id'       => $brgy_id,
                        'cra_id' => $cra->id,
                        'evacuation_center' => $distribution['evacuationCenter'],
                        'relief_good'       => $goodName,
                        'address'           => $distribution['address'],
                        'quantity'          => $qty,
                        'unit'              => $unit,
                        'beneficiaries'     => $distribution['beneficiaries'] ?? null,
                        'created_at'        => now(),
                        'updated_at'        => now(),
                    ];
                }
            }
        }

        if (!empty($reliefRecords)) {
            CRAReliefDistribution::upsert(
                $reliefRecords,
                ['barangay_id', 'evacuation_center', 'relief_good', 'address', 'cra_id'], // unique keys
                ['quantity', 'unit', 'beneficiaries', 'updated_at'] // update these if duplicate
            );
        }
    }
    private function saveDistributionProcess($brgy_id, $data, $cra) {
        // --- Relief Distribution Process ---
        $processRecords = [];

        foreach ($data as $index => $row) {
            $processRecords[] = [
                'barangay_id'          => $brgy_id,
                'cra_id' => $cra->id,
                'step_no'              => $index + 1, // auto step number
                'distribution_process' => $row['process'] ?? null,
                'origin_of_goods'      => $row['origin'] ?? null,
                'remarks'              => $row['remarks'] ?? null,
                'created_at'           => now(),
                'updated_at'           => now(),
            ];
        }

        if (!empty($processRecords)) {
            CRAReliefDistributionProcess::upsert(
                $processRecords,
                ['barangay_id', 'step_no', 'cra_id'], // unique keys
                ['distribution_process', 'origin_of_goods', 'remarks', 'updated_at']
            );
        }
     }
    private function saveTrainings($brgy_id, $data, $cra)
    {
        // BDRRMC Trainings
        $trainings = collect($data ?? [])->map(function ($row) use ($brgy_id, $cra) {
            return [
                'barangay_id'            => $brgy_id,
                'cra_id'                 => $cra->id,
                'title'                  => $row['title'],
                'status'                 => $row['applies'] === 'yes' ? 'checked' : 'cross',
                'duration'               => $row['duration'] ?? null,
                'agency'                 => $row['agency'] ?? null,
                'inclusive_dates'        => $row['dates'] ?? null,
                'number_of_participants' => $row['participants'] ?? 0,
                'participants'           => $row['names'] ?? null,
                'updated_at'             => now(),
                'created_at'             => now(),
            ];
        })->toArray();

        CRABdrrmcTraining::upsert(
            $trainings,
            ['barangay_id', 'title', 'cra_id'], // unique keys
            ['status', 'duration', 'agency', 'inclusive_dates', 'number_of_participants', 'participants', 'updated_at']
        );
    }
    private function saveBdrrmcDirectory($brgy_id, $data, $cra)
    {
        // BDRRMC Directory
        $directory = collect($data ?? [])->map(function ($row) use ($brgy_id, $cra) {
            return [
                'barangay_id'      => $brgy_id,
                'cra_id'           => $cra->id,
                'designation_team' => $row['designation'],
                'name'             => $row['name'] ?? null,
                'contact_no'       => $row['contact'] ?? null,
                'updated_at'       => now(),
                'created_at'       => now(),
            ];
        })->toArray();

        CRABdrrmcDirectory::upsert(
            $directory,
            ['barangay_id', 'designation_team', 'cra_id'], // unique keys
            ['name', 'contact_no', 'updated_at']
        );
    }

    private function saveEquipmentInventory($brgy_id, $data, $cra) {
        // Equipment Inventory
        $equipment = collect($data ?? [])->map(function ($row) use ($brgy_id, $cra) {
            return [
                'barangay_id'   => $brgy_id,
                'cra_id'                 => $cra->id,
                'item'          => $row['item'],
                'availability'  => ($row['status'] === 'yes' || $row['status'] === 'checked') ? 'checked' : 'cross',
                'quantity'      => $row['quantity'] ?? 0,
                'location'      => $row['location'] ?? null,
                'remarks'       => $row['remarks'] ?? null,
                'updated_at'    => now(),
                'created_at'    => now(), // optional but good if you allow inserts
            ];
        })->toArray();

        CRAEquipmentInventory::upsert(
            $equipment,
            ['barangay_id', 'item', 'cra_id'], // unique keys
            ['availability', 'quantity', 'location', 'remarks', 'updated_at']
        );
    }
    private function saveEvacuationPlans($brgy_id, $data, $cra) {
        // Evacuation Plan
        foreach ($data as $index => $row) {
            CRAEvacuationPlan::updateOrCreate(
                [
                    'barangay_id' => $brgy_id,
                    'cra_id'                 => $cra->id,
                    'activity_no' => $index + 1, // auto-generate activity number
                ],
                [
                    'things_to_do'      => $row['task'] ?? null,
                    'responsible_person'=> $row['responsible'] ?? null,
                    'remarks'           => $row['remarks'] ?? null,
                ]
            );
        }
    }

    public function brgyDataCollection()
    {
        $brgy_id = auth()->user()->barangay_id;

        $barangay = Barangay::with([
            'generalPopulation',
            'bdrrmcDirectories',
            'bdrrmcTrainings',
            'populationGenders',
            'populationAgeGroups',
            'populationExposures',
            'disasterOccurances',
            'disasterAgriDamages',
            'disasterDamages',
            'disasterEffectImpacts',
            'disasterInventories',
            'disasterLifelines',
            'disasterPopulationImpacts',
            'disasterRiskPopulations',
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
            'hazardRisks',
            'illnessesStats',
            'disabilityStatistics',
            'humanResources',
            'affectedPlaces',
            'prepositionedInventories',
        ])->findOrFail($brgy_id);

        return response()->json($barangay->dataCollection()); // ✅ reuse model formatter
    }


    public function dashboard(){
        return Inertia::render("BarangayOfficer/CRA/Dashboard");
    }
}

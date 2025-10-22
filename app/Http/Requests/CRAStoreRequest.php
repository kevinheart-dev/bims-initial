<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CRAStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // General Population
            'year' => ['nullable'],
            'barangayPopulation'   => ['required', 'integer', 'min:0'],
            'householdsPopulation' => ['required', 'integer', 'min:0'],
            'familiesPopulation'   => ['required', 'integer', 'min:0'],

            // Population Genders
            'populationGender'              => ['required', 'array', 'min:1'],
            'populationGender.*.gender'     => ['required', 'string'],
            'populationGender.*.value'      => ['required', 'integer', 'min:0'],

            // Population Age Groups
            'population'                         => ['nullable', 'array', 'min:1'],
            'population.*.ageGroup'             => ['nullable', 'string'],
            'population.*.male_no_dis'          => ['nullable', 'integer', 'min:0'],
            'population.*.male_dis'             => ['nullable', 'integer', 'min:0'],
            'population.*.female_no_dis'        => ['nullable', 'integer', 'min:0'],
            'population.*.female_dis'           => ['nullable', 'integer', 'min:0'],
            'population.*.lgbtq_no_dis'         => ['nullable', 'integer', 'min:0'],
            'population.*.lgbtq_dis'            => ['nullable', 'integer', 'min:0'],

            // Livelihood Statistics
            'livelihood'                        => ['nullable', 'array', 'min:1'],
            'livelihood.*.type'                  => ['nullable', 'string'],
            'livelihood.*.male_no_dis'           => ['nullable', 'integer', 'min:0'],
            'livelihood.*.male_dis'              => ['nullable', 'integer', 'min:0'],
            'livelihood.*.female_no_dis'         => ['nullable', 'integer', 'min:0'],
            'livelihood.*.female_dis'            => ['nullable', 'integer', 'min:0'],
            'livelihood.*.lgbtq_no_dis'          => ['nullable', 'integer', 'min:0'],
            'livelihood.*.lgbtq_dis'             => ['nullable', 'integer', 'min:0'],

            // Household Services
            'infrastructure'                   => ['nullable', 'array', 'min:1'],
            'infrastructure.*.category'        => ['nullable', 'string'],
            'infrastructure.*.rows'            => ['nullable', 'array', 'min:1'],
            'infrastructure.*.rows.*.type'     => ['nullable', 'string'],
            'infrastructure.*.rows.*.households'=> ['nullable', 'integer', 'min:0'],

            // House Build
            'houses'                         => ['nullable', 'array', 'min:1'],
            'houses.*.houseType'             => ['nullable', 'string'],
            'houses.*.oneFloor'              => ['nullable', 'integer', 'min:0'],
            'houses.*.multiFloor'            => ['nullable', 'integer', 'min:0'],

            // House Ownership
            'ownership'               => ['nullable', 'array', 'min:1'],
            'ownership.*'             => ['nullable', 'integer', 'min:0'],

            // Infrastructure & Buildings
            'buildings'                  => ['nullable', 'array', 'min:1'],
            'buildings.*.category'      => ['nullable', 'string'],
            'buildings.*.rows'          => ['nullable', 'array', 'min:1'],
            'buildings.*.rows.*.type'   => ['nullable', 'string'],
            'buildings.*.rows.*.households'=> ['nullable', 'integer', 'min:0'],

            // Facilities
            'facilities'                         => ['nullable', 'array', 'min:1'],
            'facilities.*.category'              => ['nullable', 'string'],
            'facilities.*.rows'                  => ['nullable', 'array', 'min:1'],
            'facilities.*.rows.*.type'           => ['nullable', 'string'],
            'facilities.*.rows.*.quantity'       => ['nullable', 'integer', 'min:0'],
            'facilities.*.rows.*.length'         => ['nullable', 'numeric', 'min:0'],  // for roads
            'facilities.*.rows.*.maintained_by'  => ['nullable', 'string'],

            // Institutions
            'institutions'                         => ['nullable', 'array'],
            'institutions.*.name'                  => ['nullable', 'string'],
            'institutions.*.male'                  => ['nullable', 'integer', 'min:0'],
            'institutions.*.female'                => ['nullable', 'integer', 'min:0'],
            'institutions.*.lgbtq'                 => ['nullable', 'integer', 'min:0'],
            'institutions.*.head'                  => ['nullable', 'string'],
            'institutions.*.contact'               => ['nullable', 'string'],
            'institutions.*.registered'            => ['nullable', 'in:YES,NO'],
            'institutions.*.programs'              => ['nullable', 'string'],

            // Human Resources
            'human_resources'                    => ['nullable', 'array', 'min:1'],
            'human_resources.*.category'         => ['nullable', 'string'],
            'human_resources.*.rows'             => ['nullable', 'array', 'min:1'],
            'human_resources.*.rows.*.type'      => ['nullable', 'string'],
            'human_resources.*.rows.*.male_no_dis'   => ['nullable', 'integer', 'min:0'],
            'human_resources.*.rows.*.male_dis'      => ['nullable', 'integer', 'min:0'],
            'human_resources.*.rows.*.female_no_dis' => ['nullable', 'integer', 'min:0'],
            'human_resources.*.rows.*.female_dis'    => ['nullable', 'integer', 'min:0'],
            'human_resources.*.rows.*.lgbtq_no_dis'  => ['nullable', 'integer', 'min:0'],
            'human_resources.*.rows.*.lgbtq_dis'     => ['nullable', 'integer', 'min:0'],

            // Disaster History
            'calamities'                          => ['nullable', 'array', 'min:1'],
            'calamities.*.disaster_name'          => ['nullable', 'string'],
            'calamities.*.year'                   => ['nullable', 'string'],

            // Population impact
            'calamities.*.population'             => ['nullable', 'array', 'min:1'],
            'calamities.*.population.*.category'  => ['nullable', 'string'],
            'calamities.*.population.*.value'     => ['nullable', 'numeric', 'min:0'],
            'calamities.*.population.*.source'    => ['nullable', 'string'],

            // Effect impacts
            'calamities.*.impacts'                => ['nullable', 'array', 'min:1'],
            'calamities.*.impacts.*.effect_type'  => ['nullable', 'string'],
            'calamities.*.impacts.*.value'        => ['nullable', 'numeric', 'min:0'],
            'calamities.*.impacts.*.source'       => ['nullable', 'string'],

            // Property & Structure damages
            'calamities.*.property'                               => ['nullable', 'array', 'min:1'],
            'calamities.*.property.*.category'                    => ['nullable', 'string'],
            'calamities.*.property.*.descriptions'                => ['nullable', 'array', 'min:1'],
            'calamities.*.property.*.descriptions.*.description'  => ['nullable', 'string'],
            'calamities.*.property.*.descriptions.*.value'        => ['nullable', 'string'], // ✅ now string
            'calamities.*.property.*.descriptions.*.source'       => ['nullable', 'string'],

            'calamities.*.structure'                              => ['nullable', 'array', 'min:1'],
            'calamities.*.structure.*.category'                   => ['nullable', 'string'],
            'calamities.*.structure.*.descriptions'               => ['nullable', 'array', 'min:1'],
            'calamities.*.structure.*.descriptions.*.description' => ['nullable', 'string'],
            'calamities.*.structure.*.descriptions.*.value'       => ['nullable', 'numeric', 'min:0'],
            'calamities.*.structure.*.descriptions.*.source'      => ['nullable', 'string'],

            // Agriculture damages
            'calamities.*.agriculture'             => ['nullable', 'array', 'min:1'],
            'calamities.*.agriculture.*.description' => ['nullable', 'string'],
            'calamities.*.agriculture.*.value'       => ['nullable', 'numeric', 'min:0'],
            'calamities.*.agriculture.*.source'      => ['nullable', 'string'],

            // Lifelines
            'calamities.*.lifelines'                               => ['nullable', 'array', 'min:1'],

            'calamities.*.lifelines.0.category'   => ['nullable', 'array', 'min:1'],
            'calamities.*.lifelines.0.category.*' => ['nullable', 'string'],

            // cover index 1–9
            'calamities.*.lifelines.1.category' => ['nullable', 'string'],
            'calamities.*.lifelines.2.category' => ['nullable', 'string'],
            'calamities.*.lifelines.3.category' => ['nullable', 'string'],
            'calamities.*.lifelines.4.category' => ['nullable', 'string'],

            'calamities.*.lifelines.*.descriptions'                => ['nullable', 'array', 'min:1'],
            'calamities.*.lifelines.*.descriptions.*.description'  => ['nullable', 'string'],
            'calamities.*.lifelines.*.descriptions.*.value'        => ['nullable', 'string'], // descriptive text allowed
            'calamities.*.lifelines.*.descriptions.*.source'       => ['nullable', 'string'],

            // Hazards
            'hazards'                           => ['nullable', 'array', 'min:1'],
            'hazards.*.hazard'                  => ['nullable', 'string'],
            'hazards.*.probability'             => ['nullable', 'integer', 'min:0'],
            'hazards.*.effect'                  => ['nullable', 'integer', 'min:0'],
            'hazards.*.management'              => ['nullable', 'integer', 'min:0'],
            'hazards.*.basis'                   => ['nullable', 'string'],

            // Risks
            'risks'                             => ['nullable', 'array', 'min:1'],
            'risks.*.hazard'                    => ['nullable', 'string'],
            'risks.*.people'                     => ['nullable', 'integer', 'min:0'],
            'risks.*.properties'                 => ['nullable', 'string'],
            'risks.*.services'                   => ['nullable', 'string'],
            'risks.*.environment'                => ['nullable', 'string'],
            'risks.*.livelihood'                 => ['nullable', 'string'],

            // Vulnerabilities
            'vulnerabilities'                    => ['nullable', 'array', 'min:1'],
            'vulnerabilities.*.hazard'           => ['nullable', 'string'],
            'vulnerabilities.*.people'           => ['nullable', 'integer', 'min:0'],
            'vulnerabilities.*.properties'       => ['nullable', 'string'],
            'vulnerabilities.*.services'         => ['nullable', 'string'],
            'vulnerabilities.*.environment'      => ['nullable', 'string'],
            'vulnerabilities.*.livelihood'       => ['nullable', 'string'],

            // Disaster per Purok
            'disaster_per_purok'                  => ['nullable', 'array', 'min:1'],
            'disaster_per_purok.*.type'           => ['nullable', 'string'],
            'disaster_per_purok.*.rows'           => ['nullable', 'array', 'min:1'],
            'disaster_per_purok.*.rows.*.purok'   => ['nullable', 'integer'],
            'disaster_per_purok.*.rows.*.lowFamilies'    => ['nullable', 'integer', 'min:0'],
            'disaster_per_purok.*.rows.*.lowIndividuals' => ['nullable', 'integer', 'min:0'],
            'disaster_per_purok.*.rows.*.mediumFamilies' => ['nullable', 'integer', 'min:0'],
            'disaster_per_purok.*.rows.*.mediumIndividuals'=> ['nullable', 'integer', 'min:0'],
            'disaster_per_purok.*.rows.*.highFamilies'   => ['nullable', 'integer', 'min:0'],
            'disaster_per_purok.*.rows.*.highIndividuals'=> ['nullable', 'integer', 'min:0'],

            // Disaster Inventory
            'disaster_inventory'                               => ['nullable', 'array', 'min:1'],
            'disaster_inventory.*.hazard'                      => ['nullable', 'string'],
            'disaster_inventory.*.categories'                  => ['nullable', 'array', 'min:1'],
            'disaster_inventory.*.categories.*.type'           => ['nullable', 'string'],
            'disaster_inventory.*.categories.*.rows'           => ['nullable', 'array', 'min:1'],
            'disaster_inventory.*.categories.*.rows.*.item'    => ['nullable', 'string'],

            // ✅ totals come as string but numeric → allow both
            'disaster_inventory.*.categories.*.rows.*.total'   => ['nullable', 'numeric', 'min:0'],

            // ✅ percents include "%" → treat as string
            'disaster_inventory.*.categories.*.rows.*.percent' => ['nullable', 'string'],

            'disaster_inventory.*.categories.*.rows.*.location'=> ['nullable', 'string'],

            // Population Exposure
            'exposure'                            => ['nullable', 'array', 'min:1'],
            'exposure.*.riskType'                 => ['nullable', 'string'],
            'exposure.*.purokData'                => ['nullable', 'array', 'min:1'],
            'exposure.*.purokData.*.purok'       => ['nullable', 'integer'],
            'exposure.*.purokData.*.families'    => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.individualsM'=> ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.individualsF'=> ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.lgbtq'       => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age0_6M'     => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age0_6F'     => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age7m_2yM'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age7m_2yF'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age3_5M'     => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age3_5F'     => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age6_12M'    => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age6_12F'    => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age13_17M'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age13_17F'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age18_59M'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age18_59F'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age60upM'    => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.age60upF'    => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.pwdM'        => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.pwdF'        => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.diseasesM'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.diseasesF'   => ['nullable', 'integer', 'min:0'],
            'exposure.*.purokData.*.pregnantWomen'=> ['nullable', 'integer', 'min:0'],

            // PWD Statistics
            'pwd'                              => ['nullable', 'array', 'min:1'],
            'pwd.*.type'                        => ['nullable', 'string'],
            'pwd.*.age0_6M'                     => ['nullable', 'integer', 'min:0'],
            'pwd.*.age0_6F'                     => ['nullable', 'integer', 'min:0'],
            'pwd.*.age7m_2yM'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age7m_2yF'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age3_5M'                     => ['nullable', 'integer', 'min:0'],
            'pwd.*.age3_5F'                     => ['nullable', 'integer', 'min:0'],
            'pwd.*.age6_12M'                    => ['nullable', 'integer', 'min:0'],
            'pwd.*.age6_12F'                    => ['nullable', 'integer', 'min:0'],
            'pwd.*.age6_12LGBTQ'                => ['nullable', 'integer', 'min:0'],
            'pwd.*.age13_17M'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age13_17F'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age13_17LGBTQ'               => ['nullable', 'integer', 'min:0'],
            'pwd.*.age18_59M'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age18_59F'                   => ['nullable', 'integer', 'min:0'],
            'pwd.*.age18_59LGBTQ'               => ['nullable', 'integer', 'min:0'],
            'pwd.*.age60upM'                    => ['nullable', 'integer', 'min:0'],
            'pwd.*.age60upF'                    => ['nullable', 'integer', 'min:0'],
            'pwd.*.age60upLGBTQ'                => ['nullable', 'integer', 'min:0'],

            // Family at Risk

            'disaster_per_purok.*.purok'             => ['nullable', 'numeric', 'min:0'],
            'disaster_per_purok.*.rowsValue'         => ['nullable', 'array', 'min:1'],
            'disaster_per_purok.*.rowsValue.*.value' => ['nullable', 'string'],
            'disaster_per_purok.*.rowsValue.*.count' => ['nullable', 'numeric', 'min:0'],

            // Illness Statistics
            'illnesses'                        => ['nullable', 'array', 'min:1'],
            'illnesses.*.illness'              => ['nullable', 'string'],
            'illnesses.*.children'             => ['nullable', 'integer', 'min:0'],
            'illnesses.*.adults'               => ['nullable', 'integer', 'min:0'],

            // Evacuation Centers
            'evacuation_list'                    => ['nullable', 'array', 'min:1'],
            'evacuation_list.*.name'             => ['nullable', 'string'],
            'evacuation_list.*.families'         => ['nullable', 'numeric', 'min:0'],
            'evacuation_list.*.individuals'      => ['nullable', 'numeric', 'min:0'],
            'evacuation_list.*.ownerGovt'        => ['nullable', 'boolean'],
            'evacuation_list.*.ownerPrivate'     => ['nullable', 'boolean'],
            'evacuation_list.*.inspectedYes'     => ['nullable', 'boolean'],
            'evacuation_list.*.inspectedNo'      => ['nullable', 'boolean'],
            'evacuation_list.*.mouYes'           => ['nullable', 'boolean'],
            'evacuation_list.*.mouNo'            => ['nullable', 'boolean'],

            // Evacuation Inventory
            'evacuation_center_inventory'                      => ['nullable', 'array', 'min:1'],
            'evacuation_center_inventory.*.totalFamilies'     => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.totalIndividuals'  => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.populationAtRiskFamilies'     => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.populationAtRiskIndividuals'  => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.evacuationCenterPlanA'        => ['nullable', 'string'],
            'evacuation_center_inventory.*.personsCanBeAccommodatedPlanAFamilies' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.personsCanBeAccommodatedPlanAIndividuals' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.personsCannotBeAccommodatedPlanAFamilies' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.personsCannotBeAccommodatedPlanAIndividuals' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.evacuationCenterPlanB'        => ['nullable', 'string'],
            'evacuation_center_inventory.*.personsCannotBeAccommodatedPlanABFamilies' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.personsCannotBeAccommodatedPlanABIndividuals' => ['nullable', 'integer', 'min:0'],
            'evacuation_center_inventory.*.remarks'                    => ['nullable', 'string'],

            // Affected Areas / Places
            'affected_areas'                  => ['nullable', 'array', 'min:1'],
            'affected_areas.*.name'           => ['nullable', 'string'],
            'affected_areas.*.rows'           => ['nullable', 'array', 'min:1'],
            'affected_areas.*.rows.*.purok'  => ['nullable', 'integer', 'min:1'],
            'affected_areas.*.rows.*.riskLevel'             => ['nullable', 'string', 'in:Low,Medium,High'],
            'affected_areas.*.rows.*.totalFamilies'        => ['nullable', 'integer', 'min:0'],
            'affected_areas.*.rows.*.totalIndividuals'     => ['nullable', 'integer', 'min:0'],
            'affected_areas.*.rows.*.atRiskFamilies'       => ['nullable', 'integer', 'min:0'],
            'affected_areas.*.rows.*.atRiskIndividuals'    => ['nullable', 'integer', 'min:0'],
            'affected_areas.*.rows.*.safeEvacuationArea'   => ['nullable', 'string'],

            // Livelihoods at Evacuation Sites
            'livelihood_evacuation'                 => ['nullable', 'array', 'min:1'],
            'livelihood_evacuation.*.type'          => ['nullable', 'string'],
            'livelihood_evacuation.*.evacuation'    => ['nullable', 'string'],
            'livelihood_evacuation.*.origin'        => ['nullable', 'string'],
            'livelihood_evacuation.*.items'         => ['nullable', 'string'],

            // Food Inventory / Prepositioned Items
            'food_inventory'                         => ['nullable', 'array', 'min:1'],
            'food_inventory.*.item'                  => ['nullable', 'string'],
            'food_inventory.*.quantity'              => ['nullable', 'integer', 'min:0'],
            'food_inventory.*.remarks'               => ['nullable', 'string'],

            // Relief Goods Distribution
            'relief_goods'                              => ['nullable', 'array', 'min:1'],
            'relief_goods.*.evacuationCenter'          => ['nullable', 'string'],
            'relief_goods.*.address'                    => ['nullable', 'string'],
            'relief_goods.*.typeOfGoods'               => ['nullable', 'string'], // multiline string
            'relief_goods.*.quantity'                  => ['nullable', 'string'], // multiline string
            'relief_goods.*.unit'                      => ['nullable', 'string'], // multiline string
            'relief_goods.*.beneficiaries'            => ['nullable', 'string'],

            // Relief Distribution Process
            'distribution_process'                      => ['nullable', 'array', 'min:1'],
            'distribution_process.*.process'           => ['nullable', 'string'],
            'distribution_process.*.origin'            => ['nullable', 'string'],
            'distribution_process.*.remarks'           => ['nullable', 'string'],

            // BDRRMC Trainings
            'trainings_inventory' => ['nullable', 'array', 'min:1'],
            'trainings_inventory.*.title' => ['nullable', 'string', 'max:255'],
            'trainings_inventory.*.applies' => ['nullable', 'in:yes,no'],
            'trainings_inventory.*.duration' => ['nullable', 'string', 'max:255'],
            'trainings_inventory.*.agency' => ['nullable', 'string', 'max:255'],
            'trainings_inventory.*.dates' => ['nullable', 'string', 'max:255'],
            'trainings_inventory.*.participants' => ['nullable', 'integer', 'min:0'],
            'trainings_inventory.*.names' => ['nullable', 'string'],

            // BDRRMC Directory
            'bdrrmc_directory' => ['nullable', 'array', 'min:1'],
            'bdrrmc_directory.*.designation' => ['nullable', 'string', 'max:255'],
            'bdrrmc_directory.*.name' => ['nullable', 'string', 'max:255'],
            'bdrrmc_directory.*.contact' => ['nullable', 'string', 'max:50'],

            // Equipment Inventory
            'equipment_inventory' => ['nullable', 'array', 'min:1'],
            'equipment_inventory.*.item' => ['nullable', 'string', 'max:255'],
            'equipment_inventory.*.status' => ['nullable', 'in:yes,no,checked,cross'],
            'equipment_inventory.*.quantity' => ['nullable', 'integer', 'min:0'],
            'equipment_inventory.*.location' => ['nullable', 'string', 'max:255'],
            'equipment_inventory.*.remarks' => ['nullable', 'string'],

            // Evacuation Plans
            'evacuation_plan' => ['nullable', 'array', 'min:1'],
            'evacuation_plan.*.task' => ['nullable', 'string'],
            'evacuation_plan.*.responsible' => ['nullable', 'string', 'max:255'],
            'evacuation_plan.*.remarks' => ['nullable', 'string'],
        ];
    }
    public function attributes(): array
    {
        return [
            // ===========================
            // General Population
            // ===========================
            'barangayPopulation'    => 'barangay population',
            'householdsPopulation'  => 'household population',
            'familiesPopulation'    => 'family population',

            // Population Genders
            'populationGender'              => 'population genders',
            'populationGender.*.gender'     => 'gender',
            'populationGender.*.value'      => 'gender count',

            // Population Age Groups
            'population'                    => 'population age groups',
            'population.*.ageGroup'         => 'age group',
            'population.*.male_no_dis'      => 'male without disability',
            'population.*.male_dis'         => 'male with disability',
            'population.*.female_no_dis'    => 'female without disability',
            'population.*.female_dis'       => 'female with disability',
            'population.*.lgbtq_no_dis'     => 'LGBTQ without disability',
            'population.*.lgbtq_dis'        => 'LGBTQ with disability',

            // ===========================
            // Livelihoods
            // ===========================
            'livelihood'                     => 'livelihood statistics',
            'livelihood.*.type'              => 'livelihood type',
            'livelihood.*.male_no_dis'       => 'male without disability',
            'livelihood.*.male_dis'          => 'male with disability',
            'livelihood.*.female_no_dis'     => 'female without disability',
            'livelihood.*.female_dis'        => 'female with disability',
            'livelihood.*.lgbtq_no_dis'      => 'LGBTQ without disability',
            'livelihood.*.lgbtq_dis'         => 'LGBTQ with disability',

            // ===========================
            // Household Services (Infrastructure)
            // ===========================
            'infrastructure'                 => 'household services',
            'infrastructure.*.category'      => 'service category',
            'infrastructure.*.rows.*.type'   => 'service type',
            'infrastructure.*.rows.*.households'=> 'household count',

            // ===========================
            // Houses
            // ===========================
            'houses'                          => 'house builds',
            'houses.*.houseType'              => 'house type',
            'houses.*.oneFloor'               => 'one floor house count',
            'houses.*.multiFloor'             => 'multi-floor house count',

            // ===========================
            // Ownership
            // ===========================
            'ownership'                        => 'house ownership',
            'ownership.*'                      => 'house ownership value',

            // ===========================
            // Buildings
            // ===========================
            'buildings'                        => 'buildings',
            'buildings.*.category'             => 'building category',
            'buildings.*.rows.*.type'          => 'building type',
            'buildings.*.rows.*.households'    => 'building households',

            // ===========================
            // Facilities
            // ===========================
            'facilities'                       => 'facilities',
            'facilities.*.category'            => 'facility category',
            'facilities.*.rows.*.type'         => 'facility type',
            'facilities.*.rows.*.quantity'     => 'facility quantity',
            'facilities.*.rows.*.length'       => 'facility length',
            'facilities.*.rows.*.maintained_by'=> 'maintained by',

            // ===========================
            // Institutions
            // ===========================
            'institutions'                     => 'institutions',
            'institutions.*.name'              => 'institution name',
            'institutions.*.male'              => 'male count',
            'institutions.*.female'            => 'female count',
            'institutions.*.lgbtq'             => 'LGBTQ count',
            'institutions.*.head'              => 'head of institution',
            'institutions.*.contact'           => 'contact',
            'institutions.*.registered'        => 'registration status',
            'institutions.*.programs'          => 'programs',

            // ===========================
            // Human Resources
            // ===========================
            'human_resources'                  => 'human resources',
            'human_resources.*.category'       => 'HR category',
            'human_resources.*.rows.*.type'    => 'HR type',
            'human_resources.*.rows.*.male_no_dis'  => 'male without disability',
            'human_resources.*.rows.*.male_dis'     => 'male with disability',
            'human_resources.*.rows.*.female_no_dis'=> 'female without disability',
            'human_resources.*.rows.*.female_dis'   => 'female with disability',
            'human_resources.*.rows.*.lgbtq_no_dis' => 'LGBTQ without disability',
            'human_resources.*.rows.*.lgbtq_dis'    => 'LGBTQ with disability',

            // ===========================
            // Calamities
            // ===========================
            'calamities'                                   => 'disasters',
            'calamities.*.disaster_name'                   => 'disaster name',
            'calamities.*.year'                            => 'disaster year',

            // Calamity population impact
            'calamities.*.population.*.type'               => 'population type',
            'calamities.*.population.*.value'              => 'population value',

            // Calamity casualties/effects
            'calamities.*.effects.*.type'                  => 'effect type',
            'calamities.*.effects.*.value'                 => 'effect value',

            // Property damages
            'calamities.*.property.*.type'                 => 'property damage type',
            'calamities.*.property.*.descriptions.*.label' => 'property description',
            'calamities.*.property.*.descriptions.*.value' => 'property value',

            // Structure damages
            'calamities.*.structures.*.type'               => 'structure type',
            'calamities.*.structures.*.descriptions.*.label'=> 'structure description',
            'calamities.*.structures.*.descriptions.*.value'=> 'structure value',

            // Agriculture damages
            'calamities.*.agriculture.*.type'              => 'agriculture type',
            'calamities.*.agriculture.*.descriptions.*.label'=> 'agriculture description',
            'calamities.*.agriculture.*.descriptions.*.value'=> 'agriculture value',

            // Lifelines
            'calamities.*.lifelines.*.category'            => 'lifeline category',
            'calamities.*.lifelines.*.descriptions.*.label'=> 'lifeline description',
            'calamities.*.lifelines.*.descriptions.*.value'=> 'lifeline value',

            // ===========================
            // Hazards, Risks, Vulnerabilities
            // ===========================
            'hazards.*.hazard'                  => 'hazard',
            'risks.*.hazard'                    => 'risk hazard',
            'vulnerabilities.*.hazard'          => 'vulnerability hazard',

            // ===========================
            // Trainings
            // ===========================
            'trainings_inventory.*.title'       => 'training title',
            'trainings_inventory.*.applies'     => 'training applies',
            'trainings_inventory.*.duration'    => 'training duration',
            'trainings_inventory.*.agency'      => 'training agency',
            'trainings_inventory.*.dates'       => 'training dates',
            'trainings_inventory.*.participants'=> 'training participants',
            'trainings_inventory.*.names'       => 'participant names',

            // ===========================
            // Directory
            // ===========================
            'bdrrmc_directory.*.designation'    => 'designation',
            'bdrrmc_directory.*.name'           => 'name',
            'bdrrmc_directory.*.contact'        => 'contact number',

            // ===========================
            // Equipment Inventory
            // ===========================
            'equipment_inventory.*.item'        => 'equipment item',
            'equipment_inventory.*.status'      => 'equipment status',
            'equipment_inventory.*.quantity'    => 'equipment quantity',
            'equipment_inventory.*.location'    => 'equipment location',
            'equipment_inventory.*.remarks'     => 'equipment remarks',

            // ===========================
            // Evacuation Plan
            // ===========================
            'evacuation_plan.*.task'            => 'evacuation task',
            'evacuation_plan.*.responsible'     => 'responsible person',
            'evacuation_plan.*.remarks'         => 'remarks',

            // ===========================
            // Evacuation Centers
            // ===========================
            'evacuationCenters'                   => 'evacuation centers',
            'evacuationCenters.*.name'            => 'evacuation center name',
            'evacuationCenters.*.families'        => 'evacuation center families',
            'evacuationCenters.*.individuals'     => 'evacuation center individuals',
            'evacuationCenters.*.ownerGovt'       => 'evacuation center government ownership',
            'evacuationCenters.*.ownerPrivate'    => 'evacuation center private ownership',
            'evacuationCenters.*.inspectedYes'    => 'evacuation center inspected (yes)',
            'evacuationCenters.*.inspectedNo'     => 'evacuation center inspected (no)',
            'evacuationCenters.*.mouYes'          => 'evacuation center MOU (yes)',
            'evacuationCenters.*.mouNo'           => 'evacuation center MOU (no)',

            // Evacuation Center Inventory
            'evacuation_center_inventory.*.totalFamilies'    => 'total families in evacuation center inventory',
            'evacuation_center_inventory.*.totalIndividuals' => 'total individuals in evacuation center inventory',

            // ===========================
            // Disaster Inventory
            // ===========================
            'disaster_inventory.*.hazard'                    => 'disaster inventory hazard',
            'disaster_inventory.*.categories.*.category'     => 'disaster inventory category',
            'disaster_inventory.*.categories.*.rows.*.item'  => 'disaster inventory item',
            'disaster_inventory.*.categories.*.rows.*.total' => 'disaster inventory total',
            'disaster_inventory.*.categories.*.rows.*.percent'=> 'disaster inventory percent',
            'disaster_inventory.*.categories.*.rows.*.location'=> 'disaster inventory location',

            // ===========================
            // Disaster Per Purok
            // ===========================
            'disaster_per_purok.*.purok'                     => 'purok number',
            'disaster_per_purok.*.rowsValue.*.hazard'        => 'purok hazard',
            'disaster_per_purok.*.rowsValue.*.count'         => 'purok hazard count',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'The :attribute field is required.',
            'array'    => 'The :attribute must be a valid array.',
            'integer'  => 'The :attribute must be an integer.',
            'numeric'  => 'The :attribute must be numeric.',
            'min'      => 'The :attribute must be at least :min.',
            'max'      => 'The :attribute may not exceed :max characters.',
            'in'       => 'The selected :attribute is invalid.',
            'boolean'  => 'The :attribute must be true or false.',
            'string'   => 'The :attribute must be a text value.',
        ];
    }
}

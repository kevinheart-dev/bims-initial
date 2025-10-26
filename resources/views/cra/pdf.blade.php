<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>CRA Report {{ $cra->year }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            margin: 20px;
        }

        h4 {
            text-align: center;
        }

        .section-title {
            font-weight: bold;
            margin-top: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }

        .no-border td {
            border: none;
            padding: 0;
        }
    </style>
</head>

<body>
    <h4>BARANGAY {{ $cra->progress[0]->barangay->barangay_name ?? '_______________________' }}</h4>
    <h4>CRA {{ $cra->year }} </h4>

    <p class="section-title">A. Information on Population and Residence</p>
    <table>
        <thead>
            <tr>
                <th>GENERAL POPULATION</th>
                <th>TOTAL NUMBER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Barangay Population</td>
                <td>{{ $cra->generalPopulation->total_population ?? '0' }}</td>
            </tr>
            <tr>
                <td>Total Number of Households in the Barangay</td>
                <td>{{ $cra->generalPopulation->total_households ?? '0' }}</td>
            </tr>
            <tr>
                <td>Total Number of Families in the Barangay</td>
                <td>{{ $cra->generalPopulation->total_families ?? '0' }}</td>
            </tr>
        </tbody>
    </table>
    <p class="section-title">1. Population based on Gender/Sex</p>
    <table>
        <thead>
            <tr>
                <th>GENDER/SEX</th>
                <th>TOTAL NUMBER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Female</td>
                <td>{{ $populationGender['female']->quantity ?? '0' }}</td>
            </tr>
            <tr>
                <td>Male</td>
                <td>{{ $populationGender['male']->quantity ?? '0' }}</td>
            </tr>
            <tr>
                <td>Members of the LGBTQ+ Sector</td>
                <td>{{ $populationGender['lgbtq']->quantity ?? '0' }}</td>
            </tr>
        </tbody>
    </table>

    <p class="section-title">2. Population by Age Group</p>
    @include('cra.partials.age_group_table', ['ageGroups' => $cra->populationAgeGroups])

    <p class="section-title">3.Number of Houses according to Build (Materials Used)</p>
    @include('cra.partials.house_build', ['houseBuild' => $cra->houseBuild])

    <p class="section-title">4.Number of Houses according to Type of Ownership</p>
    @include('cra.partials.house_ownership', ['houseOwnership' => $cra->houseOwnership])

    <p class="section-title">B.Information on Livelihood</p>

    <p class="section-title">1.Primary Livelihood of Residents in the Barangay</p>
    @include('cra.partials.primary_livelihood', ['primaryLivelihood' => $cra->primaryLivelihood])

    <p class="section-title">C. Infrastructures and Institutions that provide services to the Barangay</p>
    @include('cra.partials.house_service', ['houseService' => $cra->houseService])

    <p class="section-title">D.Buildings and other Infrastructures in the Barangay</p>
    @include('cra.partials.infra_factory', ['infraFacility' => $cra->infraFacility])

    <p class="section-title">E.Primary Facilities and Services in the Barangay</p>
    @include('cra.partials.primary_facility', ['primaryFacility' => $cra->primaryFacility])
    @include('cra.partials.public_transportation', ['publicTransportation' => $cra->publicTransportation])

    <p class="section-title">Road Network</p>
    @include('cra.partials.road_network', ['roadNetwork' => $cra->roadNetwork])

    <p class="section-title">F. Inventory of Institutions, Sectors, and other Volunteer Groups in the Barangay</p>
    @include('cra.partials.institution_inventory', ['institutionInventory' => $cra->institutionInventory])

    <p class="section-title">G. Inventory of Human Resources</p>
    @include('cra.partials.human_resources', ['humanResources' => $cra->humanResources])


    <h3>I. PARTICIPATORY COMMUNITY RISK ASSESSMENT (PCRA)</h3>

    <p>The Participatory Community Risk Assessment (CRA) is a method of identifying risks or dangers that could be
        encountered, as well as the extent of damage, these risks may cause to the community. This is conducted
        through
        a collective inquiry of the strengths and opportunities present within the barangay to help lessen the risks
        and
        dangers.</p>

    <p class="section-title">Inclusions and Processes in the Participatory Community Risk Assessment (PCRA)</p>

    <p class="section-title">
        1. Identifying Calamities or Disasters in the Past Years and their impact to the Community
    </p>

    @include('cra.pcra.calamities', [
        'populationImpact' => $cra->populationImpact,
        'effectImpact' => $cra->effectImpact,
        'disasterDamage' => $cra->disasterDamage,
        'agriDamage' => $cra->agriDamage,
        'lifelines' => $cra->lifelines,
        'disasterOccurance' => $cra->disasterOccurance,
    ])

    <p class="section-title">
        2.Identifying Possible Risks or Dangers that could affect the Barangay
    </p>

    <div style="padding: 10px; background-color: #f3f3f3; border-bottom: 1px solid #000; font-size: 12px;">
        <h3 style="font-weight: bold; margin-bottom: 8px;">Legend</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tr>
                <!-- Probability Column -->
                <td style="vertical-align: top; padding-right: 20px;">
                    <p style="font-weight: bold; margin: 0 0 4px 0;">Probability</p>
                    <p style="margin: 0;">1 – Most Unlikely</p>
                    <p style="margin: 0;">2 – Low Probability</p>
                    <p style="margin: 0;">3 – Perhaps</p>
                    <p style="margin: 0;">4 – High Probability</p>
                    <p style="margin: 0;">5 – Almost Certain</p>
                </td>

                <!-- Effect Column -->
                <td style="vertical-align: top; padding-right: 20px;">
                    <p style="font-weight: bold; margin: 0 0 4px 0;">Effect</p>
                    <p style="margin: 0;">1 – Negligible</p>
                    <p style="margin: 0;">2 – Low Impact</p>
                    <p style="margin: 0;">3 – Maintain Impact</p>
                    <p style="margin: 0;">4 – High Impact</p>
                    <p style="margin: 0;">5 – Devastating</p>
                </td>

                <!-- Management Column -->
                <td style="vertical-align: top;">
                    <p style="font-weight: bold; margin: 0 0 4px 0;">Management</p>
                    <p style="margin: 0;">1 – Most Manageable</p>
                    <p style="margin: 0;">2 – Manageable</p>
                    <p style="margin: 0;">3 – Most Extensive</p>
                    <p style="margin: 0;">4 – Most Frequent</p>
                    <p style="margin: 0;">5 – Most Severe</p>
                </td>
            </tr>
        </table>
    </div>

    @include('cra.pcra.hazard_risk', ['hazardRisk' => $cra->hazardRisk])


    <p class="section-title">
        2.1 Public Health - Risk Assessment Matrix
    </p>
    @include('cra.pcra.asssesment_matrix', ['assessmentMatrix' => $cra->assessmentMatrix])


    {{-- cannot get the puroks data --}}
    <p class="section-title">
        3. Developing an exposure database of those that can be directly affected by risks and hazards
    </p>
    <p class="section-title">
        3.1 Population
    </p>
    @include('cra.pcra.population_exposure', ['populationExposure' => $cra->populationExposure])


    <p class="section-title">
        3.2 Detailed Number of Persons with Disabilities
    </p>
    @include('cra.pcra.detailed_disabilities', ['disabilityStatistic' => $cra->disabilityStatistic])

    <p class="section-title">
        3.3 Number of Families at Risk of Hazards and Disasters per Purok
    </p>
    @include('cra.pcra.family_at_risk', ['familyatRisk' => $cra->familyatRisk])


    <p class="section-title">
        3.4 Number of Persons with Illnesses or Communicable Diseases (Based on Data from the Health Center/CHO)
    </p>
    @include('cra.pcra.illnesses_statistic', ['illnessesStat' => $cra->illnessesStat])


    <p class="section-title">
        4. Effects of Hazards or Disasters
    </p>
    <p class="section-title">
        4.1 Number of Families and Individuals at Risk of Hazard per Purok based on the following categories:
    </p>
    @include('cra.pcra.disaster_risk_population', ['riskPopulation' => $cra->riskPopulation])

    <p class="section-title">
        4.2 Inventory of Equipment, Infrastructures, Establishments, Facilities and Livelihood that are at Risk during
        Hazards and Disasters
    </p>
    @include('cra.pcra.inventory_disaster', ['disasterInventory' => $cra->disasterInventory])

    <p class="section-title">
        5. List of Designated Evacuation Center and Temporary Isolation Facilities in the Barangay and City (whether
        owned by the government or private sector)
    </p>
    @include('cra.pcra.evacuationCenter', ['evacuationCenter' => $cra->evacuationCenter])


    <p class="section-title">
        6. Inventory of Evacuation Centers where Families can Relocate or Stay During Disasters
    </p>
    @include('cra.pcra.evacuation_inventory', ['evacuationInventory' => $cra->evacuationInventory])

    {{-- thead problem --}}
    <p class="section-title">
        7. List of Places/Areas where affected residents can evacuate during times of impending or current disaster
    </p>
    @include('cra.pcra.affected_areas', ['affectedArea' => $cra->affectedArea])


    <p class="section-title">
        8. List of Places/Areas where Sources of Livelihood can be evacuated
    </p>
    @include('cra.pcra.livelihood_evacuation', ['livelihoodEvacuation' => $cra->livelihoodEvacuation])


    <p class="section-title">
        9. Inventory of Prepositioned Food and Non-food Items
    </p>
    @include('cra.pcra.prepositioned_inventory', [
        'prepositionedInventory' => $cra->prepositionedInventory,
    ])

    <p class="section-title">
        10. List of Designated Evacuation Centers that will serve as Distribution Sites for Relief Goods (Food and
        Non-Food Items)
    </p>
    @include('cra.pcra.relief_distribution', [
        'reliefDistribution' => $cra->reliefDistribution,
    ])

    <p class="section-title">
        11.Distribution Process of Relief Goods to Affected Families and Individuals
    </p>
    @include('cra.pcra.distribution_process', ['distributionProcess' => $cra->distributionProcess])

    <p class="section-title">
        12.Inventory of Trainings Attended by the members of BDRRMC
    </p>
    @include('cra.pcra.bdrrmc_training', ['bdrrmcTraining' => $cra->bdrrmcTraining])

    <p class="section-title">
        13.Inventory of Response Equipment that can be utilized during Calamities and Disasters
    </p>
    @include('cra.pcra.equipment_inventory', ['equipmentInventory' => $cra->equipmentInventory])

    <p class="section-title">
        BDRRMC DIRECTORY
    </p>
    @include('cra.pcra.bdrrmc_directory', ['bdrrmcDirectory' => $cra->bdrrmcDirectory])

    <p class="section-title">
        BARANGAY EVACUATION PLAN
    </p>
    @include('cra.pcra.barangay_evacuation_plan', ['evacuationPlan' => $cra->evacuationPlan])
</body>

</html>

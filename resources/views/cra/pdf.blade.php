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
    <h4>BARANGAY {{ $cra->barangay->barangay_name ?? '_______________________' }}</h4>
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

    @include('cra.pcra.hazard_risk', ['hazardRisk' => $cra->hazardRisk])
</body>

</html>

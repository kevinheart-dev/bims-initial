<!DOCTYPE html>
<html>
<head>
    <title>Population Exposure Summary - ({{ $year }})</title>
    <style>
        body { font-family: sans-serif; font-size: 6px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 2px; font-size: 6px; }
        th, td { border: 1px solid #333; padding: 1px; text-align: center; }
        th { font-size: 5px; }

        /* Total Population column */
        th.total-population, td.total-population { background-color: #cce5ff; }

        /* Age group header and columns */
        th.age-header, td.age-col { font-size:5px; }

        /* Colors per age group */
        .age-0 { background-color: #f0f8ff; }
        .age-1 { background-color: #e6f2ff; }
        .age-2 { background-color: #d9f2d9; }
        .age-3 { background-color: #fff0b3; }
        .age-4 { background-color: #ffd9b3; }
        .age-5 { background-color: #f2d9ff; }
        .age-6 { background-color: #e6f7ff; }
        .age-7 { background-color: #ffe6e6; }
        .age-8 { background-color: #d9d9d9; }

        /* GRAND TOTAL row */
        tr.totals { background-color: #b3d9ff; font-weight: bold; font-size: 6px; }
    </style>
</head>
<body>
    <!-- Header with Logos -->
    <table style="width:100%; margin-bottom:4px; border:none;">
        <tr>
            <!-- Left Logo -->
            <td style="width:80px; border:none; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <!-- Center Text -->
            <td style="border:none; text-align:center; vertical-align:middle;">
                <div style="line-height:1.3; font-size:9px;">
                    <strong>Republic of the Philippines</strong><br>
                    <strong>CITY OF ILAGAN</strong><br>
                    <strong>Province of Isabela</strong><br>
                    <strong>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</strong><br>
                    CDRRMO Building, LGU Compound, Rizal Street, San Vicente, City of Ilagan, Isabela, 3300
                </div>
            </td>
            <!-- Right Logo -->
            <td style="width:80px; border:none; text-align:right;">
                <img src="{{ public_path('images/cdrrmo.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
        </tr>
    </table>

<h2 style="text-align:center;">POPULATION DATABASE</h2>
<table>
    <thead>
        <tr>
            <th rowspan="2">Barangay</th>
            <th rowspan="2" class="total-population">Total Barangay Population</th>
            <th rowspan="2">Total HH</th>
            <th rowspan="2">Total Families</th>
            <th rowspan="2">Female</th>
            <th rowspan="2">Male</th>
            <th rowspan="2">LGBTQ</th>

            @foreach($ageGroups as $index => $ageGroup)
                <th colspan="7" class="age-header age-{{ $index }}">{{ $ageGroup }}</th>
            @endforeach
        </tr>
        <tr>
        @foreach($ageGroups as $index => $ageGroup)
            <th class="age-col age-{{ $index }}">Male w/o dis</th>
            <th class="age-col age-{{ $index }}">Male w/ dis</th>
            <th class="age-col age-{{ $index }}">Female w/o dis</th>
            <th class="age-col age-{{ $index }}">Female w/ dis</th>
            <th class="age-col age-{{ $index }}">LGBTQ w/o dis</th>
            <th class="age-col age-{{ $index }}">LGBTQ w/ dis</th>
            <th class="age-col age-{{ $index }}">Total</th>
        @endforeach
        </tr>
    </thead>
    <tbody>
        @php
            $grandTotals = [
                'population' => 0,
                'households' => 0,
                'families' => 0,
                'female' => 0,
                'male' => 0,
                'lgbtq' => 0,
                'ageGroups' => []
            ];
        @endphp

        @foreach($grouped as $barangayName => $data)
            @php
                $grandTotals['population'] += $data['total_population'];
                $grandTotals['households'] += $data['total_households'];
                $grandTotals['families'] += $data['total_families'];
                $grandTotals['female'] += $data['gender']['female'];
                $grandTotals['male'] += $data['gender']['male'];
                $grandTotals['lgbtq'] += $data['gender']['lgbtq'];
            @endphp
            <tr>
                <td>{{ $barangayName }}</td>
                <td class="total-population">{{ $data['total_population'] }}</td>
                <td>{{ $data['total_households'] }}</td>
                <td>{{ $data['total_families'] }}</td>
                <td>{{ $data['gender']['female'] }}</td>
                <td>{{ $data['gender']['male'] }}</td>
                <td>{{ $data['gender']['lgbtq'] }}</td>

                @foreach($ageGroups as $ageGroup)
                    @php
                        $ag = $data['age_groups'][$ageGroup] ?? [
                            'male_without_disability'=>0,'male_with_disability'=>0,
                            'female_without_disability'=>0,'female_with_disability'=>0,
                            'lgbtq_without_disability'=>0,'lgbtq_with_disability'=>0,
                            'total'=>0
                        ];
                        if(!isset($grandTotals['ageGroups'][$ageGroup])){
                            $grandTotals['ageGroups'][$ageGroup] = [
                                'male_without_disability'=>0,'male_with_disability'=>0,
                                'female_without_disability'=>0,'female_with_disability'=>0,
                                'lgbtq_without_disability'=>0,'lgbtq_with_disability'=>0,
                                'total'=>0
                            ];
                        }
                        foreach($ag as $key=>$val){
                            $grandTotals['ageGroups'][$ageGroup][$key] += $val;
                        }
                    @endphp
                    <td>{{ $ag['male_without_disability'] }}</td>
                    <td>{{ $ag['male_with_disability'] }}</td>
                    <td>{{ $ag['female_without_disability'] }}</td>
                    <td>{{ $ag['female_with_disability'] }}</td>
                    <td>{{ $ag['lgbtq_without_disability'] }}</td>
                    <td>{{ $ag['lgbtq_with_disability'] }}</td>
                    <td class="age-col age-{{ $index }}">{{ $ag['total'] }}</td>
                @endforeach
            </tr>
        @endforeach

        <tr class="totals">
            <td><strong>GRAND TOTAL</strong></td>
            <td>{{ $grandTotals['population'] }}</td>
            <td>{{ $grandTotals['households'] }}</td>
            <td>{{ $grandTotals['families'] }}</td>
            <td>{{ $grandTotals['female'] }}</td>
            <td>{{ $grandTotals['male'] }}</td>
            <td>{{ $grandTotals['lgbtq'] }}</td>

            @foreach($ageGroups as $index => $ageGroup)
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['male_without_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['male_with_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['female_without_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['female_with_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['lgbtq_without_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['lgbtq_with_disability'] }}</td>
                <td>{{ $grandTotals['ageGroups'][$ageGroup]['total'] }}</td>
            @endforeach
        </tr>
    </tbody>
</table>
@php
$totalPWD = 0;
$totalPWD_male = 0;
$totalPWD_female = 0;
$totalPWD_lgbtq = 0;

foreach($grandTotals['ageGroups'] as $ageGroupData) {
    $totalPWD += ($ageGroupData['male_with_disability'] ?? 0)
               + ($ageGroupData['female_with_disability'] ?? 0)
               + ($ageGroupData['lgbtq_with_disability'] ?? 0);

    $totalPWD_male += $ageGroupData['male_with_disability'] ?? 0;
    $totalPWD_female += $ageGroupData['female_with_disability'] ?? 0;
    $totalPWD_lgbtq += $ageGroupData['lgbtq_with_disability'] ?? 0;
}
@endphp

<p style="font-size:10px; text-align:justify; line-height:1.4;">
    <strong>(This is a Community-Based Risk Assessment submitted by the 91 Barangays and consolidated by the City Disaster Risk Reduction and Management Office (CDRRMO) during the QAS BDRRM Planning 2022.)</strong>
</p>
        <br><br><br>
<p style="font-size:12px; text-align:justify; line-height:1.4;">
    <strong>SUMMARY OF FINDINGS:</strong>
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    1.&nbsp; The City of Ilagan’s population as of <strong>{{ $year }}</strong> reached a total of <strong>{{ number_format($grandTotals['population']) }}</strong> individuals, composed of <strong>female</strong>, <strong>male</strong>, and <strong>LGBTQ</strong> population groups. This demographic distribution provides the baseline for understanding the city’s exposure to hazards and the allocation of preparedness resources.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    2.&nbsp; The City of Ilagan recorded a total of <strong>{{ number_format($grandTotals['households']) }}</strong> households, serving as home to <strong>{{ number_format($grandTotals['families']) }}</strong> families across its 91 barangays. This data highlights the scale of residential exposure and potential impact during emergencies.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    3.&nbsp; The <strong>male population</strong> remains the largest demographic group, comprising <strong>{{ number_format($grandTotals['male']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['male'] / $grandTotals['population']) * 100, 2) }}%</strong> of the total population. This is followed closely by the <strong>female population</strong> with <strong>{{ number_format($grandTotals['female']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['female'] / $grandTotals['population']) * 100, 2) }}%</strong>. The <strong>LGBTQ sector</strong> accounts for <strong>{{ number_format($grandTotals['lgbtq']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['lgbtq'] / $grandTotals['population']) * 100, 2) }}%</strong>.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    4.&nbsp; Among the age groups, individuals aged <strong>18–59 years old</strong> constitute the highest proportion with <strong>{{ number_format($grandTotals['ageGroups']['18_to_59_yrs']['total']) }}</strong> persons or approximately <strong>{{ number_format(($grandTotals['ageGroups']['18_to_59_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%</strong> of the total population. This is followed by:
    <br>&nbsp;&nbsp;&nbsp;• <strong>6–12 years old</strong> – {{ number_format($grandTotals['ageGroups']['6_to_12_yrs']['total']) }} ({{ number_format(($grandTotals['ageGroups']['6_to_12_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>60 years old and above</strong> – {{ number_format($grandTotals['ageGroups']['60_plus_yrs']['total']) }} ({{ number_format(($grandTotals['ageGroups']['60_plus_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>13–17 years old</strong> – {{ number_format($grandTotals['ageGroups']['13_to_17_yrs']['total']) }} ({{ number_format(($grandTotals['ageGroups']['13_to_17_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>3–5 years old</strong> – {{ number_format($grandTotals['ageGroups']['3_to_5_yrs']['total']) }} ({{ number_format(($grandTotals['ageGroups']['3_to_5_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>7 months to 2 years old</strong> – {{ number_format($grandTotals['ageGroups']['7_mos_to_2_yrs']['total']) }} ({{ number_format(($grandTotals['ageGroups']['7_mos_to_2_yrs']['total'] / $grandTotals['population']) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>0–6 months</strong> – {{ number_format($grandTotals['ageGroups']['0_6_mos']['total']) }} ({{ number_format(($grandTotals['ageGroups']['0_6_mos']['total'] / $grandTotals['population']) * 100, 2) }}%)
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    5.&nbsp; A total of <strong>{{ number_format($totalPWD) }}</strong> individuals, or <strong>{{ number_format(($totalPWD / $grandTotals['population']) * 100, 2) }}%</strong> of the city’s population, were identified as persons with disabilities (PWD). Of this sector, males account for <strong>{{ number_format($totalPWD_male) }}</strong> individuals ({{ number_format(($totalPWD_male / $grandTotals['population']) * 100, 2) }}%), while females comprise <strong>{{ number_format($totalPWD_female) }}</strong> individuals ({{ number_format(($totalPWD_female / $grandTotals['population']) * 100, 2) }}%).
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    6.&nbsp; The <strong>18–59 age group</strong> also constitutes the largest portion of the PWD population, with <strong>{{ number_format($grandTotals['ageGroups']['18_to_59_yrs']['male_with_disability'] + $grandTotals['ageGroups']['18_to_59_yrs']['female_with_disability'] + $grandTotals['ageGroups']['18_to_59_yrs']['lgbtq_with_disability']) }}</strong> individuals or <strong>{{ number_format((($grandTotals['ageGroups']['18_to_59_yrs']['male_with_disability'] + $grandTotals['ageGroups']['18_to_59_yrs']['female_with_disability'] + $grandTotals['ageGroups']['18_to_59_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%</strong> of the entire PWD population. This is followed by:
    <br>&nbsp;&nbsp;&nbsp;• <strong>60 years old and above</strong> – {{ number_format($grandTotals['ageGroups']['60_plus_yrs']['male_with_disability'] + $grandTotals['ageGroups']['60_plus_yrs']['female_with_disability'] + $grandTotals['ageGroups']['60_plus_yrs']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['60_plus_yrs']['male_with_disability'] + $grandTotals['ageGroups']['60_plus_yrs']['female_with_disability'] + $grandTotals['ageGroups']['60_plus_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>6–12 years old</strong> – {{ number_format($grandTotals['ageGroups']['6_to_12_yrs']['male_with_disability'] + $grandTotals['ageGroups']['6_to_12_yrs']['female_with_disability'] + $grandTotals['ageGroups']['6_to_12_yrs']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['6_to_12_yrs']['male_with_disability'] + $grandTotals['ageGroups']['6_to_12_yrs']['female_with_disability'] + $grandTotals['ageGroups']['6_to_12_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>13–17 years old</strong> – {{ number_format($grandTotals['ageGroups']['13_to_17_yrs']['male_with_disability'] + $grandTotals['ageGroups']['13_to_17_yrs']['female_with_disability'] + $grandTotals['ageGroups']['13_to_17_yrs']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['13_to_17_yrs']['male_with_disability'] + $grandTotals['ageGroups']['13_to_17_yrs']['female_with_disability'] + $grandTotals['ageGroups']['13_to_17_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>3–5 years old</strong> – {{ number_format($grandTotals['ageGroups']['3_to_5_yrs']['male_with_disability'] + $grandTotals['ageGroups']['3_to_5_yrs']['female_with_disability'] + $grandTotals['ageGroups']['3_to_5_yrs']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['3_to_5_yrs']['male_with_disability'] + $grandTotals['ageGroups']['3_to_5_yrs']['female_with_disability'] + $grandTotals['ageGroups']['3_to_5_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>0–6 months</strong> – {{ number_format($grandTotals['ageGroups']['0_6_mos']['male_with_disability'] + $grandTotals['ageGroups']['0_6_mos']['female_with_disability'] + $grandTotals['ageGroups']['0_6_mos']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['0_6_mos']['male_with_disability'] + $grandTotals['ageGroups']['0_6_mos']['female_with_disability'] + $grandTotals['ageGroups']['0_6_mos']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
    <br>&nbsp;&nbsp;&nbsp;• <strong>7 months to 2 years old</strong> – {{ number_format($grandTotals['ageGroups']['7_mos_to_2_yrs']['male_with_disability'] + $grandTotals['ageGroups']['7_mos_to_2_yrs']['female_with_disability'] + $grandTotals['ageGroups']['7_mos_to_2_yrs']['lgbtq_with_disability']) }} ({{ number_format((($grandTotals['ageGroups']['7_mos_to_2_yrs']['male_with_disability'] + $grandTotals['ageGroups']['7_mos_to_2_yrs']['female_with_disability'] + $grandTotals['ageGroups']['7_mos_to_2_yrs']['lgbtq_with_disability']) / $totalPWD) * 100, 2) }}%)
</p>

</body>
</html>


{{-- dynamic shit

@php
    // Compute total PWD per gender
    $totalPWD = 0;
    $totalPWD_male = 0;
    $totalPWD_female = 0;

    foreach($grandTotals['ageGroups'] as $ag) {
        $pwdsInGroup = ($ag['male_with_disability'] ?? 0) + ($ag['female_with_disability'] ?? 0) + ($ag['lgbtq_with_disability'] ?? 0);
        $totalPWD += $pwdsInGroup;
        $totalPWD_male += $ag['male_with_disability'] ?? 0;
        $totalPWD_female += $ag['female_with_disability'] ?? 0;
    }

    // Optional: order age groups by some predefined order for display
    $ageGroupOrder = [
        '0_6_mos', '7_mos_to_2_yrs', '3_to_5_yrs', '6_to_12_yrs',
        '13_to_17_yrs', '18_to_59_yrs', '60_plus_yrs'
    ];
@endphp

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    1.&nbsp; The City of Ilagan’s population as of <strong>{{ $year }}</strong> reached a total of <strong>{{ number_format($grandTotals['population']) }}</strong> individuals, composed of <strong>female</strong>, <strong>male</strong>, and <strong>LGBTQ</strong> population groups. This demographic distribution provides the baseline for understanding the city’s exposure to hazards and the allocation of preparedness resources.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    2.&nbsp; The City of Ilagan recorded a total of <strong>{{ number_format($grandTotals['households']) }}</strong> households, serving as home to <strong>{{ number_format($grandTotals['families']) }}</strong> families across its 91 barangays. This data highlights the scale of residential exposure and potential impact during emergencies.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    3.&nbsp; The <strong>male population</strong> remains the largest demographic group, comprising <strong>{{ number_format($grandTotals['male']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['male'] / $grandTotals['population']) * 100, 2) }}%</strong> of the total population. This is followed closely by the <strong>female population</strong> with <strong>{{ number_format($grandTotals['female']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['female'] / $grandTotals['population']) * 100, 2) }}%</strong>. The <strong>LGBTQ sector</strong> accounts for <strong>{{ number_format($grandTotals['lgbtq']) }}</strong> individuals or <strong>{{ number_format(($grandTotals['lgbtq'] / $grandTotals['population']) * 100, 2) }}%</strong>.
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    4.&nbsp; Among the age groups, the breakdown is as follows:
    <br>
    @foreach($ageGroupOrder as $agKey)
        @php
            $totalInGroup = $grandTotals['ageGroups'][$agKey]['total'] ?? 0;
            $percentInGroup = $grandTotals['population'] > 0 ? ($totalInGroup / $grandTotals['population']) * 100 : 0;
        @endphp
        &nbsp;&nbsp;&nbsp;• <strong>{{ str_replace('_', ' ', $agKey) }}</strong> – {{ number_format($totalInGroup) }} ({{ number_format($percentInGroup, 2) }}%)
        <br>
    @endforeach
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    5.&nbsp; A total of <strong>{{ number_format($totalPWD) }}</strong> individuals, or <strong>{{ number_format(($totalPWD / $grandTotals['population']) * 100, 2) }}%</strong> of the city’s population, were identified as persons with disabilities (PWD). Of this sector, males account for <strong>{{ number_format($totalPWD_male) }}</strong> individuals ({{ number_format(($totalPWD_male / $grandTotals['population']) * 100, 2) }}%), while females comprise <strong>{{ number_format($totalPWD_female) }}</strong> individuals ({{ number_format(($totalPWD_female / $grandTotals['population']) * 100, 2) }}%).
</p>

<p style="font-size:11px; text-align:justify; line-height:1.4;">
    6.&nbsp; PWD distribution across age groups:
    <br>
    @foreach($ageGroupOrder as $agKey)
        @php
            $malePWD = $grandTotals['ageGroups'][$agKey]['male_with_disability'] ?? 0;
            $femalePWD = $grandTotals['ageGroups'][$agKey]['female_with_disability'] ?? 0;
            $lgbtqPWD = $grandTotals['ageGroups'][$agKey]['lgbtq_with_disability'] ?? 0;
            $groupPWD = $malePWD + $femalePWD + $lgbtqPWD;
            $percentPWD = $totalPWD > 0 ? ($groupPWD / $totalPWD) * 100 : 0;
        @endphp
        &nbsp;&nbsp;&nbsp;• <strong>{{ str_replace('_', ' ', $agKey) }}</strong> – {{ number_format($groupPWD) }} ({{ number_format($percentPWD, 2) }}%)
        <br>
    @endforeach
</p>

--}}

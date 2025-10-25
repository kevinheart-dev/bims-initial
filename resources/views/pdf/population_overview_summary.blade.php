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

    <h2>POPULATION DATABASE</h2>
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
</body>
</html>

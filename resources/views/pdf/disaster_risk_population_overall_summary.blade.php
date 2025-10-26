<!DOCTYPE html>
<html>
<head>
    <title>Overall Disaster Risk Population Summary - {{ $year }}</title>
    <style>
        body { font-family: sans-serif; font-size: 6px; margin: 0; } /* smaller base font */
        table { width: 100%; border-collapse: collapse; margin-top: 2px; }
        th, td { border: 1px solid #333; padding: 1px; text-align: center; font-size: 5.5px; } /* smaller table text */
        th { background: #eee; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 8px; text-transform: uppercase; margin-bottom: 2px; }
        h3 { font-size: 6px; margin-bottom: 2px; }

        .totals { font-weight: bold; background: #FFE5B4; font-size: 6px; }

        /* Base color themes per hazard */
        .flood-header { background-color: #b3e5fc; }
        .landslide-header { background-color: #d7ccc8; }
        .earthquake-header { background-color: #cfd8dc; }
        .fire-header { background-color: #ffcdd2; }
        .typhoon-header { background-color: #c8e6c9; }

        /* Risk level color shades */
        .low-risk { background-color: #DCEDC8; }
        .medium-risk { background-color: #FFF9C4; }
        .high-risk { background-color: #FFCDD2; }
    </style>
</head>
<body>
    <!-- Header -->
    <table style="width:100%; margin-bottom:4px; border:none;">
        <tr>
            <td style="width:80px; border:none; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <td style="border:none; text-align:center; vertical-align:middle;">
                <div style="line-height:1.3; font-size:9px;">
                    <strong>Republic of the Philippines</strong><br>
                    <strong>CITY OF ILAGAN</strong><br>
                    <strong>Province of Isabela</strong><br>
                    <strong>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</strong><br>
                    CDRRMO Building, LGU Compound, Rizal Street, San Vicente, City of Ilagan, Isabela, 3300
                </div>
            </td>
            <td style="width:80px; border:none; text-align:right;">
                <img src="{{ public_path('images/cdrrmo.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
        </tr>
    </table>

    <h2 style="font-size:9px; margin-bottom:2px;">Overall Disaster Risk Population Summary</h2>
    <h1 style="font-size:8px; margin-top:0; text-align:center;">
        Community Risk Assessment ({{ $year }})
    </h1>

    <table>
        <thead>
            <tr>
                <th rowspan="2">Barangay</th>

                <!-- Dynamic hazard headers -->
                @foreach ($hazards as $hazard)
                    @php
                        $hazardClass = strtolower($hazard) . '-header';
                    @endphp
                    <th colspan="6" class="{{ $hazardClass }}">
                        {{ strtoupper($hazard) }}
                    </th>
                @endforeach

                <th rowspan="2" class="totals">Total Families</th>
                <th rowspan="2" class="totals">Total Individuals</th>
            </tr>

            <tr>
                @foreach ($hazards as $hazard)
                    <th class="low-risk">Low Fam</th>
                    <th class="low-risk">Low Ind</th>
                    <th class="medium-risk">Medium Fam</th>
                    <th class="medium-risk">Medium Ind</th>
                    <th class="high-risk">High Fam</th>
                    <th class="high-risk">High Ind</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotals = [];
                foreach ($hazards as $hazard) {
                    $grandTotals[$hazard] = [
                        'low_families' => 0,
                        'low_individuals' => 0,
                        'medium_families' => 0,
                        'medium_individuals' => 0,
                        'high_families' => 0,
                        'high_individuals' => 0,
                    ];
                }
                $grandTotalFamilies = 0;
                $grandTotalIndividuals = 0;
            @endphp

            @foreach ($data as $barangay => $hazardData)
                @php
                    $barangayFamilies = 0;
                    $barangayIndividuals = 0;
                @endphp
                <tr>
                    <td>{{ $barangay }}</td>

                    @foreach ($hazards as $hazard)
                        @php
                            $values = $hazardData[$hazard] ?? [
                                'low_families' => 0, 'low_individuals' => 0,
                                'medium_families' => 0, 'medium_individuals' => 0,
                                'high_families' => 0, 'high_individuals' => 0,
                            ];

                            $barangayFamilies += $values['low_families'] + $values['medium_families'] + $values['high_families'];
                            $barangayIndividuals += $values['low_individuals'] + $values['medium_individuals'] + $values['high_individuals'];

                            $grandTotals[$hazard]['low_families'] += $values['low_families'];
                            $grandTotals[$hazard]['low_individuals'] += $values['low_individuals'];
                            $grandTotals[$hazard]['medium_families'] += $values['medium_families'];
                            $grandTotals[$hazard]['medium_individuals'] += $values['medium_individuals'];
                            $grandTotals[$hazard]['high_families'] += $values['high_families'];
                            $grandTotals[$hazard]['high_individuals'] += $values['high_individuals'];
                        @endphp

                        <td class="low-risk">{{ $values['low_families'] }}</td>
                        <td class="low-risk">{{ $values['low_individuals'] }}</td>
                        <td class="medium-risk">{{ $values['medium_families'] }}</td>
                        <td class="medium-risk">{{ $values['medium_individuals'] }}</td>
                        <td class="high-risk">{{ $values['high_families'] }}</td>
                        <td class="high-risk">{{ $values['high_individuals'] }}</td>
                    @endforeach

                    <td class="totals">{{ $barangayFamilies }}</td>
                    <td class="totals">{{ $barangayIndividuals }}</td>

                    @php
                        $grandTotalFamilies += $barangayFamilies;
                        $grandTotalIndividuals += $barangayIndividuals;
                    @endphp
                </tr>
            @endforeach

            <!-- Grand Total Row -->
            <tr>
                <td><strong>GRAND TOTAL</strong></td>
                @foreach ($hazards as $hazard)
                    <td>{{ $grandTotals[$hazard]['low_families'] }}</td>
                    <td>{{ $grandTotals[$hazard]['low_individuals'] }}</td>
                    <td>{{ $grandTotals[$hazard]['medium_families'] }}</td>
                    <td>{{ $grandTotals[$hazard]['medium_individuals'] }}</td>
                    <td>{{ $grandTotals[$hazard]['high_families'] }}</td>
                    <td>{{ $grandTotals[$hazard]['high_individuals'] }}</td>
                @endforeach
                <td>{{ $grandTotalFamilies }}</td>
                <td>{{ $grandTotalIndividuals }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>

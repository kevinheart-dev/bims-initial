<!DOCTYPE html>
<html>
<head>
    <title>Disaster Risk Population Summary Per Hazard - {{ $year }}</title>
    <style>
        body { font-family: sans-serif; font-size: 8px; margin: 0; } /* larger base font */
        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 4px; text-align: center; font-size: 7px; }
        th { background: #eee; }
        h1, h2, h3 { text-align: center; margin: 0; }
        h1 { font-size: 14px; text-transform: uppercase; margin-bottom: 4px; }
        h2 { font-size: 12px; margin-bottom: 2px; }
        h3 { font-size: 10px; margin-bottom: 4px; }

        .totals { font-weight: bold; background: #FFE5B4; font-size: 7px; }

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
    <table style="width:100%; margin-bottom:6px; border:none;">
        <tr>
            <td style="width:80px; border:none; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <td style="border:none; text-align:center; vertical-align:middle;">
                <div style="line-height:1.3; font-size:10px;">
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

    <h1>Disaster Risk Population Summary Per Hazard</h1>
    <h2>Community Risk Assessment ({{ $year }})</h2>

    <h3 class="{{ $hazardClass }}" style="margin-top:8px; text-transform:uppercase; padding:4px;">
        {{ strtoupper($hazard) }}
    </h3>

    <table>
        <thead>
            <tr>
                <th>Barangay</th>
                <th>Low Families</th>
                <th>Low Individuals</th>
                <th>Medium Families</th>
                <th>Medium Individuals</th>
                <th>High Families</th>
                <th>High Individuals</th>
                <th>Total Families</th>
                <th>Total Individuals</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandLowFam = 0;
                $grandLowInd = 0;
                $grandMedFam = 0;
                $grandMedInd = 0;
                $grandHighFam = 0;
                $grandHighInd = 0;
                $grandTotalFam = 0;
                $grandTotalInd = 0;
            @endphp

            @foreach ($barangays as $barangay => $values)
                <tr>
                    <td>{{ $barangay }}</td>
                    <td class="low-risk">{{ $values['low_families'] }}</td>
                    <td class="low-risk">{{ $values['low_individuals'] }}</td>
                    <td class="medium-risk">{{ $values['medium_families'] }}</td>
                    <td class="medium-risk">{{ $values['medium_individuals'] }}</td>
                    <td class="high-risk">{{ $values['high_families'] }}</td>
                    <td class="high-risk">{{ $values['high_individuals'] }}</td>
                    <td>{{ $values['total_families'] }}</td>
                    <td>{{ $values['total_individuals'] }}</td>

                    @php
                        $grandLowFam += $values['low_families'];
                        $grandLowInd += $values['low_individuals'];
                        $grandMedFam += $values['medium_families'];
                        $grandMedInd += $values['medium_individuals'];
                        $grandHighFam += $values['high_families'];
                        $grandHighInd += $values['high_individuals'];
                        $grandTotalFam += $values['total_families'];
                        $grandTotalInd += $values['total_individuals'];
                    @endphp
                </tr>
            @endforeach

            <!-- Grand Total Row -->
            <tr class="totals">
                <td><strong>GRAND TOTAL</strong></td>
                <td class="low-risk">{{ $grandLowFam }}</td>
                <td class="low-risk">{{ $grandLowInd }}</td>
                <td class="medium-risk">{{ $grandMedFam }}</td>
                <td class="medium-risk">{{ $grandMedInd }}</td>
                <td class="high-risk">{{ $grandHighFam }}</td>
                <td class="high-risk">{{ $grandHighInd }}</td>
                <td>{{ $grandTotalFam }}</td>
                <td>{{ $grandTotalInd }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>

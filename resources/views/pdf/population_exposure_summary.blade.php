<!DOCTYPE html>
<html>
<head>
    <title>Population Exposure Summary - {{ $hazardName }} ({{ $year }})</title>
    <style>
        body { font-family: sans-serif; font-size: 8px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 1.5px; text-align: center; }
        th { background: #eee; font-size: 7.5px; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 9px; margin-bottom: 6px; }

        .totals { font-weight: bold; background: #FFE5B4; font-size: 8px; }

        /* Light pastel colors per Purok */
        .purok-1 { background-color: #fff9c4; } /* Light Yellow */
        .purok-2 { background-color: #dcedc8; } /* Light Green */
        .purok-3 { background-color: #bbdefb; } /* Light Blue */
        .purok-4 { background-color: #e1bee7; } /* Light Violet */
        .purok-5 { background-color: #ffe0b2; } /* Light Orange */
        .purok-6 { background-color: #c8e6c9; } /* Mint Green */
        .purok-7 { background-color: #d1c4e9; } /* Soft Lavender */
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

    <h2>{{ $hazardName }} - Community Risk Assessment</h2>

    <!-- Population Table -->
    <table>
        <thead>
            <tr>
                <th colspan="{{ 1 + (7*5) + 2 }}" style="background-color:#FFD580;">
                    <strong>{{ strtoupper($hazardName) }}</strong>
                </th>
            </tr>
            <tr>
                <th rowspan="2">Barangay</th>
                @for ($i = 1; $i <= 7; $i++)
                    <th colspan="5" class="purok-{{ $i }}">Purok {{ $i }}</th>
                @endfor
                <th rowspan="2" class="totals">Total Families</th>
                <th rowspan="2" class="totals">Total Individuals</th>
            </tr>
            <tr>
                @for ($i = 1; $i <= 7; $i++)
                    <th class="purok-{{ $i }}">Families</th>
                    <th class="purok-{{ $i }}">Male</th>
                    <th class="purok-{{ $i }}">Female</th>
                    <th class="purok-{{ $i }}">LGBTQ</th>
                    <th class="purok-{{ $i }}">Total</th>
                @endfor
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotalFamilies = 0;
                $grandTotalIndividuals = 0;
                $grandPuroks = [];
                for ($i = 1; $i <= 7; $i++) {
                    $grandPuroks[$i] = ['families'=>0,'male'=>0,'female'=>0,'lgbtq'=>0];
                }
            @endphp

            @foreach ($grouped as $barangay => $puroks)
                @php
                    $barangayTotalFamilies = 0;
                    $barangayTotalIndividuals = 0;
                @endphp
                <tr>
                    <td>{{ $barangay }}</td>
                    @foreach ($puroks as $index => $purok)
                        @php
                            $purokTotal = $purok['male'] + $purok['female'] + $purok['lgbtq'];
                            $barangayTotalFamilies += $purok['families'];
                            $barangayTotalIndividuals += $purokTotal;

                            $grandPuroks[$index]['families'] += $purok['families'];
                            $grandPuroks[$index]['male'] += $purok['male'];
                            $grandPuroks[$index]['female'] += $purok['female'];
                            $grandPuroks[$index]['lgbtq'] += $purok['lgbtq'];
                        @endphp
                        <td class="purok-{{ $index }}">{{ $purok['families'] }}</td>
                        <td class="purok-{{ $index }}">{{ $purok['male'] }}</td>
                        <td class="purok-{{ $index }}">{{ $purok['female'] }}</td>
                        <td class="purok-{{ $index }}">{{ $purok['lgbtq'] }}</td>
                        <td class="purok-{{ $index }} totals">{{ $purokTotal }}</td>
                    @endforeach
                    <td class="totals">{{ $barangayTotalFamilies }}</td>
                    <td class="totals">{{ $barangayTotalIndividuals }}</td>

                    @php
                        $grandTotalFamilies += $barangayTotalFamilies;
                        $grandTotalIndividuals += $barangayTotalIndividuals;
                    @endphp
                </tr>
            @endforeach

            <!-- Grand Total Row -->
            <tr>
                <td><strong>GRAND TOTAL</strong></td>
                @for ($i = 1; $i <= 7; $i++)
                    @php $totalPurok = $grandPuroks[$i]['male'] + $grandPuroks[$i]['female'] + $grandPuroks[$i]['lgbtq']; @endphp
                    <td>{{ $grandPuroks[$i]['families'] }}</td>
                    <td>{{ $grandPuroks[$i]['male'] }}</td>
                    <td>{{ $grandPuroks[$i]['female'] }}</td>
                    <td>{{ $grandPuroks[$i]['lgbtq'] }}</td>
                    <td>{{ $totalPurok }}</td>
                @endfor
                <td>{{ $grandTotalFamilies }}</td>
                <td>{{ $grandTotalIndividuals }}</td>
            </tr>
        </tbody>
    </table>
    <br><br>

    <p style="font-size:10px; text-align:justify; line-height:1.4;">
        <strong>(This is a Community-Based Assessment submitted by the 91 Barangays and consolidated by the City Disaster Risk Reduction and Management Office (CDRRMO) during the QAS BDRRM Planning 2022.)</strong>
    </p>

    <p style="font-size:12px; text-align:justify; line-height:1.4;"><strong>SUMMARY OF FINDINGS:</strong></p>

    <p style="font-size:11px; text-align:justify; line-height:1.4;">
        1. The table above presents the population distribution per barangay in the City of Ilagan, broken down by Purok, showing the number of families and individuals who may be affected or have been affected by &nbsp;&nbsp; <strong>{{ $hazardName }}</strong>. This information supports the community’s risk assessment, preparedness planning, and response prioritization.
    </p>

    <p style="font-size:11px; text-align:justify; line-height:1.4;">
        2. Across the 91 barangays of the City of Ilagan, a total of &nbsp;<strong>{{ number_format($grandTotalFamilies) }}</strong> families or &nbsp;<strong>{{ number_format($grandTotalIndividuals) }}</strong> individuals were reported as potentially exposed to &nbsp; <strong>{{ $hazardName }}</strong>. This represents a significant portion of the city's population and highlights the extent of vulnerability in the affected communities.
    </p>

    <p style="font-size:11px; text-align:justify; line-height:1.4;">
        3. Barangays assessed to be highly at risk include those within the Poblacion Cluster, barangays with direct access to neighboring areas, those located along provincial and national roads, and barangays with concentrated business establishments and government offices. These areas experience higher population density and mobility, increasing their likelihood of being significantly impacted by &nbsp; <strong>{{ $hazardName }}</strong>.
    </p>

</body>
</html>

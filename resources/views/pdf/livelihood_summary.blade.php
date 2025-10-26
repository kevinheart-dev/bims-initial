<!DOCTYPE html>
<html>
<head>
    <title>Overall Livelihood Summary - ({{ $year }})</title>
    <style>
        body { font-family: sans-serif; font-size: 8px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 1.5px; text-align: center; }
        th { background: #eee; font-size: 7.5px; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 9px; margin-bottom: 6px; }
        .totals { font-weight: bold; background: #FFE5B4; font-size: 8px; }
        td:first-child { text-align: left; width: 12%; }
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

    <title>Overall Livelihood Summary - ({{ $year }})</title>

<!-- Livelihood Summary Table -->
    <table>
        <thead>
            <tr>
                <th rowspan="2">Barangay</th>
                @foreach ($livelihoodTypes as $type)
                    <th colspan="6">{{ $type }}</th>
                @endforeach
                <th rowspan="2">Total</th>
            </tr>
            <tr>
                @foreach ($livelihoodTypes as $type)
                    <th>M w/o</th>
                    <th>M w/</th>
                    <th>F w/o</th>
                    <th>F w/</th>
                    <th>LGBTQ w/o</th>
                    <th>LGBTQ w/</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($barangayRows as $row)
                <tr class="{{ $row['barangay_name'] === 'TOTAL' ? 'totals' : '' }}">
                    <td>{{ $row['barangay_name'] }}</td>
                    @foreach ($livelihoodTypes as $type)
                        <td>{{ $row[$type]['male_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$type]['male_with_disability'] ?? 0 }}</td>
                        <td>{{ $row[$type]['female_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$type]['female_with_disability'] ?? 0 }}</td>
                        <td>{{ $row[$type]['lgbtq_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$type]['lgbtq_with_disability'] ?? 0 }}</td>
                    @endforeach
                    <td>{{ $row['total'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

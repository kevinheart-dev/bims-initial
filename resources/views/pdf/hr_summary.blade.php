<!DOCTYPE html>
<html>
<head>
    <title>Human Resources Summary - {{ $year }}</title>
    <style>
        body { font-family: sans-serif; font-size: 8px; margin: 0; }

        /* Main data table styles */
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        table.data-table th,
        table.data-table td {
            border: 1px solid #333;
            padding: 2px;
            text-align: center;
            vertical-align: middle;
        }

        table.data-table th {
            background: #eee;
            font-size: 7.5px;
        }

        h2 {
            text-align: center;
            font-size: 11px;
            text-transform: uppercase;
            margin: 0 0 4px 0;
        }

        .totals {
            font-weight: bold;
            background: #FFE5B4;
            font-size: 8px;
        }

        td:first-child {
            text-align: left;
            width: 15%;
        }

        td:nth-child(n+2), th:nth-child(n+2) {
            width: 10%;
        }

        th.resource {
            width: 20%;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Header with Logos -->
    <table style="width:100%; margin-bottom:4px;">
        <tr>
            <td style="width:80px; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <td style="text-align:center; vertical-align:middle;">
                <div style="line-height:1.3; font-size:9px;">
                    <strong>Republic of the Philippines</strong><br>
                    <strong>CITY OF ILAGAN</strong><br>
                    <strong>Province of Isabela</strong><br>
                    <strong>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</strong><br>
                    CDRRMO Building, LGU Compound, Rizal Street, San Vicente, City of Ilagan, Isabela, 3300
                </div>
            </td>
            <td style="width:80px; text-align:right;">
                <img src="{{ public_path('images/cdrrmo.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
        </tr>
    </table>

    <h2>HUMAN RESOURCES SUMMARY - {{ $year }}</h2>

    <table class="data-table">
        <thead>
            <tr>
                <th rowspan="2">Barangay</th>
                @foreach($resources as $res)
                    <th colspan="6">{{ $res }}</th>
                @endforeach
                <th rowspan="2">Total</th>
            </tr>
            <tr>
                @foreach($resources as $res)
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
            @foreach($barangayRows as $row)
                <tr>
                    <td>{{ $row['barangay_name'] }}</td>
                    @foreach($resources as $res)
                        <td>{{ $row[$res]['male_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$res]['male_with_disability'] ?? 0 }}</td>
                        <td>{{ $row[$res]['female_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$res]['female_with_disability'] ?? 0 }}</td>
                        <td>{{ $row[$res]['lgbtq_without_disability'] ?? 0 }}</td>
                        <td>{{ $row[$res]['lgbtq_with_disability'] ?? 0 }}</td>
                    @endforeach
                    <td class="totals">{{ $row['total'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

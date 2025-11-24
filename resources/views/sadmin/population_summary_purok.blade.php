<!DOCTYPE html>
<html>
<head>
    <title>Population Summary by Purok - {{ $year ?? 2025 }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 10px;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        th, td {
            border: 1px solid #333;
            padding: 4px 6px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
        }

        th {
            background: #f0f0f0;
            font-weight: bold;
        }

        .totals {
            font-weight: bold;
            background: #E0F7E9;
        }

        h2, h3 {
            text-align: center;
            margin: 0;
        }

        h2 {
            font-size: 16px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        h3 {
            font-size: 12px;
            margin-bottom: 6px;
        }

        .header-table {
            width: 100%;
            margin-bottom: 6px;
            border: none;
        }

        .header-table td {
            border: none;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <!-- Official Header -->
    <table class="header-table">
        <tr>
            <td style="width:80px; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <td style="text-align:center;">
                <div style="line-height:1.3; font-size:12px;">
                    <strong>Republic of the Philippines</strong><br>
                    <strong>CITY OF ILAGAN</strong><br>
                    <strong>Province of Isabela</strong><br>
                    <strong>Liga ng mga Barangay Office</strong><br>
                    LNB Building, LGU Compound, Rizal Street, San Vicente, City of Ilagan, Isabela, 3300
                </div>
            </td>
            <td style="width:80px; text-align:right;">
                <img src="{{ public_path('images/default-logo.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
        </tr>
    </table>

    <h2>Population Summary by Purok</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>

    <!-- Purok Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Barangay</th>
                <th>Total Population</th>
                @foreach($purokColumns as $purok)
                    <th>Purok {{ $purok }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php $index = 1; @endphp
            @foreach($purokPerBarangay as $barangayName => $data)
                @php
                    $totalPopulation = $data['total'] ?? array_sum($data);
                @endphp
                <tr class="{{ $barangayName === 'Total' ? 'totals' : '' }}">
                    <td>{{ $barangayName === 'Total' ? '' : $index++ }}</td>
                    <td style="text-align:left;">{{ $barangayName }}</td>
                    <td>{{ $totalPopulation }}</td>
                    @foreach($purokColumns as $purok)
                        <td>{{ $data[$purok] ?? 0 }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the residents currently registered in the barangays.
        Generated on {{ now('Asia/Manila')->format('F d, Y h:i A') }}.
    </p>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Household Services Overview</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 10px;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
        }

        th, td {
            border: 1px solid #333;
            padding: 4px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
        }

        th {
            background: #eee;
            word-wrap: break-word;
            max-width: 100px;
        }

        td {
            word-wrap: break-word;
            max-width: 100px;
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
            margin-bottom: 4px;
        }

        .totals {
            font-weight: bold;
            background: #E0F7E9;
            font-size: 10px;
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

        .summary-table {
            width: 60%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 10px;
            line-height: 1.4;
        }

        .summary-table th, .summary-table td {
            border: 1px solid #333;
            padding: 6px 8px;
            text-align: left;
            vertical-align: top;
        }

        .summary-table th {
            background: #E0F7E9;
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
                @if($barangayLogo)
                    <img src="{{ public_path('storage/' . $barangayLogo) }}" style="width:60px; height:60px; object-fit:contain;">
                @else
                    <img src="{{ public_path('images/default-logo.png') }}" style="width:60px; height:60px; object-fit:contain;">
                @endif
            </td>
        </tr>
    </table>

    <!-- Title -->
    <h2>{{ $barangayName }} Household Services Overview</h2>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>House ID</th>
                <th>House Number</th>
                <th>Bath & Wash Area</th>
                <th>Toilet Type(s)</th>
                <th>Electricity Source(s)</th>
                <th>Water Source(s)</th>
                <th>Waste Management Type(s)</th>
                <th>Livestock Summary</th>
                <th>Pet Summary</th>
                <th>Internet Accessibility</th>
                <th>Purok Number</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rows as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $row['id'] ?? '—' }}</td>
                <td>{{ $row['house_number'] ?? '—' }}</td>
                <td>{{ $row['bath_and_wash_area'] ?? '—' }}</td>
                <td>{{ $row['toilets'] ?? 'N/A' }}</td>
                <td>{{ $row['electricity'] ?? 'N/A' }}</td>
                <td>{{ $row['water'] ?? 'N/A' }}</td>
                <td>{{ $row['waste'] ?? 'N/A' }}</td>
                <td>{{ $row['livestock'] ?? 'None' }}</td>
                <td>{{ $row['pets'] ?? 'None' }}</td>
                <td>{{ $row['internet'] ?? 'N/A' }}</td>
                <td>{{ $row['purok'] ?? 'N/A' }}</td>
            </tr>
            @endforeach

            <tr>
                <td colspan="12" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Section -->
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Household Distribution Summary</h3>

    <table class="summary-table">
        <thead>
            <tr>
                <th>Category</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Households</td>
                <td>{{ $totalHouseholds ?? 0 }}</td>
            </tr>
            @foreach ($purokDistribution ?? [] as $purok => $count)
            <tr>
                <td>Purok {{ $purok }}</td>
                <td>{{ $count }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the current household data in {{ $barangayName }}.
    </p>
</body>
</html>

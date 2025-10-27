<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Household Summary</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 4px; text-align: center; font-size: 9px; vertical-align: middle; }
        th { background: #eee; word-wrap: break-word; max-width: 100px; }
        td { word-wrap: break-word; max-width: 100px; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 12px; margin-bottom: 4px; }
        .totals { font-weight: bold; background: #E0F7E9; font-size: 10px; text-align: left; }
        .header-table { width: 100%; margin-bottom: 6px; border: none; }
        .header-table td { border: none; vertical-align: middle; }
        .summary-table { width: 50%; border-collapse: collapse; margin-top: 8px; font-size: 10px; line-height: 1.4; }
        .summary-table th, .summary-table td { border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top; }
        .summary-table th { background: #E0F7E9; font-weight: bold; }
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
    <h2>{{ $barangayName }} Household Summary</h2>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Head of Household</th>
                <th>House Number</th>
                <th>Street</th>
                <th>Purok</th>
                <th>Ownership Type</th>
                <th>Housing Condition</th>
                <th>House Structure</th>
                <th>Year Established</th>
                <th>Rooms</th>
                <th>Floors</th>
                <th>Members Count</th>
            </tr>
        </thead>
        <tbody>
            @foreach($households as $house)
            <tr>
                <td>{{ $house['No'] }}</td>
                <td>{{ $house['Head'] }}</td>
                <td>{{ $house['House Number'] }}</td>
                <td>{{ $house['Street'] }}</td>
                <td>{{ $house['Purok'] }}</td>
                <td>{{ $house['Ownership Type'] }}</td>
                <td>{{ $house['Housing Condition'] }}</td>
                <td>{{ $house['House Structure'] }}</td>
                <td>{{ $house['Year Established'] }}</td>
                <td>{{ $house['Rooms'] }}</td>
                <td>{{ $house['Floors'] }}</td>
                <td>{{ $house['Members Count'] }}</td>
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
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Household Summary</h3>

    <table class="summary-table">
        <tbody>
            <tr>
                <td>Total Households</td>
                <td>{{ $totalRecords }}</td>
            </tr>
            <tr>
                <td>Purok Distribution</td>
                <td>
                    @foreach ($households->groupBy('Purok') as $purok => $group)
                        <strong>{{ $purok ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
            <tr>
                <td>Ownership Type Distribution</td>
                <td>
                    @foreach ($households->groupBy('Ownership Type') as $type => $group)
                        <strong>{{ $type ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
            <tr>
                <td>Housing Condition Distribution</td>
                <td>
                    @foreach ($households->groupBy('Housing Condition') as $cond => $group)
                        <strong>{{ $cond ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
            <tr>
                <td>House Structure Distribution</td>
                <td>
                    @foreach ($households->groupBy('House Structure') as $struct => $group)
                        <strong>{{ $struct ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the data of households currently registered in {{ $barangayName }}.
        Generated on {{ $generatedAt }}.
    </p>
</body>
</html>

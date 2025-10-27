<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Blotter Reports Summary ({{ now()->year }})</title>
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
            word-wrap: break-word;
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
    <h2>{{ $barangayName }} Blotter Reports Summary</h2>
    <h3>Year {{ now()->year }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Report ID</th>
                <th>Incident Type</th>
                <th>Incident Date</th>
                <th>Complainants</th>
                <th>Recorded By</th>
                <th>Status</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($blotters as $blotter)
            <tr>
                <td>{{ $blotter['No'] }}</td>
                <td>{{ $blotter['Report ID'] }}</td>
                <td>{{ $blotter['Incident Type'] ?? 'N/A' }}</td>
                <td>{{ $blotter['Incident Date'] ?? 'N/A' }}</td>
                <td>{{ $blotter['Complainants'] ?? 'N/A' }}</td>
                <td>{{ $blotter['Recorded By'] ?? 'N/A' }}</td>
                <td>{{ $blotter['Status'] ?? 'N/A' }}</td>
                <td>{{ $blotter['Remarks'] ?? '-' }}</td>
            </tr>
            @endforeach

            <!-- Totals Row -->
            <tr>
                <td colspan="8" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Section -->
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Blotter Summary</h3>

    <table style="width: 60%; border-collapse: collapse; margin-top: 8px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="border:1px solid #333; padding:6px 8px; text-align:left;">Category</th>
                <th style="border:1px solid #333; padding:6px 8px; text-align:left;">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Total Blotters</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">{{ $blotters->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">By Incident Type</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @php
                        $incidentTypes = $blotters->groupBy('Incident Type');
                    @endphp
                    @foreach ($incidentTypes as $type => $group)
                        <strong>{{ $type ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the blotter reports currently registered in {{ $barangayName }}.
        Generated on {{ now('Asia/Manila')->format('F d, Y h:i A') }}.
    </p>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Occupation/Livelihood Summary ({{ $year ?? 2025 }})</title>
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

        h2, h3, h4 {
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
            margin-bottom: 4px;
        }

        h4 {
            font-size: 10px;
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

        .footer {
            margin-top: 10px;
            font-size: 9px;
            text-align: right;
        }

        .summary-table {
            width: 60%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 10px;
        }

        .summary-table th, .summary-table td {
            border:1px solid #333;
            padding:6px 8px;
            text-align:left;
        }

        .summary-table th {
            background: #E0F7E9;
            font-weight:bold;
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
    <h2>{{ $barangayName }} Occupation/Livelihood Summary</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Resident ID</th>
                <th>Full Name</th>
                <th>Purok</th>
                <th>Occupation</th>
                <th>Employment Type</th>
                <th>Work Arrangement</th>
                <th>Employer</th>
                <th>Occupation Status</th>
                <th>OFW</th>
                <th>Main Livelihood</th>
                <th>Year Started</th>
                <th>Year Ended</th>
            </tr>
        </thead>
        <tbody>
            @forelse($occupations as $index => $occ)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $occ['Resident ID'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Full Name'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Purok'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Occupation'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Employment Type'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Work Arrangement'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Employer'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Occupation Status'] ?? 'N/A' }}</td>
                    <td>{{ $occ['OFW'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Main Livelihood'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Year Started'] ?? 'N/A' }}</td>
                    <td>{{ $occ['Year Ended'] ?? 'N/A' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="13">No records found.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="totals">
                <td colspan="13" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Summary Table -->
    <table class="summary-table">
        <thead>
            <tr>
                <th>Occupation</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            @foreach($occupations->groupBy('Occupation') as $occupation => $group)
                <tr>
                    <td>{{ $occupation ?? 'N/A' }}</td>
                    <td>{{ $group->count() }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

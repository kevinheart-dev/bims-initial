<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Certificates Summary</title>
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
        }

        td {
            word-wrap: break-word;
        }

        h2, h3, h4 {
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

        .totals {
            font-weight: bold;
            background: #E0F7E9;
            font-size: 10px;
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
    <h2>{{ $barangayName }} Certificates Summary</h2>
    <h3>Year {{ $year ?? now()->year }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 30px;">No.</th>
                <th>Full Name</th>
                <th>Certificate Type</th>
                <th>Purpose</th>
                <th style="width: 60px;">Request Status</th>
                <th>Issued By</th>
                <th style="width: 80px;">Issued At</th>
                <th style="width: 50px;">Purok</th>
            </tr>
        </thead>
        <tbody>
            @forelse($certificates as $index => $cert)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td style="text-align:left;">{{ $cert['Full Name'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $cert['Certificate Type'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $cert['Purpose'] ?? 'N/A' }}</td>
                    <td>{{ $cert['Request Status'] ?? 'N/A' }}</td>
                    <td>{{ $cert['Issued By'] ?? 'N/A' }}</td>
                    <td>{{ $cert['Issued At'] ?? 'N/A' }}</td>
                    <td>{{ $cert['Purok'] ?? 'N/A' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align:center; font-style:italic;">No records found.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="totals">
                <td colspan="10" style="text-align:left; font-style:italic; font-size:10px;">
                    Report generated on: {{ $generatedAt ?? now('Asia/Manila')->format('F d, Y h:i A') }} | Total Records: {{ $total ?? $certificates->count() }}
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Summary Table -->
    <h4 style="margin-top: 15px; text-align:left;">Summary</h4>
    <table class="summary-table">
        <tr>
            <th>Total Certificates</th>
            <td>{{ $total ?? $certificates->count() }}</td>
        </tr>
        <tr>
            <th>Total Residents</th>
            <td>{{ $summary['total_residents'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Pending Requests</th>
            <td>{{ $summary['pending'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Approved Requests</th>
            <td>{{ $summary['approved'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Rejected Requests</th>
            <td>{{ $summary['rejected'] ?? 0 }}</td>
        </tr>
    </table>
</body>
</html>

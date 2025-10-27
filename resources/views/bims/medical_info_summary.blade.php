<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Medical Information Summary ({{ $year ?? 2025 }})</title>
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
    <h2>{{ $barangayName }} Medical Information Summary</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 30px;">No.</th>
                <th style="width: 60px;">Resident ID</th>
                <th>Full Name</th>
                <th style="width: 50px;">Purok</th>
                <th style="width: 40px;">Sex</th>
                <th style="width: 60px;">Blood Type</th>
                <th style="width: 50px;">Is PWD</th>
                <th>Nutrition Status</th>
                <th style="width: 50px;">Smoker</th>
                <th style="width: 60px;">Alcohol User</th>
                <th style="width: 60px;">PhilHealth</th>
                <th>Medical Conditions</th>
                <th>Disabilities</th>
            </tr>
        </thead>
        <tbody>
            @forelse($medicalRecords as $index => $med)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $med['Resident ID'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $med['Full Name'] ?? 'N/A' }}</td>
                    <td>{{ $med['Purok'] ?? 'N/A' }}</td>
                    <td>{{ $med['Sex'] ?? 'N/A' }}</td>
                    <td>{{ $med['Blood Type'] ?? 'N/A' }}</td>
                    <td>{{ $med['Is PWD'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $med['Nutrition Status'] ?? 'N/A' }}</td>
                    <td>{{ $med['Smoker'] ?? 'N/A' }}</td>
                    <td>{{ $med['Alcohol User'] ?? 'N/A' }}</td>
                    <td>{{ $med['PhilHealth'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $med['Medical Conditions'] ?? 'N/A' }}</td>
                    <td style="text-align:left;">{{ $med['Disabilities'] ?? 'N/A' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="13" style="text-align:center; font-style:italic;">No records found.</td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="totals">
                <td colspan="13" style="text-align:left; font-style:italic; font-size:10px;">
                    Report generated on: {{ $generatedAt ?? now('Asia/Manila')->format('F d, Y h:i A') }} | Total Records: {{ $total ?? $medicalRecords->count() }}
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Summary Table -->
    <h4 style="margin-top: 15px; text-align:left;">Summary</h4>
    <table class="summary-table">
        <tr>
            <th>Total Residents</th>
            <td>{{ $total ?? $medicalRecords->count() }}</td>
        </tr>
        <tr>
            <th>Male</th>
            <td>{{ $summary['male'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Female</th>
            <td>{{ $summary['female'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Total PWD</th>
            <td>{{ $summary['pwd'] ?? 0 }}</td>
        </tr>
        <tr>
            <th>Total with PhilHealth</th>
            <td>{{ $summary['philhealth'] ?? 0 }}</td>
        </tr>
    </table>
</body>
</html>

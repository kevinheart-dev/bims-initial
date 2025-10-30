<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Medications Summary ({{ $year ?? now('Asia/Manila')->year }})</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th, td {
            border: 1px solid #333;
            padding: 5px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
        }
        th { background: #eee; }
        td { word-wrap: break-word; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 12px; margin-bottom: 6px; }

        .header-table td { border: none; vertical-align: middle; }
        .header-table { width: 100%; margin-bottom: 6px; }

        .summary-table { width: 50%; border-collapse: collapse; margin-top: 12px; font-size: 10px; }
        .summary-table th, .summary-table td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        .summary-table th { background: #E0F7E9; font-weight: bold; }
        .totals { font-weight: bold; background: #E0F7E9; font-size: 10px; }
    </style>
</head>
<body>

{{-- HEADER --}}
<table class="header-table">
<tr>
    <td style="width:80px; text-align:left;">
        <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px;">
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
            <img src="{{ public_path('storage/' . $barangayLogo) }}" style="width:60px; height:60px;">
        @else
            <img src="{{ public_path('images/default-logo.png') }}" style="width:60px; height:60px;">
        @endif
    </td>
</tr>
</table>

<h2>{{ $barangayName }} Medication Summary</h2>
<h3>Year {{ $year ?? now('Asia/Manila')->year }}</h3>


{{-- MAIN TABLE --}}
<table>
<thead>
<tr>
    <th style="width:30px;">No.</th>
    <th>Full Name</th>
    <th>Age</th>
    <th>Sex</th>
    <th>Purok</th>
    <th>Medication</th>
    <th>Start Date</th>
    <th>End Date</th>
</tr>
</thead>
<tbody>
@forelse($medications as $index => $m)
<tr>
    <td>{{ $index + 1 }}</td>
    <td style="text-align:left;">{{ $m['FullName'] ?? 'N/A' }}</td>
    <td>{{ $m['Age'] ?? 'N/A' }}</td>
    <td>{{ $m['Sex'] ?? 'N/A' }}</td>
    <td>{{ $m['Purok Number'] ?? 'N/A' }}</td>
    <td style="text-align:left;">{{ $m['Medication'] ?? 'N/A' }}</td>
    <td>{{ $m['Start Date'] ?? 'N/A' }}</td>
    <td>{{ $m['End Date'] ?? 'N/A' }}</td>
</tr>
@empty
<tr>
    <td colspan="10" style="text-align:center; font-style:italic;">No records found.</td>
</tr>
@endforelse
</tbody>

<tfoot>
<tr class="totals">
    <td colspan="8" style="text-align:left; font-style:italic;">
        Report generated on: {{ $generatedAt ?? now('Asia/Manila')->format('F d, Y h:i A') }} |
        Total Records: {{ $total ?? $medications->count() }}
    </td>
</tr>
</tfoot>
</table>

{{-- SUMMARY --}}
<h4 style="margin-top: 15px; text-align:left;">Summary</h4>

<table class="summary-table">
    <tr><th>Total Individuals With Medications</th><td>{{ $total ?? $medications->count() }}</td></tr>
    <tr><th>Male</th><td>{{ $summary['male'] ?? 0 }}</td></tr>
    <tr><th>Female</th><td>{{ $summary['female'] ?? 0 }}</td></tr>
</table>

</body>
</html>

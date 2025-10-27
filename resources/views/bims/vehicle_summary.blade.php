<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} Vehicle Information</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; color: #222; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
        th { background-color: #1a66ff; color: #fff; text-align: center; font-weight: bold; }
        td { text-align: left; }
        h2, h3 { margin: 0; text-align: center; }
        .header img { height: 60px; }
        .header-table { width: 100%; margin-bottom: 6px; border: none; }
        .header-table td { border: none; vertical-align: middle; }
        .summary-table th { background-color: #f2f2f2; color: #000; text-align: left; padding: 6px; }
        .summary-table td { text-align: right; padding: 6px; }
        .totals td { border: none; font-weight: bold; padding-top: 6px; }
        .generated {
            text-align: left;
            font-size: 9px;
            padding-top: 6px;
            padding-bottom: 4px;
            color: #555;
            font-style: italic;
            border-top: 1px solid #ccc;
        }
    </style>
</head>
<body>

    <!-- ✅ Official Header -->
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

    <!-- ✅ Report Title -->
    <h2 style="margin-top:10px;">{{ strtoupper($barangayName) }} Vehicle Information Summary</h2>
    <h3>Year {{ $year ?? date('Y') }}</h3>

    <!-- ✅ Main Data Table -->
    <table>
        <thead>
            <tr>
                <th style="width:8%;">Resident ID</th>
                <th style="width:25%;">Full Name</th>
                <th style="width:10%;">Purok</th>
                <th style="width:20%;">Vehicle Type</th>
                <th style="width:20%;">Vehicle Class</th>
                <th style="width:17%;">Usage Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($vehicles as $v)
                <tr>
                    <td>{{ $v['Resident ID'] }}</td>
                    <td>{{ $v['Full Name'] }}</td>
                    <td style="text-align:center;">{{ $v['Purok'] }}</td>
                    <td>{{ $v['Vehicle Type'] }}</td>
                    <td>{{ $v['Vehicle Class'] }}</td>
                    <td>{{ $v['Usage Status'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align:center; font-style:italic; color:#777;">
                        No vehicle records found.
                    </td>
                </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="totals">
                <td colspan="6">Total Vehicles: {{ $total }}</td>
            </tr>
            <tr>
                <td colspan="6" class="generated">
                    Report generated on: {{ $generatedAt }} (Asia/Manila)
                </td>
            </tr>
        </tfoot>
    </table>

</body>
</html>

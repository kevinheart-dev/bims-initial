<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Family Information Summary</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; margin: 0; }

        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 4px; text-align: center; font-size: 9px; vertical-align: middle; }
        th { background: #eee; word-wrap: break-word; max-width: 100px; }
        td { word-wrap: break-word; max-width: 100px; }

        h2, h3, h4 { text-align: center; margin: 0; word-wrap: break-word; }
        h2 { font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 12px; margin-bottom: 4px; }
        h4 { font-size: 10px; margin-bottom: 6px; }

        .totals { font-weight: bold; background: #E0F7E9; font-size: 10px; }
        .header-table { width: 100%; margin-bottom: 6px; border: none; }
        .header-table td { border: none; vertical-align: middle; }
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
    <h2>{{ $barangayName }} Family Information Summary</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Family Name</th>
                <th>Family Type</th>
                <th>Income Bracket</th>
                <th>Income Category</th>
                <th>Family Head</th>
                <th>Members Count</th>
                <th>Purok</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($families as $index => $family)
            <tr>
                <td>{{ $index + 1 }}</td> <!-- Sequential number -->
                <td>{{ $family['Family Name'] }}</td>
                <td>{{ $family['Family Type'] }}</td>
                <td>{{ $family['Income Bracket'] }}</td>
                <td>{{ $family['Income Category'] }}</td>
                <td>{{ $family['Family Head'] }}</td>
                <td>{{ $family['Members Count'] }}</td>
                <td>{{ $family['Purok'] }}</td>
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
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Family Summary</h3>

    <table style="width: 60%; border-collapse: collapse; margin-top: 12px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Category</th>
                <th style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Count</th>
            </tr>
        </thead>
        <tbody>
            <!-- Total Families -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Total Families</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $total ?? $families->count() }}</td>
            </tr>

            <!-- Purok Distribution -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Purok Distribution</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">
                    @foreach ($families->groupBy('Purok') as $purok => $group)
                        <strong>Purok {{ $purok ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>

            <!-- Family Types Summary -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Family Types</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">
                    @php
                        $familyTypes = [];
                        foreach ($families as $family) {
                            $familyTypes[$family['Family Type']] = ($familyTypes[$family['Family Type']] ?? 0) + 1;
                        }
                    @endphp
                    @foreach ($familyTypes as $type => $count)
                        <strong>{{ $type }}:</strong> {{ $count }}<br>
                    @endforeach
                </td>
            </tr>

            <!-- Income Brackets Summary -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Income Brackets</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">
                    @php
                        $incomeBrackets = [];
                        foreach ($families as $family) {
                            $incomeBrackets[$family['Income Bracket']] = ($incomeBrackets[$family['Income Bracket']] ?? 0) + 1;
                        }
                    @endphp
                    @foreach ($incomeBrackets as $bracket => $count)
                        <strong>{{ $bracket }}:</strong> {{ $count }}<br>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>

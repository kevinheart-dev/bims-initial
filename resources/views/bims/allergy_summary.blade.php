<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Allergy Information Summary</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 10px;
            margin: 0;
        }

        /* Table Layout */
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

        /* Header Table (no borders) */
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
    <h2>{{ $barangayName }} Allergy Information Summary</h2>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Resident Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Allergy Name</th>
                <th>Description</th>
                <th>Purok Number</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($allergies as $allergy)
            <tr>
                <td>{{ $allergy['No'] }}</td>
                <td>{{ $allergy['Resident Name'] }}</td>
                <td>{{ $allergy['Age'] }}</td>
                <td>{{ $allergy['Sex'] }}</td>
                <td>{{ $allergy['Allergy Name'] }}</td>
                <td>{{ $allergy['Description'] }}</td>
                <td>{{ $allergy['Purok Number'] }}</td>
            </tr>
            @endforeach

            <!-- Totals Row -->
            <tr>
                <td colspan="6" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Section -->
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Allergy Summary</h3>

    <table style="width: 50%; border-collapse: collapse; margin-top: 8px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="border:1px solid #333; padding:6px 8px; text-align:left;">Category</th>
                <th style="border:1px solid #333; padding:6px 8px; text-align:left;">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Total Allergies</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">{{ $allergies->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Male</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">{{ $allergies->where('Sex', 'Male')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Female</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">{{ $allergies->where('Sex', 'Female')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Purok Distribution</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @foreach ($allergies->groupBy('Purok Number') as $purok => $group)
                        <strong>Purok {{ $purok ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the data of residents with allergies currently registered in {{ $barangayName }}.
        Generated on {{ now('Asia/Manila')->format('F d, Y h:i A') }}
    </p>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Senior Citizens Summary ({{ $year ?? 2025 }})</title>
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
    <h2>{{ $barangayName }} Senior Citizens Summary</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Lastname</th>
                <th>Firstname</th>
                <th>Middlename</th>
                <th>Suffix</th>
                <th>Sex</th>
                <th>Purok</th>
                <th>Birthdate</th>
                <th>Age</th>
                <th>OSCA ID</th>
                <th>Is Pensioner</th>
                <th>Pension Type</th>
                <th>Living Alone</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($residents as $index => $resident)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $resident['last_name'] ?? '-' }}</td>
                <td>{{ $resident['first_name'] ?? '-' }}</td>
                <td>{{ $resident['middle_name'] ?? '-' }}</td>
                <td>{{ $resident['suffix'] ?? '-' }}</td>
                <td>{{ ucfirst($resident['sex'] ?? '-') }}</td>
                <td>{{ $resident['purok'] ?? 'N/A' }}</td>
                <td>
                    {{ isset($resident['birthdate']) ? \Carbon\Carbon::parse($resident['birthdate'])->format('F d, Y') : '-' }}
                </td>
                <td>{{ $resident['age'] ?? '-' }}</td>
                <td>{{ $resident['osca_id'] ?? '-' }}</td>
                <td>{{ $resident['is_pensioner'] ?? 'No' }}</td>
                <td>{{ $resident['pension_type'] ?? '-' }}</td>
                <td>{{ $resident['living_alone'] ?? 'No' }}</td>
            </tr>
            @endforeach

            <!-- Totals Row -->
            <tr>
                <td colspan="13" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ $generatedAt ?? now()->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Section -->
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Senior Citizens Summary</h3>

    <table style="width: 50%; border-collapse: collapse; margin-top: 8px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Category</th>
                <th style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Total Senior Citizens</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $residents->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Male</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $residents->where('sex', 'male')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Female</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $residents->where('sex', 'female')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Registered Pensioners</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $residents->where('is_pensioner', 'Yes')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Living Alone</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">{{ $residents->where('living_alone', 'Yes')->count() }}</td>
            </tr>
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">Purok Distribution</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left; vertical-align: top;">
                    @foreach ($residents->groupBy('purok') as $purok => $group)
                        <strong>Purok {{ $purok ?? 'N/A' }}:</strong> {{ $group->count() }}<br>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the data of senior citizens currently registered in {{ $barangayName }}.
        Generated on {{ $generatedAt ?? now()->format('F d, Y h:i A') }}.
    </p>
</body>
</html>

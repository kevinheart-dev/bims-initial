<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} Family List</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
        th { background-color: #1a66ff; color: #fff; text-align: center; }
        .family-row td { font-weight: bold; background-color: #f2f2f2; text-align: center; }
        .member-row td { padding-left: 20px; }
        h2, h3 { margin: 0; text-align: center; }
        .header img { height: 60px; }
        .header-table { width: 100%; margin-bottom: 6px; border: none; }
        .header-table td { border: none; vertical-align: middle; }
        p { font-size: 9px; margin-top: 6px; }
        .summary-table th { background-color: #f2f2f2; color: #000; text-align: left; padding: 6px; }
        .summary-table td { text-align: right; padding: 6px; }
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

    <h2>{{ $barangayName }} Family Members Information</h2>
    <h3>Year {{ $year ?? date('Y') }}</h3>

    @php
        // Group members by family
        $families = [];
        $currentFamily = null;
        $currentPurok = null;

        foreach ($rows as $row) {
            if (!empty($row['family_name'])) {
                $currentFamily = $row['family_name'];
                $currentPurok = $row['purok'] ?? '';
            } else {
                $families[$currentFamily][] = array_merge($row, ['purok' => $currentPurok]);
            }
        }

        // Totals
        $totalFamilies = count($families);
        $totalMembers = count($rows);
        $totalMales = collect($rows)->where('gender', 'Male')->count();
        $totalFemales = collect($rows)->where('gender', 'Female')->count();
    @endphp

    <table>
        <thead>
            <tr>
                <th>Family Name</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Birthdate</th>
                <th>Purok</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($families as $familyName => $members)
                @php $memberCount = count($members); @endphp

                @foreach ($members as $index => $member)
                    @php $isLast = $index === $memberCount - 1; @endphp
                    <tr>
                        <!-- Family Name -->
                        @if($index === 0)
                            <td style="font-weight:bold; background-color:#f2f2f2; text-align:center;
                                    border-left:1px solid #333; border-right:1px solid #333; border-top:1px solid #333;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                                {{ $familyName }}
                            </td>
                        @else
                            <td style="background-color:#f2f2f2; border-left:1px solid #333; border-right:1px solid #333;
                                    border-top:none; border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                            </td>
                        @endif

                        <!-- Member Info -->
                        <td>{{ $member['full_name'] ?? '' }}</td>
                        <td>{{ $member['gender'] ?? '' }}</td>
                        <td>{{ $member['birthdate'] ?? '' }}</td>

                        <!-- Purok -->
                        @if($index === 0)
                            <td style="font-weight:bold; background-color:#f2f2f2; text-align:center;
                                    border-left:1px solid #333; border-right:1px solid #333; border-top:1px solid #333;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                                {{ $member['purok'] }}
                            </td>
                        @else
                            <td style="background-color:#f2f2f2; border-left:1px solid #333; border-right:1px solid #333;
                                    border-top:none; border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                            </td>
                        @endif
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
    <p style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
        Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
    </p>
</body>
</html>

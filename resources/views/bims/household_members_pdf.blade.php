<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} Household Members</title>
    <style>
        body { font-family: sans-serif; font-size: 10px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
        th { background-color: #eee; text-align: center; }
        .household-row td { font-weight: bold; background-color: #f2f2f2; text-align: center; }
        .member-row td { padding-left: 20px; }
        h2, h3 { margin: 0; text-align: center; }
        p { font-size: 9px; margin-top: 6px; }
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
    <h2>{{ $barangayName }} Household Members</h2>

    <!-- Data Table -->
    <table style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr>
                <th>Household</th>
                <th>Household Head</th>
                <th>Full Name</th>
                <th>Gender</th>
                <th>Birthdate</th>
                <th>Purok</th>
            </tr>
        </thead>
        <tbody>
            @php
                // Group members by household
                $households = [];
                $currentHousehold = null;
                $currentPurok = null;
                $currentHead = null;

                foreach ($rows as $row) {
                    if (!empty($row['household'])) {
                        $currentHousehold = $row['household'];
                        $currentPurok = $row['purok'] ?? '';
                        $currentHead = $row['head'] ?? '';
                    } else {
                        $households[$currentHousehold]['head'] = $currentHead;
                        $households[$currentHousehold]['purok'] = $currentPurok;
                        $households[$currentHousehold]['members'][] = $row;
                    }
                }
            @endphp

            @foreach ($households as $householdName => $houseData)
                @php
                    $members = $houseData['members'] ?? [];
                    $memberCount = count($members);
                @endphp

                @foreach ($members as $index => $member)
                    @php $isLast = $index === $memberCount - 1; @endphp
                    <tr>
                        <!-- Household Name -->
                        @if($index === 0)
                            <td style="font-weight:bold; background-color:#f2f2f2; text-align:center;
                                    border-left:1px solid #333; border-right:1px solid #333; border-top:1px solid #333;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                                {{ $householdName }}
                            </td>
                            <td style="font-weight:bold; background-color:#f2f2f2; text-align:center;
                                    border-left:1px solid #333; border-right:1px solid #333; border-top:1px solid #333;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                                {{ $houseData['head'] ?? '' }}
                            </td>
                        @else
                            <td style="border-left:1px solid #333; border-right:1px solid #333; border-top:none;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }}; background-color:#f2f2f2;"></td>
                            <td style="border-left:1px solid #333; border-right:1px solid #333; border-top:none;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }}; background-color:#f2f2f2;"></td>
                        @endif

                        <!-- Member columns -->
                        <td style="border:1px solid #333;">{{ $member['full_name'] ?? '' }}</td>
                        <td style="border:1px solid #333;">{{ $member['gender'] ?? '' }}</td>
                        <td style="border:1px solid #333;">{{ $member['birthdate'] ?? '' }}</td>

                        <!-- Purok -->
                        @if($index === 0)
                            <td style="font-weight:bold; background-color:#f2f2f2; text-align:center;
                                    border-left:1px solid #333; border-right:1px solid #333; border-top:1px solid #333;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }};">
                                {{ $houseData['purok'] ?? '' }}
                            </td>
                        @else
                            <td style="border-left:1px solid #333; border-right:1px solid #333; border-top:none;
                                    border-bottom:{{ $isLast ? '1px solid #333' : 'none' }}; background-color:#f2f2f2;"></td>
                        @endif
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>

    <!-- Household Summary Section -->
    <h3 style="text-align:left; text-decoration: underline; margin-top:12px;">Household Summary</h3>

    @php
        $totalHouseholds = count($households);
        $purokDistribution = [];
        foreach ($households as $houseData) {
            $purok = $houseData['purok'] ?? 'N/A';
            $purokDistribution[$purok] = ($purokDistribution[$purok] ?? 0) + 1;
        }
    @endphp

    <table style="width: 50%; border-collapse: collapse; margin-top: 8px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="text-align:left; padding:6px 8px;">Category</th>
                <th style="text-align:left; padding:6px 8px;">Count</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align:left; padding:6px 8px;">Total Households</td>
                <td style="text-align:left; padding:6px 8px;">{{ $totalHouseholds }}</td>
            </tr>
            @foreach($purokDistribution as $purok => $count)
                <tr>
                    <td style="text-align:left; padding:6px 8px;">Purok {{ $purok }}</td>
                    <td style="text-align:left; padding:6px 8px;">{{ $count }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="margin-top:6px; font-size:9px; line-height:1.3;">
        Note: This summary is based on the data of households currently registered in {{ $barangayName }}.
        Generated on {{ $generatedAt }}.
    </p>
</body>
</html>

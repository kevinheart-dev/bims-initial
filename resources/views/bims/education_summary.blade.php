<!DOCTYPE html>
<html>
<head>
    <title>{{ $barangayName }} - Educational History Summary ({{ $year ?? 2025 }})</title>
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
    <h2>{{ $barangayName }} Educational History Summary</h2>
    <h3>Year {{ $year ?? 2025 }}</h3>
    @php
        $EDUCATION_LEVEL_TEXT = [
            'no_formal_education' => 'No Formal Education',
            'no_education_yet' => 'No Education Yet',
            'prep_school' => 'Prep School',
            'kindergarten' => 'Kindergarten',
            'tesda' => 'TESDA',
            'junior_high_school' => 'Junior High School',
            'senior_high_school' => 'Senior High School',
            'elementary' => 'Elementary',
            'high_school' => 'High School',
            'college' => 'College',
            'post_graduate' => 'Post Graduate',
            'vocational' => 'Vocational',
            'als' => 'ALS (Alternative Learning System)',
        ];

        $EDUCATION_STATUS_TEXT = [
            'graduated' => 'Graduated',
            'enrolled' => 'Currently Enrolled',
            'incomplete' => 'Incomplete',
            'dropped_out' => 'Dropped Out',
        ];
    @endphp

    <!-- Data Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 40px;">No.</th>
                <th>Full Name</th>
                <th>Purok</th>
                <th>School Name</th>
                <th>School Type</th>
                <th>Educational Attainment</th>
                <th>Education Status</th>
                <th>Year Started</th>
                <th>Year Ended</th>
                <th>Program</th>
            </tr>
        </thead>
        <tbody>
            @foreach($educations as $index => $edu)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td style="text-align:left;">
                        {{ $edu['Full Name'] ?: '' }}
                    </td>
                    <td style="text-align:left;">
                        {{ $edu['Purok'] ? 'Purok ' . $edu['Purok'] : '' }}
                        @if(empty($edu['Purok'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                    <td style="text-align:left;">
                        {{ $edu['School Name'] ?: '' }}
                        @if(empty($edu['School Name'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                    <td style="text-align:left;">
                        {{ $edu['School Type'] ?: '' }}
                        @if(empty($edu['School Type'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                    <td style="text-align:left;">
                        {{ $EDUCATION_LEVEL_TEXT[$edu['Educational Attainment']] ?? ($edu['Educational Attainment'] ?: '') }}
                        @if(empty($edu['Educational Attainment'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                    <td style="text-align:left;">
                        {{ $EDUCATION_STATUS_TEXT[$edu['Education Status']] ?? ($edu['Education Status'] ?: '') }}
                        @if(empty($edu['Education Status'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                    <td>
                        {{ $edu['Year Started'] ?: '' }}
                        @if(empty($edu['Year Started'])) <span style="color:#999; font-style:italic;">—</span> @endif
                    </td>
                    <td>
                        {{ $edu['Year Ended'] ?: '' }}
                        @if(empty($edu['Year Ended'])) <span style="color:#999; font-style:italic;">—</span> @endif
                    </td>
                    <td style="text-align:left;">
                        {{ $edu['Program'] ?: '' }}
                        @if(empty($edu['Program'])) <span style="color:#999; font-style:italic;">N/A</span> @endif
                    </td>
                </tr>
            @endforeach

            <tr class="totals">
                <td colspan="10" style="text-align:left; font-size:10px; padding-top:6px; padding-bottom:4px; color:#555; font-style:italic; border-top:1px solid #ccc;">
                    Report generated on: {{ now('Asia/Manila')->format('F d, Y h:i A') }}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Summary Section -->
    <h3 style="margin-top:12px; text-align:left; text-decoration: underline;">Educational Summary</h3>

    <table style="width: 60%; border-collapse: collapse; margin-top: 12px; font-size: 10px; line-height: 1.4;">
        <thead>
            <tr style="background: #E0F7E9; font-weight: bold;">
                <th style="border:1px solid #333; padding:6px 8px; text-align:left; width: 40%;">Category</th>
                <th style="border:1px solid #333; padding:6px 8px; text-align:left;">Count</th>
            </tr>
        </thead>
        <tbody>
            <!-- Educational Attainment Summary -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Educational Attainment</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @foreach($educations->groupBy('Educational Attainment') as $level => $group)
                        @php
                            $displayLevel = $EDUCATION_LEVEL_TEXT[$level] ?? ($level ?: 'N/A');
                        @endphp
                        <div><strong>{{ $displayLevel }}:</strong> {{ $group->count() }}</div>
                    @endforeach
                </td>
            </tr>

            <!-- School Type Summary -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">School Type</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @foreach($educations->groupBy('School Type') as $type => $group)
                        <div><strong>{{ $type ?? 'N/A' }}:</strong> {{ $group->count() }}</div>
                    @endforeach
                </td>
            </tr>

            <!-- Education Status Summary -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Education Status</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @foreach($educations->groupBy('Education Status') as $status => $group)
                        @php
                            $displayStatus = $EDUCATION_STATUS_TEXT[$status] ?? ($status ?: 'N/A');
                        @endphp
                        <div><strong>{{ $displayStatus }}:</strong> {{ $group->count() }}</div>
                    @endforeach
                </td>
            </tr>

            <!-- Purok Distribution -->
            <tr>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">Purok Distribution</td>
                <td style="border:1px solid #333; padding:6px 8px; text-align:left;">
                    @foreach($educations->groupBy('Purok') as $purok => $group)
                        <div><strong>Purok {{ $purok ?? 'N/A' }}:</strong> {{ $group->count() }}</div>
                    @endforeach
                </td>
            </tr>
        </tbody>
    </table>

</body>
</html>

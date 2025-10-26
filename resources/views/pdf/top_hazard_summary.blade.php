<!DOCTYPE html>
<html>
<head>
    <title>Top 5 Hazards Summary ({{ $year }})</title>
    <style>
        body { font-family: sans-serif; font-size: 8px; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 4px; }
        th, td { border: 1px solid #333; padding: 1.5px; text-align: center; }
        th { background: #eee; font-size: 7.5px; }
        h2, h3 { text-align: center; margin: 0; }
        h2 { font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
        h3 { font-size: 9px; margin-bottom: 6px; }
    </style>
</head>
<body>
    <!-- Header with Logos -->
    <table style="width:100%; margin-bottom:4px; border:none;">
        <tr>
            <td style="width:80px; border:none; text-align:left;">
                <img src="{{ public_path('images/city-of-ilagan.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
            <td style="border:none; text-align:center; vertical-align:middle;">
                <div style="line-height:1.3; font-size:9px;">
                    <strong>Republic of the Philippines</strong><br>
                    <strong>CITY OF ILAGAN</strong><br>
                    <strong>Province of Isabela</strong><br>
                    <strong>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</strong><br>
                    CDRRMO Building, LGU Compound, Rizal Street, San Vicente, City of Ilagan, Isabela, 3300
                </div>
            </td>
            <td style="width:80px; border:none; text-align:right;">
                <img src="{{ public_path('images/cdrrmo.png') }}" style="width:60px; height:60px; object-fit:contain;">
            </td>
        </tr>
    </table>

    <h2>Top 5 Hazards Summary</h2>
    <h3>Community Risk Assessment - {{ $year }}</h3>

    <!-- Hazards Table -->
    <table>
        <thead>
            <tr>
                <th>Barangay</th>
                @for ($i = 1; $i <= 8; $i++)
                    <th>Top {{ $i }} Hazard</th>
                @endfor
            </tr>
        </thead>
        <tbody>
            @foreach ($grouped as $barangay => $data)
                <tr>
                    <td style="text-align:left; border:1px solid #333;">{{ $barangay }}</td>

                    @for ($i = 0; $i < 8; $i++)
                        @php
                            $hazard = $data['top_hazards'][$i] ?? null;
                        @endphp
                        <td style="border:1px solid #333; text-align:center;
                                @if($i === 0 && $hazard) background-color: #fff2cc; font-weight:bold; @endif">
                            {{ $hazard['hazard_name'] ?? '-' }}
                        </td>
                    @endfor
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

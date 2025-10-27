@if (isset($affectedArea) && $affectedArea->isNotEmpty())
    @php
        $hazardGroups = $affectedArea->groupBy('hazard_id');
    @endphp

    @foreach ($hazardGroups as $hazardId => $hazardItems)
        @php
            $hazardName = strtoupper(optional($hazardItems->first()->hazard)->hazard_name ?? 'UNKNOWN HAZARD');
            $totalFamilies = $totalIndividuals = 0;
            $totalAtRiskFamilies = $totalAtRiskIndividuals = 0;
        @endphp

        <p
            style="font-weight:bold; text-decoration:underline; text-transform:uppercase; margin-top:15px; margin-bottom:5px;">
            {{ $hazardName }}
        </p>

        <table
            style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
            border="1">

            <tr style="background-color:#f3f3f3; font-weight:bold;">
                <th rowspan="2" style="border:1px solid #000; padding:2px; width:80px;">Risk Level</th>
                <th rowspan="2" style="border:1px solid #000; padding:2px;">Purok</th>
                <th colspan="2" style="border:1px solid #000; padding:2px; text-align:center;">Total Population
                </th>
                <th colspan="2" style="border:1px solid #000; padding:2px; text-align:center;">At-Risk Population
                </th>
                <th rowspan="2" style="border:1px solid #000; padding:2px;">Safe Evacuation Area</th>
            </tr>
            <tr style="background-color:#f3f3f3; font-weight:bold;">
                <th style="border:1px solid #000; padding:2px; text-align:center;">Families</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">Individuals</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">Families</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">Individuals</th>
            </tr>



            {{-- Data rows --}}
            @foreach ($hazardItems as $item)
                @php
                    $totalFamilies += $item->total_families;
                    $totalIndividuals += $item->total_individuals;
                    $totalAtRiskFamilies += $item->at_risk_families;
                    $totalAtRiskIndividuals += $item->at_risk_individuals;
                @endphp
                <tr>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->risk_level }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->purok_number }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->total_families }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->total_individuals }}
                    </td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->at_risk_families }}
                    </td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->at_risk_individuals }}
                    </td>
                    <td style="border:1px solid #000; padding:2px;">{{ $item->safe_evacuation_area }}</td>
                </tr>
            @endforeach

            {{-- Totals row --}}
            <tr style="font-weight:bold; background-color:#e6e6e6;">
                <td colspan="2" style="border:1px solid #000; padding:2px; text-align:center;">Total</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalFamilies }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalIndividuals }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalAtRiskFamilies }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalAtRiskIndividuals }}</td>
                <td style="border:1px solid #000; padding:2px;"></td>
            </tr>
        </table>
    @endforeach
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No affected area data available.</p>
@endif

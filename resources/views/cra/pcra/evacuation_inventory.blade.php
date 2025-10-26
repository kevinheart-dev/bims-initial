@if (isset($evacuationInventory) && $evacuationInventory->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        <tbody style="display:table-row-group;">

            {{-- Header as normal rows to avoid repeating in PDF --}}
            <tr style="background-color:#f3f3f3;">
                <th rowspan="2" style="border:1px solid #000; padding:2px;">Purok</th>
                <th colspan="2" style="border:1px solid #000; padding:2px;">Total Population</th>
                <th colspan="2" style="border:1px solid #000; padding:2px;">Number of Population at Risk</th>
                <th rowspan="2" style="border:1px solid #000; padding:2px;">Name of Evacuation Center (Plan A)
                    Government-owned</th>
                <th colspan="2" style="border:1px solid #000; padding:2px;">Number of Persons who can be accommodated
                </th>
                <th colspan="2" style="border:1px solid #000; padding:2px;">Number of Persons who cannot be
                    accommodated</th>
                <th rowspan="2" style="border:1px solid #000; padding:2px;">Name of Evacuation Center (Plan B)
                    Privately-owned</th>
                <th colspan="2" style="border:1px solid #000; padding:2px;">Number of Persons who cannot be
                    accommodated at Plan A & B</th>
                <th rowspan="2" style="border:1px solid #000; padding:2px; width:90px;">Remarks</th>
            </tr>
            <tr style="background-color:#f3f3f3;">
                <th style="border:1px solid #000; padding:2px;">Families</th>
                <th style="border:1px solid #000; padding:2px;">Individuals</th>
                <th style="border:1px solid #000; padding:2px;">Families</th>
                <th style="border:1px solid #000; padding:2px;">Individuals</th>
                <th style="border:1px solid #000; padding:2px;">Families</th>
                <th style="border:1px solid #000; padding:2px;">Individuals</th>
                <th style="border:1px solid #000; padding:2px;">Families</th>
                <th style="border:1px solid #000; padding:2px;">Individuals</th>
                <th style="border:1px solid #000; padding:2px;">Families</th>
                <th style="border:1px solid #000; padding:2px;">Individuals</th>
            </tr>

            {{-- Initialize totals --}}
            @php
                $totalFamilies = 0;
                $totalIndividuals = 0;
                $totalFamiliesAtRisk = 0;
                $totalIndividualsAtRisk = 0;
                $totalPlanACapacityFamilies = 0;
                $totalPlanACapacityIndividuals = 0;
                $totalPlanAUnaccommodatedFamilies = 0;
                $totalPlanAUnaccommodatedIndividuals = 0;
                $totalPlanBUnaccommodatedFamilies = 0;
                $totalPlanBUnaccommodatedIndividuals = 0;
            @endphp

            {{-- Data rows --}}
            @foreach ($evacuationInventory as $item)
                <tr>
                    <td style="border:1px solid #000; padding:2px;">{{ $item->purok_number }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->total_families }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->total_individuals }}
                    </td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->families_at_risk }}
                    </td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->individuals_at_risk }}
                    </td>
                    <td style="border:1px solid #000; padding:2px;">{{ $item->plan_a_center }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_a_capacity_families }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_a_capacity_individuals }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_a_unaccommodated_families }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_a_unaccommodated_individuals }}</td>
                    <td style="border:1px solid #000; padding:2px;">{{ $item->plan_b_center }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_b_unaccommodated_families }}</td>
                    <td style="border:1px solid #000; padding:2px; text-align:center;">
                        {{ $item->plan_b_unaccommodated_individuals }}</td>
                    <td style="border:1px solid #000; padding:2px;">{{ $item->remarks }}</td>
                </tr>

                {{-- Accumulate totals --}}
                @php
                    $totalFamilies += $item->total_families;
                    $totalIndividuals += $item->total_individuals;
                    $totalFamiliesAtRisk += $item->families_at_risk;
                    $totalIndividualsAtRisk += $item->individuals_at_risk;
                    $totalPlanACapacityFamilies += $item->plan_a_capacity_families;
                    $totalPlanACapacityIndividuals += $item->plan_a_capacity_individuals;
                    $totalPlanAUnaccommodatedFamilies += $item->plan_a_unaccommodated_families;
                    $totalPlanAUnaccommodatedIndividuals += $item->plan_a_unaccommodated_individuals;
                    $totalPlanBUnaccommodatedFamilies += $item->plan_b_unaccommodated_families;
                    $totalPlanBUnaccommodatedIndividuals += $item->plan_b_unaccommodated_individuals;
                @endphp
            @endforeach

            {{-- Total row --}}
            <tr style="background-color:#f3f3f3; font-weight:bold;">
                <td style="border:1px solid #000; padding:2px;">TOTAL</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalFamilies }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalIndividuals }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalFamiliesAtRisk }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalIndividualsAtRisk }}</td>
                <td style="border:1px solid #000; padding:2px;"></td> {{-- No total for Plan A Center Name --}}
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalPlanACapacityFamilies }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $totalPlanACapacityIndividuals }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    {{ $totalPlanAUnaccommodatedFamilies }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    {{ $totalPlanAUnaccommodatedIndividuals }}</td>
                <td style="border:1px solid #000; padding:2px;"></td> {{-- No total for Plan B Center Name --}}
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    {{ $totalPlanBUnaccommodatedFamilies }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    {{ $totalPlanBUnaccommodatedIndividuals }}</td>
                <td style="border:1px solid #000; padding:2px;"></td> {{-- No total for Remarks --}}
            </tr>

        </tbody>
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">
        No evacuation inventory data available.
    </p>
@endif

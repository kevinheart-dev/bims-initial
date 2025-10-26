@if (isset($riskPopulation) && $riskPopulation->isNotEmpty())
    @php
        $hazardGroups = $riskPopulation->groupBy('hazard_id');
    @endphp

    @foreach ($hazardGroups as $hazardId => $risks)
        @php
            $hazardName = strtoupper(optional($risks->first()->hazard)->hazard_name ?? 'UNKNOWN HAZARD');

            $totalLowFamilies = $risks->sum('low_families');
            $totalLowIndividuals = $risks->sum('low_individuals');
            $totalMediumFamilies = $risks->sum('medium_families');
            $totalMediumIndividuals = $risks->sum('medium_individuals');
            $totalHighFamilies = $risks->sum('high_families');
            $totalHighIndividuals = $risks->sum('high_individuals');
        @endphp

        <!-- Hazard Header -->
        <h3 style="text-align:left; font-weight:bold; text-decoration:underline; margin-top:20px;">
            {{ $hazardName }}
        </h3>

        <table style="width:100%; border-collapse:collapse; font-size:10px; page-break-inside:auto;">
            <tbody>
                <!-- Header Row -->
                <tr style="background-color:#f3f3f3; font-weight:bold;">
                    <th rowspan="2"
                        style="border:1px solid #000; padding:4px; text-align:center; vertical-align:middle;">Areas
                        affected <br>(Purok)</th>
                    <th colspan="2" style="border:1px solid #000; padding:4px; text-align:center;">Low Risk</th>
                    <th colspan="2" style="border:1px solid #000; padding:4px; text-align:center;">Medium Risk</th>
                    <th colspan="2" style="border:1px solid #000; padding:4px; text-align:center;">High Risk</th>
                </tr>
                <tr style="background-color:#f3f3f3; font-weight:bold;">
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Families</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Individuals</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Families</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Individuals</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Families</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Individuals</th>
                </tr>

                @foreach ($risks as $risk)
                    <tr style="page-break-inside:avoid;">
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->purok_number }}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->low_families }}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->low_individuals }}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->medium_families }}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            {{ $risk->medium_individuals }}</td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->high_families }}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $risk->high_individuals }}
                        </td>
                    </tr>
                @endforeach

                <!-- Total Row -->
                <tr style="background-color:#eaeaea; font-weight:bold; page-break-inside:avoid;">
                    <td style="border:1px solid #000; padding:4px; text-align:center;">Total</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalLowFamilies }}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalLowIndividuals }}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalMediumFamilies }}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalMediumIndividuals }}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalHighFamilies }}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalHighIndividuals }}</td>
                </tr>
            </tbody>
        </table>
    @endforeach
@else
    <p style="text-align:center; font-size:10px; margin-top:10px;">No disaster risk population data available.</p>
@endif

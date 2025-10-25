@php
    $pop = isset($populationExposure) ? collect($populationExposure) : collect();

    if ($pop->isEmpty()) {
        echo '<p style="text-align:center; font-size:12px; margin-top:20px;">No population exposure data available.</p>';
    } else {
        $hazardGroups = $pop->groupBy('hazard_id');
        $maxPurok = max($pop->max('purok_number') ?? 0, 7);
    }
@endphp

@if (!empty($hazardGroups) && $hazardGroups->count() > 0)
    @foreach ($hazardGroups as $hazardId => $hazardGroup)
        @php
            $hazardName = strtoupper(optional($hazardGroup->first()->hazard)->hazard_name ?? 'UNKNOWN HAZARD');
            $byPurok = $hazardGroup->keyBy(function ($item) {
                return (int) ($item->purok_number ?? 0);
            });
        @endphp

        <p style="font-size:12px; font-weight:bold; margin-top:20px; margin-bottom:10px; text-align:left;">
            3.1.{{ $loop->iteration }} Number of Families and Individuals according to Age and Health Condition
            who are at Risk from <span
                style="text-decoration:underline; text-transform:uppercase; font-weight:bold;">{{ $hazardName }}</span>
        </p>

        <div style="page-break-inside: avoid;">
            <table
                style="width:100%; border-collapse:collapse; font-size:10px; text-align:center; page-break-inside:auto; margin-bottom:20px;">
                <thead
                    style="display:table-header-group; page-break-inside:avoid; page-break-before:auto; page-break-after:avoid; background-color:#f3f3f3;">
                    <tr>
                        <th rowspan="3"
                            style="border:1px solid #000; padding:3px; word-wrap:break-word; text-align:center;">Purok
                        </th>
                        <th rowspan="3"
                            style="border:1px solid #000; padding:3px; word-wrap:break-word; text-align:center;">No. of
                            Families</th>
                        <th colspan="3" style="border:1px solid #000; padding:3px;">No. of Individuals</th>
                        <th colspan="10" style="border:1px solid #000; padding:3px;">Children</th>
                        <th colspan="4" style="border:1px solid #000; padding:3px;">Adult</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">Persons w/ Disabilities</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">Persons w/ Diseases</th>
                        <th rowspan="3" style="border:1px solid #000; padding:3px;">Pregnant Women</th>
                    </tr>
                    <tr>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">M</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">F</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">LGBTQ</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">0-6Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">7M-2Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">3-5Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">6-12Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">13-17Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">18-59Y</th>
                        <th colspan="2" style="border:1px solid #000; padding:3px;">60Y & UP</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">M</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">F</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">M</th>
                        <th rowspan="2" style="border:1px solid #000; padding:3px;">F</th>
                    </tr>
                    <tr>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                        <th style="border:1px solid #000; padding:3px;">M</th>
                        <th style="border:1px solid #000; padding:3px;">F</th>
                    </tr>
                </thead>
                <tbody style="display:table-row-group;">
                    @for ($p = 1; $p <= $maxPurok; $p++)
                        @php
                            $row = $byPurok->get($p);
                        @endphp
                        <tr style="page-break-inside:avoid; page-break-after:auto;">
                            <td style="border:1px solid #000; padding:3px;">{{ $p }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->total_families ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_lgbtq ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_0_6_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_0_6_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_7m_2y_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_7m_2y_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_3_5_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_3_5_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_6_12_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_6_12_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_13_17_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_13_17_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_18_59_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_18_59_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_60_up_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_60_up_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pwd_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pwd_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->diseases_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->diseases_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pregnant_women ?? '' }}</td>
                        </tr>
                    @endfor
                </tbody>
            </table>
        </div>
    @endforeach
@endif

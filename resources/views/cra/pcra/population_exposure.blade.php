@if (isset($populationExposure) && $populationExposure->isNotEmpty())
    @php
        // Group data by hazard
        $hazardGroups = $populationExposure->groupBy('hazard_id');
    @endphp

    @foreach ($hazardGroups as $hazardId => $records)
        @php
            $hazardName = strtoupper(optional($records->first()->hazard)->hazard_name ?? 'UNKNOWN HAZARD');
        @endphp

        <!-- Hazard Title -->
        <p style="font-size:12px; font-weight:bold; margin-top:20px; margin-bottom:10px; text-align:left;">
            3.1.{{ $loop->iteration }} Number of Families and Individuals according to Age and Health Condition
            who are at Risk from <span
                style="text-decoration:underline; text-transform:uppercase; font-weight:bold;">{{ $hazardName }}</span>
        </p>

        <div style="page-break-inside: avoid;">
            <table
                style="width:100%; border-collapse:collapse; font-size:10px; text-align:center; page-break-inside:auto; margin-bottom:20px;">
                <!-- THEAD (fixed header for DOMPDF) -->
                <thead
                    style="display:table-header-group; page-break-inside:avoid; page-break-before:auto; page-break-after:avoid; background-color:#f3f3f3;">
                    <tr>
                        <th rowspan="3" style="border:1px solid #000; padding:3px;">Purok</th>
                        <th rowspan="3" style="border:1px solid #000; padding:3px;">No. of Families</th>
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

                <!-- TBODY -->
                <tbody style="display:table-row-group;">
                    @foreach ($records->groupBy('purok_number') as $purok => $rows)
                        @php $row = $rows->first(); @endphp
                        <tr style="page-break-inside:avoid;">
                            <td style="border:1px solid #000; padding:3px;">{{ $purok }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->total_families ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->individuals_lgbtq ?? '' }}</td>

                            <!-- Children -->
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

                            <!-- Adults -->
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_18_59_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_18_59_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_60_up_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->age_60_up_female ?? '' }}</td>

                            <!-- Disabilities & Diseases -->
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pwd_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pwd_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->diseases_male ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->diseases_female ?? '' }}</td>
                            <td style="border:1px solid #000; padding:3px;">{{ $row->pregnant_women ?? '' }}</td>
                        </tr>
                    @endforeach

                    <!-- TOTAL ROW -->
                    @php
                        $totals = [
                            'total_families' => $records->sum('total_families'),
                            'individuals_male' => $records->sum('individuals_male'),
                            'individuals_female' => $records->sum('individuals_female'),
                            'individuals_lgbtq' => $records->sum('individuals_lgbtq'),
                            'age_0_6_male' => $records->sum('age_0_6_male'),
                            'age_0_6_female' => $records->sum('age_0_6_female'),
                            'age_7m_2y_male' => $records->sum('age_7m_2y_male'),
                            'age_7m_2y_female' => $records->sum('age_7m_2y_female'),
                            'age_3_5_male' => $records->sum('age_3_5_male'),
                            'age_3_5_female' => $records->sum('age_3_5_female'),
                            'age_6_12_male' => $records->sum('age_6_12_male'),
                            'age_6_12_female' => $records->sum('age_6_12_female'),
                            'age_13_17_male' => $records->sum('age_13_17_male'),
                            'age_13_17_female' => $records->sum('age_13_17_female'),
                            'age_18_59_male' => $records->sum('age_18_59_male'),
                            'age_18_59_female' => $records->sum('age_18_59_female'),
                            'age_60_up_male' => $records->sum('age_60_up_male'),
                            'age_60_up_female' => $records->sum('age_60_up_female'),
                            'pwd_male' => $records->sum('pwd_male'),
                            'pwd_female' => $records->sum('pwd_female'),
                            'diseases_male' => $records->sum('diseases_male'),
                            'diseases_female' => $records->sum('diseases_female'),
                            'pregnant_women' => $records->sum('pregnant_women'),
                        ];
                    @endphp

                    <tr style="background-color:#eaeaea; font-weight:bold;">
                        <td style="border:1px solid #000; padding:3px;">Total</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['total_families'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['individuals_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['individuals_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['individuals_lgbtq'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_0_6_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_0_6_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_7m_2y_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_7m_2y_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_3_5_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_3_5_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_6_12_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_6_12_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_13_17_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_13_17_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_18_59_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_18_59_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_60_up_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['age_60_up_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['pwd_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['pwd_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['diseases_male'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['diseases_female'] }}</td>
                        <td style="border:1px solid #000; padding:3px;">{{ $totals['pregnant_women'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    @endforeach
@else
    <p style="text-align:center; font-size:12px; margin-top:20px;">No population exposure data available.</p>
@endif

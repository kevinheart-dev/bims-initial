<table style="width:100%; border-collapse: collapse; font-size:10px; page-break-inside:auto;">
    <thead style="background-color:#f3f3f3;">
        <tr>
            <th rowspan="3" style="border:1px solid #000; padding:4px; text-align:center; vertical-align:middle;">Type
                of Disability</th>
            <th colspan="18" style="border:1px solid #000; padding:4px; text-align:center;">Group based on Age</th>
            <th rowspan="3" style="border:1px solid #000; padding:4px; text-align:center; vertical-align:middle;">TOTAL
            </th>
        </tr>
        <tr>
            @foreach (['0-6M' => 2, '7M-2Y' => 2, '3-5Y' => 2, '6-12Y' => 3, '13-17Y' => 3, '18-59Y' => 3, '60Y & ABOVE' => 3] as $label => $colspan)
                <th colspan="{{ $colspan }}" style="border:1px solid #000;">{{ $label }}</th>
            @endforeach
        </tr>
        <tr>
            @foreach (['M', 'F', 'M', 'F', 'M', 'F', 'M', 'F', 'LGBTQ', 'M', 'F', 'LGBTQ', 'M', 'F', 'LGBTQ', 'M', 'F', 'LGBTQ'] as $sub)
                <th style="border:1px solid #000;">{{ $sub }}</th>
            @endforeach
        </tr>
    </thead>

    <tbody>
        @php
            $columns = [
                'age_0_6_male',
                'age_0_6_female',
                'age_7m_2y_male',
                'age_7m_2y_female',
                'age_3_5_male',
                'age_3_5_female',
                'age_6_12_male',
                'age_6_12_female',
                'age_6_12_lgbtq',
                'age_13_17_male',
                'age_13_17_female',
                'age_13_17_lgbtq',
                'age_18_59_male',
                'age_18_59_female',
                'age_18_59_lgbtq',
                'age_60up_male',
                'age_60up_female',
                'age_60up_lgbtq',
            ];

            $colTotals = array_fill(0, count($columns), 0);
            $grandTotal = 0;
        @endphp

        @foreach ($disabilityStatistic as $data)
            @php
                $values = array_map(fn($col) => $data->$col ?? 0, $columns);
                $rowTotal = array_sum($values);
                $grandTotal += $rowTotal;

                foreach ($values as $i => $val) {
                    $colTotals[$i] += $val;
                }
            @endphp

            <tr style="page-break-inside:avoid;">
                <td style="border:1px solid #000; padding:3px;">{{ $data->disability_type }}</td>
                @foreach ($values as $val)
                    <td style="border:1px solid #000; text-align:center;">{{ $val }}</td>
                @endforeach
                <td style="border:1px solid #000; text-align:center; font-weight:bold;">{{ $rowTotal }}</td>
            </tr>
        @endforeach

        {{-- Column totals row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <td style="border:1px solid #000; text-align:center;">TOTAL</td>
            @foreach ($colTotals as $total)
                <td style="border:1px solid #000; text-align:center;">{{ $total }}</td>
            @endforeach
            <td style="border:1px solid #000; text-align:center;">{{ $grandTotal }}</td>
        </tr>
    </tbody>
</table>

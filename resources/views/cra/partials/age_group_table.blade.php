@php
    // Standardized age group keys
    $ageGroups = [
        '0_6_mos' => '0-6 months',
        '7_mos_to_2_yrs' => '7 months to 2 years',
        '3_to_5_yrs' => '3-5 years',
        '6_to_12_yrs' => '6-12 years',
        '13_to_17_yrs' => '13-17 years',
        '18_to_59_yrs' => '18-59 years',
        '60_plus_yrs' => '60+ years',
    ];

    // Initialize totals
    $totalMaleWithout = 0;
    $totalMaleWith = 0;
    $totalFemaleWithout = 0;
    $totalFemaleWith = 0;
    $totalLgbtqWithout = 0;
    $totalLgbtqWith = 0;
    $grandTotal = 0;
@endphp

<table style="width:100%; border-collapse:collapse; font-size:10px;" border="1">
    <thead style="background-color:#f3f3f3;">
        <tr>
            <th rowspan="2" style="border:1px solid #000; padding:4px;">Age Group</th>
            <th colspan="2" style="border:1px solid #000; padding:4px;">Male</th>
            <th colspan="2" style="border:1px solid #000; padding:4px;">Female</th>
            <th colspan="2" style="border:1px solid #000; padding:4px;">LGBTQ+</th>
            <th rowspan="2" style="border:1px solid #000; padding:4px;">Total</th>
        </tr>
        <tr>
            <th style="border:1px solid #000; padding:4px;">Without Disability</th>
            <th style="border:1px solid #000; padding:4px;">With Disability</th>
            <th style="border:1px solid #000; padding:4px;">Without Disability</th>
            <th style="border:1px solid #000; padding:4px;">With Disability</th>
            <th style="border:1px solid #000; padding:4px;">Without Disability</th>
            <th style="border:1px solid #000; padding:4px;">With Disability</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($ageGroups as $key => $label)
            @php
                $row = $cra->populationAgeGroups->firstWhere('age_group', $key);

                $male_without = (int) ($row->male_without_disability ?? 0);
                $male_with = (int) ($row->male_with_disability ?? 0);
                $female_without = (int) ($row->female_without_disability ?? 0);
                $female_with = (int) ($row->female_with_disability ?? 0);
                $lgbtq_without = (int) ($row->lgbtq_without_disability ?? 0);
                $lgbtq_with = (int) ($row->lgbtq_with_disability ?? 0);

                $total = $male_without + $male_with + $female_without + $female_with + $lgbtq_without + $lgbtq_with;

                // Accumulate totals
                $totalMaleWithout += $male_without;
                $totalMaleWith += $male_with;
                $totalFemaleWithout += $female_without;
                $totalFemaleWith += $female_with;
                $totalLgbtqWithout += $lgbtq_without;
                $totalLgbtqWith += $lgbtq_with;
                $grandTotal += $total;
            @endphp

            <tr>
                <td style="border:1px solid #000; padding:4px;">{{ $label }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $male_without }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $male_with }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $female_without }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $female_with }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $lgbtq_without }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $lgbtq_with }}</td>
                <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $total }}</td>
            </tr>
        @endforeach

        {{-- TOTAL ROW --}}
        <tr style="font-weight:bold; background-color:#f9f9f9;">
            <td style="border:1px solid #000; padding:4px; text-align:left;">TOTAL</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalMaleWithout }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalMaleWith }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalFemaleWithout }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalFemaleWith }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalLgbtqWithout }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $totalLgbtqWith }}</td>
            <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $grandTotal }}</td>
        </tr>
    </tbody>
</table>

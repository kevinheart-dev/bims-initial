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
@endphp

<table>
    <thead>
        <tr>
            <th rowspan="2">Age Group</th>
            <th colspan="2">Male</th>
            <th colspan="2">Female</th>
            <th colspan="2">LGBTQ+</th>
            <th rowspan="2">Total</th>
        </tr>
        <tr>
            <th>Without Disability</th>
            <th>With Disability</th>
            <th>Without Disability</th>
            <th>With Disability</th>
            <th>Without Disability</th>
            <th>With Disability</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($ageGroups as $key => $label)
            @php
                $row = $cra->populationAgeGroups->firstWhere('age_group', $key);
                $male_total = ($row->male_without_disability ?? 0) + ($row->male_with_disability ?? 0);
                $female_total = ($row->female_without_disability ?? 0) + ($row->female_with_disability ?? 0);
                $lgbtq_total = ($row->lgbtq_without_disability ?? 0) + ($row->lgbtq_with_disability ?? 0);
                $total = $male_total + $female_total + $lgbtq_total;
            @endphp
            <tr>
                <td>{{ $label }}</td>
                <td>{{ $row->male_without_disability ?? 0 }}</td>
                <td>{{ $row->male_with_disability ?? 0 }}</td>
                <td>{{ $row->female_without_disability ?? 0 }}</td>
                <td>{{ $row->female_with_disability ?? 0 }}</td>
                <td>{{ $row->lgbtq_without_disability ?? 0 }}</td>
                <td>{{ $row->lgbtq_with_disability ?? 0 }}</td>
                <td>{{ $total }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

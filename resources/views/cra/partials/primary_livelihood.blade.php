<table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
    <thead style="background-color: #f3f3f3; display: table-row-group;">
        <tr>
            <th rowspan="3" style="border: 1px solid #000; padding: 4px; width: 250px;">Type of Livelihood</th>
            <th colspan="6" style="border: 1px solid #000; padding: 4px; text-align: center;">NUMBER</th>
            <th rowspan="3" style="border: 1px solid #000; padding: 4px;">Total</th>
        </tr>
        <tr>
            <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">Male</th>
            <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">Female</th>
            <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">LGBTQ+</th>
        </tr>
        <tr>
            <th style="border: 1px solid #000; padding: 4px;">Without Disability</th>
            <th style="border: 1px solid #000; padding: 4px;">With Disability</th>
            <th style="border: 1px solid #000; padding: 4px;">Without Disability</th>
            <th style="border: 1px solid #000; padding: 4px;">With Disability</th>
            <th style="border: 1px solid #000; padding: 4px;">Without Disability</th>
            <th style="border: 1px solid #000; padding: 4px;">With Disability</th>
        </tr>
    </thead>
    <tbody style="display: table-row-group;">
        @php
            // Initialize grand totals
            $maleWithout = $maleWith = $femaleWithout = $femaleWith = $lgbtqWithout = $lgbtqWith = $grandTotal = 0;
        @endphp

        @foreach ($primaryLivelihood as $livelihood)
            @php
                $total =
                    ($livelihood->male_without_disability ?? 0) +
                    ($livelihood->male_with_disability ?? 0) +
                    ($livelihood->female_without_disability ?? 0) +
                    ($livelihood->female_with_disability ?? 0) +
                    ($livelihood->lgbtq_without_disability ?? 0) +
                    ($livelihood->lgbtq_with_disability ?? 0);

                // Accumulate totals
                $maleWithout += $livelihood->male_without_disability ?? 0;
                $maleWith += $livelihood->male_with_disability ?? 0;
                $femaleWithout += $livelihood->female_without_disability ?? 0;
                $femaleWith += $livelihood->female_with_disability ?? 0;
                $lgbtqWithout += $livelihood->lgbtq_without_disability ?? 0;
                $lgbtqWith += $livelihood->lgbtq_with_disability ?? 0;
                $grandTotal += $total;
            @endphp

            <tr>
                <td style="border: 1px solid #000; padding: 4px;">{{ $livelihood->livelihood_type }}</td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->male_without_disability }}</td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->male_with_disability }}</td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->female_without_disability }}
                </td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->female_with_disability }}</td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->lgbtq_without_disability }}</td>
                <td style="border: 1px solid #000; text-align: center;">{{ $livelihood->lgbtq_with_disability }}</td>
                <td style="border: 1px solid #000; text-align: center; font-weight: bold;">{{ $total }}</td>
            </tr>
        @endforeach

        {{-- Grand total row --}}
        <tr style="font-weight: bold; background-color: #f3f3f3;">
            <td style="border: 1px solid #000; padding: 4px; text-align: right;">TOTAL</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $maleWithout }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $maleWith }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $femaleWithout }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $femaleWith }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $lgbtqWithout }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $lgbtqWith }}</td>
            <td style="border: 1px solid #000; text-align: center;">{{ $grandTotal }}</td>
        </tr>
    </tbody>
</table>

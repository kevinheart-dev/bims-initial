<table style="width: 100%; border-collapse: collapse; font-size: 13px;">
    <thead style="background-color: #f3f3f3;">
        <tr>
            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center;">
                PRIORITY HAZARDS
            </th>
            <th colspan="5" style="border: 1px solid #000; padding: 6px; text-align: center;">
                RISK TO THE COMMUNITY
            </th>
        </tr>
        <tr>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">PEOPLE</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">PROPERTIES</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">SERVICES</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">ENVIRONMENT</th>
            <th style="border: 1px solid #000; padding: 6px; text-align: center;">LIVELIHOOD</th>
        </tr>
    </thead>
    <tbody>
        @if (isset($assessmentMatrix) && count($assessmentMatrix) > 0)
            @foreach ($assessmentMatrix as $matrix)
                <tr>
                    <td style="border: 1px solid #000; padding: 6px;">
                        {{ $matrix->hazard->hazard_name ?? 'N/A' }}
                    </td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">
                        {{ $matrix->people ?? 'None' }}
                    </td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">
                        {{ $matrix->properties ?? 'None' }}
                    </td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">
                        {{ $matrix->services ?? 'None' }}
                    </td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">
                        {{ $matrix->environment ?? 'None' }}
                    </td>
                    <td style="border: 1px solid #000; padding: 6px; text-align: center;">
                        {{ $matrix->livelihood ?? 'None' }}
                    </td>
                </tr>
            @endforeach
        @else
            <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 6px; text-align: center;">
                    No assessment data available.
                </td>
            </tr>
        @endif
    </tbody>
</table>

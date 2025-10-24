@if ($primaryFacility && count($primaryFacility) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
        <thead style="background-color: #f3f3f3; display: table-row-group;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px; text-align: left; width: 300px;">
                    FACILITIES AND SERVICES
                </th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: 150px;">
                    QUANTITY
                </th>
            </tr>
        </thead>

        <tbody style="display: table-row-group;">
            @foreach ($primaryFacility as $facility)
                <tr style="page-break-inside: avoid;">
                    <td style="border: 1px solid #000; padding: 4px;">
                        {{ $facility->facility_name }}
                    </td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                        {{ $facility->quantity }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No facilities or services data available.</p>
@endif

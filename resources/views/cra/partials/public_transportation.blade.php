@if ($publicTransportation && count($publicTransportation) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto; margin-top: 20px;">
        <thead style="background-color: #f3f3f3; display: table-row-group;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px; width: 300px; text-align: left;">
                    PUBLIC TRANSPORTATION
                </th>
                <th style="border: 1px solid #000; padding: 4px; width: 150px; text-align: center;">
                    QUANTITY
                </th>
            </tr>
        </thead>
        <tbody style="display: table-row-group;">
            @foreach ($publicTransportation as $transpo)
                <tr style="page-break-inside: avoid;">
                    <td style="border: 1px solid #000; padding: 4px;">
                        {{ $transpo->transpo_type }}
                    </td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                        {{ $transpo->quantity }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No public transportation data available.</p>
@endif

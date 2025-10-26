@if (isset($illnessesStat) && $illnessesStat->isNotEmpty())
    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
            <tr style="background-color: #f3f3f3;">
                <th rowspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">
                    Illness/Disease
                </th>
                <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">
                    Quantity
                </th>
            </tr>
            <tr style="background-color: #f3f3f3;">
                <th style="border: 1px solid #000; padding: 4px; text-align: center;">
                    Children (17 and below)
                </th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center;">
                    Adults (18 and above)
                </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($illnessesStat as $illness)
                <tr>
                    <td style="border: 1px solid #000; padding: 4px;">{{ $illness->illness }}</td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $illness->children }}</td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $illness->adults }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">
        No illness statistics available.
    </p>
@endif

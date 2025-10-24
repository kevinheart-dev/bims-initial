<table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
    <thead style="background-color: #f3f3f3; display: table-row-group;">
        <tr>
            <th style="border: 1px solid #000; padding: 4px;">Road Type</th>
            <th style="border: 1px solid #000; padding: 4px;">Length of Road in Km</th>
            <th style="border: 1px solid #000; padding: 4px;">Who Maintains the Road Network</th>
        </tr>
    </thead>
    <tbody style="display: table-row-group;">
        @foreach ($roadNetwork as $road)
            <tr>
                <td style="border: 1px solid #000; padding: 4px;">{{ $road->road_type }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $road->length_km }}</td>
                <td style="border: 1px solid #000; padding: 4px;">{{ $road->maintained_by }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

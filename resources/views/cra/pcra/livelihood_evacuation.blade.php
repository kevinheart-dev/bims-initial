<table style="width: 100%; border-collapse: collapse; font-size: 12px;">

    <tr style="background-color: #f3f3f3;">
        <th style="border: 1px solid #000; padding: 4px; text-align: center;">Types of Livelihoods</th>
        <th style="border: 1px solid #000; padding: 4px; text-align: center;">Evacuation Site/Area (Purok)</th>
        <th style="border: 1px solid #000; padding: 4px; text-align: center;">Place of Origin (Purok)</th>
        <th style="border: 1px solid #000; padding: 4px; text-align: center;">Number of items that can be accommodated
        </th>
    </tr>

    <tbody>
        @forelse($livelihoodEvacuation as $item)
            <tr>
                <td style="border: 1px solid #000; padding: 4px; text-align: left;">{{ $item->livelihood_type }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: left;">{{ $item->evacuation_site }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: left;">{{ $item->place_of_origin }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $item->capacity_description }}
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 4px; text-align: center;">No livelihood
                    evacuation data available.</td>
            </tr>
        @endforelse
    </tbody>
</table>

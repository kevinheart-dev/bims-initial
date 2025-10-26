@if (isset($evacuationPlan) && $evacuationPlan->isNotEmpty())
    <table style="width:100%; border-collapse:collapse; font-size:10px; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <th style="border:1px solid #000; padding:2px; text-align:center; width:25px; white-space:nowrap;">#</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">THINGS TO DO</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">RESPONSIBLE PERSON</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">REMARKS</th>
        </tr>

        {{-- Data rows --}}
        @foreach ($evacuationPlan as $item)
            <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center; width:25px; white-space:nowrap;">
                    {{ $item->activity_no }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:left;">{{ $item->things_to_do }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:left;">{{ $item->responsible_person }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:left;">{{ $item->remarks }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No Barangay Evacuation Plan data available.</p>
@endif

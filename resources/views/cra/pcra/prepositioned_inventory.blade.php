@if (isset($prepositionedInventory) && $prepositionedInventory->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <th style="border:1px solid #000; padding:2px;">Item Name</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Quantity</th>
            <th style="border:1px solid #000; padding:2px;">Remarks</th>
        </tr>

        {{-- Data rows --}}
        @foreach ($prepositionedInventory as $item)
            <tr>
                <td style="border:1px solid #000; padding:2px;">{{ $item->item_name }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->quantity }}</td>
                <td style="border:1px solid #000; padding:2px;">{{ $item->remarks }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No prepositioned inventory data available.</p>
@endif

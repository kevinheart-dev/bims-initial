@if (isset($equipmentInventory) && $equipmentInventory->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <th style="border:1px solid #000; padding:2px; text-align:center;">Equipment</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Put a check (✓) if the items are found in
                the barangay and cross (x) if they are
                not</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Quantity</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Location of the equipment</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Remarks</th>

        </tr>

        {{-- Data rows --}}
        @foreach ($equipmentInventory as $item)
            <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->item }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    @if ($item->availability == 'checked')
                        <img src="{{ public_path('images/check.png') }}" style="width:12px; height:12px;" />
                    @else
                        <img src="{{ public_path('images/close.png') }}" style="width:12px; height:12px;" />
                    @endif
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->quantity }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->location }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->remarks }}
                </td>
            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No Equiment Inventory data available.</p>
@endif

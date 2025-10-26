@if (isset($reliefDistribution) && $reliefDistribution->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <th style="border:1px solid #000; padding:2px; text-align:center;">Name of Evacuation Center</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Type of Relief Goods</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Quantity</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Unit</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Name of Beneficiaries</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Beneficiaries’ Address</th>
        </tr>

        {{-- Data rows --}}
        @foreach ($reliefDistribution as $item)
            <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->evacuation_center }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->relief_good }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->quantity }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->unit }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->beneficiaries }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->address }}</td>
            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No relief disstribution data available.</p>
@endif

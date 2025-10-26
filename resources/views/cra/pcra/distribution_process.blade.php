@if (isset($distributionProcess) && $distributionProcess->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            {{-- <th style="border:1px solid #000; padding:2px; text-align:center;">no</th> --}}
            <th style="border:1px solid #000; padding:2px; text-align:center;">Distribution Process</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Origin of Relief Goods</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Challenge/ Status/ Remarks</th>

        </tr>

        {{-- Data rows --}}
        @foreach ($distributionProcess as $item)
            <tr>
                {{-- <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->step_no }}</td> --}}
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->distribution_process }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->origin_of_goods }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->remarks }}
                </td>

            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No relief disstribution data available.</p>
@endif

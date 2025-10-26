@if (isset($bdrrmcDirectory) && $bdrrmcDirectory->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">

            <th style="border:1px solid #000; padding:2px; text-align:center;">DESIGNATION/TEAM</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">NAME</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">CONTACT NO.</th>
        </tr>

        {{-- Data rows --}}
        @foreach ($bdrrmcDirectory as $item)
            <tr>

                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->designation_team }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->name }}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->contact_no }}
                </td>

            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No BDRRMC DIRECTORY data available.</p>
@endif

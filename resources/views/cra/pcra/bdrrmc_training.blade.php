@if (isset($bdrrmcTraining) && $bdrrmcTraining->isNotEmpty())
    <table
        style="width:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; word-wrap:break-word; margin-bottom:10px;"
        border="1">
        {{-- Header row --}}
        <tr style="background-color:#f3f3f3; font-weight:bold;">
            <th style="border:1px solid #000; padding:2px; text-align:center;">Title of the training</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Put a check if the item applies () and
                cross (x) if it does not</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Duration of training</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Agency or organization that provided the
                training</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Inclusive dates of the training</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Number of participants</th>
            <th style="border:1px solid #000; padding:2px; text-align:center;">Name of persons attended/ participated
            </th>
        </tr>

        {{-- Data rows --}}
        @foreach ($bdrrmcTraining as $item)
            <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->title }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">
                    @if ($item->status == 'checked')
                        <img src="{{ public_path('images/check.png') }}" style="width:12px; height:12px;" />
                    @else
                        <img src="{{ public_path('images/close.png') }}" style="width:12px; height:12px;" />
                    @endif
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->duration }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->agency }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->inclusive_dates }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->number_of_participants }}
                </td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">{{ $item->participants }}
                </td>
            </tr>
        @endforeach
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">No BDRRMC training data available.</p>
@endif

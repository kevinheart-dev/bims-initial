<table>
    <thead>
        <tr>
            <th>TYPE OF OWNERSHIP</th>
            <th>QUANTITY</th>
        </tr>
    </thead>
    <tbody>
        @php
            $totalQuantity = 0;
        @endphp

        @foreach ($houseOwnership as $ownership)
            @php
                $totalQuantity += $ownership->quantity ?? 0;
            @endphp
            <tr>
                <td>{{ $ownership->ownership_type }}</td>
                <td>{{ $ownership->quantity }}</td>
            </tr>
        @endforeach

        <tr style="font-weight: bold; background-color: #f2f2f2;">
            <td style="text-align: left;">Total:</td>
            <td>{{ $totalQuantity }}</td>
        </tr>
    </tbody>
</table>

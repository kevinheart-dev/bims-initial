<table>
    <thead>
        <tr>
            <th>TYPE OF OWNERSHIP</th>
            <th>QUANTITY</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($houseOwnership as $ownership)
            <tr>
                <td>{{ $ownership->ownership_type }}</td>
                <td>{{ $ownership->quantity }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

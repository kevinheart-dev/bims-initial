<table>
    <thead>
        <tr>
            <th>TYPE OF HOUSE</th>
            <th>Number of Houses with 1 Floor</th>
            <th>Number of Houses with 2 or more Floors</th>
        </tr>
    </thead>
    <tbody>
        @php
            $totalOneFloor = 0;
            $totalTwoFloors = 0;
        @endphp

        @foreach ($houseBuild as $build)
            <tr>
                <td>{{ $build->house_type }}</td>
                <td>{{ $build->one_floor }}</td>
                <td>{{ $build->two_or_more_floors }}</td>
            </tr>

            @php
                $totalOneFloor += $build->one_floor;
                $totalTwoFloors += $build->two_or_more_floors;
            @endphp
        @endforeach

        <tr style="font-weight: bold; background-color: #f3f3f3;">
            <td>Total</td>
            <td>{{ $totalOneFloor }}</td>
            <td>{{ $totalTwoFloors }}</td>
        </tr>
    </tbody>
</table>

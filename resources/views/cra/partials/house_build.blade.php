<table>
    <thead>
        <tr>
            <th>TYPE OF HOUSE</th>
            <th>Number of Houses with 1 Floor</th>
            <th>Number of Houses with 2 or more Floors</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($houseBuild as $build)
            <tr>
                <td>{{ $build->house_type }}</td>
                <td>{{ $build->one_floor }}</td>
                <td>{{ $build->two_or_more_floors }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

<table class="table table-bordered">
    <thead>
        <tr>
            <th scope="col">Calamity/Disaster</th>
            @foreach ($disasterOccurance as $disaster)
                <th scope="col">{{ $disaster->disaster_name }}</th>
            @endforeach
            <th scope="col">Source of Information</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Year</th>
            @foreach ($disasterOccurance as $disaster)
                <td>{{ $disaster->year }}</td>
            @endforeach
            <td>Barangay</td>
        </tr>

    </tbody>
</table>

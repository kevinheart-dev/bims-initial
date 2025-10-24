@if ($disasterOccurance && count($disasterOccurance) > 0)
    <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 10px; margin-top: 10px;">
        <thead style="background-color: #f3f3f3;">
            <tr>
                <th rowspan="2" style="border: 1px solid #000; padding: 4px; width: 180px;">
                    Calamity / Disaster
                </th>

                {{-- Dynamically generate calamity names --}}
                @foreach ($disasterOccurance as $disaster)
                    <th colspan="2" style="border: 1px solid #000; padding: 4px;">
                        {{ $disaster->disaster_name }}
                    </th>
                @endforeach
            </tr>

            <tr>
                {{-- Subheader for each disaster --}}
                @foreach ($disasterOccurance as $disaster)
                    <th style="border: 1px solid #000; padding: 4px;">Year</th>
                    <th style="border: 1px solid #000; padding: 4px;">Source of Information</th>
                @endforeach
            </tr>
        </thead>

        <tbody>
            {{-- Data Row Example (replace or extend as needed) --}}
            <tr>
                <td style="border: 1px solid #000; padding: 4px;">Example Entry</td>

                @foreach ($disasterOccurance as $disaster)
                    <td style="border: 1px solid #000; padding: 4px;">{{ $disaster->year }}</td>
                    <td style="border: 1px solid #000; padding: 4px;">Barangay</td>
                @endforeach
            </tr>
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No disaster occurrence data available.</p>
@endif

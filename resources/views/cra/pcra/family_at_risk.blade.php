@if (isset($familyatRisk) && $familyatRisk->isNotEmpty())
    @php
        $filtered = isset($barangayId) ? $familyatRisk->where('barangay_id', $barangayId) : $familyatRisk;

        // Group by purok_number
        $grouped = $filtered->groupBy('purok_number');

        $indicators = [
            'Number of Informal Settler Families',
            'Number of Employed Individuals',
            'Number of Families Aware of the Effects of Risks and Hazards',
            'Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)',
            'Number of Families who received Financial Assistance',
            'Number of Families with Access to Early Warning System',
        ];
    @endphp

    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead style="background-color: #f3f3f3;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px;">Purok</th>
                @foreach ($indicators as $label)
                    <th style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $label }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($grouped as $purok => $records)
                <tr>
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $purok }}</td>
                    @foreach ($indicators as $indicator)
                        @php
                            // Try to find the record that matches this indicator (case-insensitive)
                            $record = $records->first(function ($item) use ($indicator) {
                                return trim(strtolower($item->indicator)) === trim(strtolower($indicator));
                            });
                        @endphp
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                            {{ $record ? $record->count : 0 }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="text-align: center; font-size: 12px;">No family at risk data available.</p>
@endif

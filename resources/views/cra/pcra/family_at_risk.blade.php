@if (isset($familyatRisk) && $familyatRisk->isNotEmpty())
    @php
        // Group by purok number
        $grouped = $familyatRisk->groupBy('purok_number');

        // Indicator keywords for flexible matching
        $indicators = [
            'Informal Settler' => 'Number of Informal Settler Families',
            'Employed Individuals' => 'Number of Employed Individuals',
            'Aware of the Effects' => 'Number of Families Aware of the Effects of Risks and Hazards',
            'Access to Information' =>
                'Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)',
            'Financial Assistance' => 'Number of Families who received Financial Assistance',
            'Early Warning' => 'Number of Families with Access to Early Warning System',
        ];
    @endphp

    <table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
        <thead style="background-color: #f3f3f3; display: table-row-group;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px; text-align: center;">Purok</th>
                @foreach ($indicators as $label)
                    <th style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $label }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($grouped as $purok => $records)
                <tr style="page-break-inside: avoid;">
                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">Purok {{ $purok }}</td>
                    @foreach ($indicators as $key => $label)
                        @php
                            // Match indicator by keyword instead of exact match
                            $record = $records->first(function ($item) use ($key) {
                                return stripos($item->indicator, $key) !== false;
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
    <p style="text-align: center; font-size: 12px; margin-top: 10px;">
        No family at risk data available.
    </p>
@endif

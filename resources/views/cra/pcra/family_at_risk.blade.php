@if (isset($familyatRisk) && $familyatRisk->isNotEmpty())
    @foreach ($familyatRisk as $barangayData)
        @php
            $puroks = collect($barangayData['puroks'] ?? []);
            $indicatorList = [
                'Number of Informal Settler Families',
                'Number of Employed Individuals',
                'Number of Families Aware of the Effects of Risks and Hazards',
                'Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)',
                'Number of Families who received Financial Assistance',
                'Number of Families with Access to Early Warning System',
            ];
        @endphp

        <table
            style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; page-break-inside: auto;">
            <tr>
                <th style="border: 1px solid #000; padding: 5px; text-align: center;">Purok</th>
                @foreach ($indicatorList as $indicator)
                    <th style="border: 1px solid #000; padding: 5px; text-align: center;">{{ $indicator }}</th>
                @endforeach
            </tr>

            <tbody>
                @forelse ($puroks as $purok)
                    @php
                        $indicators = collect($purok['indicators'] ?? []);
                    @endphp
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">
                            {{ $purok['purok_number'] ?? 'N/A' }}
                        </td>
                        @foreach ($indicatorList as $indicator)
                            @php
                                $record = $indicators->first(function ($item) use ($indicator) {
                                    return trim(strtolower($item['indicator'] ?? '')) === trim(strtolower($indicator));
                                });
                                $count = $record['total_count'] ?? 0;
                            @endphp
                            <td style="border: 1px solid #000; padding: 5px; text-align: center;">
                                {{ $count }}
                            </td>
                        @endforeach
                    </tr>
                @empty
                    <tr>
                        <td colspan="{{ count($indicatorList) + 1 }}" style="text-align: center; padding: 5px;">
                            No data available.
                        </td>
                    </tr>
                @endforelse
            </tbody>
            <tfoot style="background-color: #f5f5f5; font-weight: bold; display: table-row-group;">
                <tr>
                    <td style="border: 1px solid #000; padding: 5px; text-align: center;">Total</td>
                    @foreach ($indicatorList as $indicator)
                        @php
                            $total = $puroks->sum(function ($purok) use ($indicator) {
                                $indicators = collect($purok['indicators'] ?? []);
                                $record = $indicators->first(function ($item) use ($indicator) {
                                    return trim(strtolower($item['indicator'] ?? '')) === trim(strtolower($indicator));
                                });
                                return $record['total_count'] ?? 0;
                            });
                        @endphp
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">
                            {{ $total }}
                        </td>
                    @endforeach
                </tr>
            </tfoot>
        </table>
    @endforeach
@else
    <p style="text-align: center; font-size: 12px;">No family at risk data available.</p>
@endif

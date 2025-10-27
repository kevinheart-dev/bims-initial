@if ($humanResources && count($humanResources) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; page-break-inside: auto;">
        <thead style="background-color: #f3f3f3;">
            {{-- First row: Main header --}}
            <tr>
                <th rowspan="3"
                    style="border: 1px solid #000; padding: 4px; width: 250px; text-align: center; vertical-align: middle;">
                    HUMAN RESOURCES</th>
                <th colspan="6" style="border: 1px solid #000; padding: 4px; text-align: center;">NUMBER</th>
            </tr>
            {{-- Second row: Gender headers --}}
            <tr>
                <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">Male</th>
                <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">Female</th>
                <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center;">LGBTQ+</th>
            </tr>
            {{-- Third row: Disability status headers (ensure even width distribution) --}}
            <tr>
                {{-- Male --}}
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    Without Disability</th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    With Disability</th>
                {{-- Female --}}
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    Without Disability</th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    With Disability</th>
                {{-- LGBTQ+ --}}
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    Without Disability</th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center; width: calc((100% - 250px) / 6);">
                    With Disability</th>
            </tr>
        </thead>

        <tbody style="display: table-row-group;">
            @php
                $grouped = collect($humanResources)->groupBy('category');
                $counter = 1;
            @endphp

            @foreach ($grouped as $category => $resources)
                {{-- Category Header --}}
                <tr style="font-weight: bold; background-color: #f9f9f9; page-break-inside: avoid;">
                    <td colspan="7" style="border: 1px solid #000; padding: 4px;">
                        {{ $counter++ }}. {{ $category }}
                    </td>
                </tr>

                {{-- Data Rows --}}
                @foreach ($resources as $index => $res)
                    <tr style="page-break-inside: avoid;">
                        <td style="border: 1px solid #000; padding: 4px;">
                            {{ chr(65 + $index) }}. {{ $res->resource_name }}
                        </td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->male_without_disability }}</td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->male_with_disability }}</td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->female_without_disability }}
                        </td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->female_with_disability }}</td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->lgbtq_without_disability }}
                        </td>
                        <td style="border: 1px solid #000; text-align: center;">{{ $res->lgbtq_with_disability }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No human resources data available.</p>
@endif
